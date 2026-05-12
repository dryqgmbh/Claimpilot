import "server-only";
import { getClaimById, upsertClaim, setJob } from "@/lib/store";
import { aggregate, SUB_SCORE_DEFS } from "@/lib/scoring";
import { runAudit, verifyFinding, aiMode } from "./client";
import type { Claim, QAFinding, ClaimTask, MissingRequirement, AdjusterQuestion } from "@/types";
import type { AuditFinding } from "./schemas";

/**
 * Orchestrates the audit pipeline for a single claim.
 *
 *   parsing → matching → scoring → verifying → done
 *
 * Updates the claim record and a job record so the UI can poll progress.
 */
export async function orchestrateAudit(claim_id: string) {
  const claim = getClaimById(claim_id);
  if (!claim) throw new Error("Claim not found");

  const started_at = new Date().toISOString();
  setJob({
    claim_id,
    status: "queued",
    step: "Queued",
    progress_pct: 5,
    started_at,
  });

  try {
    // ── 1. Parsing ─────────────────────────────────────────────────────────
    setJob({
      claim_id,
      status: "parsing",
      step: "Parsing uploaded files",
      progress_pct: 20,
      started_at,
    });
    await sleep(400);

    // ── 2. Matching ────────────────────────────────────────────────────────
    setJob({
      claim_id,
      status: "matching",
      step: "Matching estimate items to evidence",
      progress_pct: 45,
      started_at,
    });
    await sleep(400);

    // ── 3. Scoring (LLM call) ─────────────────────────────────────────────
    setJob({
      claim_id,
      status: "scoring",
      step: "Running claim audit (Claude Sonnet)",
      progress_pct: 70,
      started_at,
    });

    const audit = await runAudit({
      claim: {
        id: claim.id,
        type: claim.type,
        cat: claim.cat ?? null,
        cause_of_loss: claim.cause_of_loss,
        address: claim.address,
        carrier: claim.carrier,
        loss_date: claim.loss_date,
      },
      files: claim.files.map((f) => ({
        id: f.id,
        name: f.name,
        category: f.category,
        tags: f.tags,
      })),
      line_items: claim.line_items.map((li) => ({
        id: li.id,
        code: li.code,
        description: li.description,
        room: li.room,
        quantity: li.quantity,
        unit: li.unit,
        total: li.total,
      })),
      moisture: claim.moisture.map((m) => ({
        id: m.id,
        day: m.day,
        room: m.room,
        material: m.material,
        reading_pct: m.reading_pct,
      })),
      drying: claim.drying.map((d) => ({
        id: d.id,
        day: d.day,
        equipment: d.equipment,
        temp_f: d.temp_f,
        rh_pct: d.rh_pct,
        gpp: d.gpp,
        status: d.status,
      })),
    });

    // ── 4. Verification — critical findings only ───────────────────────────
    setJob({
      claim_id,
      status: "verifying",
      step: "Verifying critical findings (Claude Opus)",
      progress_pct: 88,
      started_at,
    });

    const verifiedFindings = await verifyCriticalFindings(audit.findings, claim);

    // ── 5. Apply to claim ─────────────────────────────────────────────────
    applyAuditToClaim(claim, audit, verifiedFindings);
    upsertClaim(claim);

    setJob({
      claim_id,
      status: "done",
      step: `Audit complete · score ${claim.score}`,
      progress_pct: 100,
      started_at,
      finished_at: new Date().toISOString(),
    });

    return { claim, audit };
  } catch (err) {
    setJob({
      claim_id,
      status: "error",
      step: "Error",
      progress_pct: 0,
      started_at,
      finished_at: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

async function verifyCriticalFindings(
  findings: AuditFinding[],
  claim: Claim,
): Promise<AuditFinding[]> {
  const critical = findings.filter((f) => f.severity === "critical");
  if (critical.length === 0) return findings;

  // Only call the verifier in live mode to avoid hammering noop loops.
  if (aiMode === "mock") return findings;

  const results = await Promise.all(
    critical.map(async (f) => {
      const evidence = (f.evidence_refs ?? []).map((id) => ({
        id,
        kind: lookupKind(claim, id),
        summary: lookupSummary(claim, id),
      }));
      const verdict = await verifyFinding({
        finding: {
          id: f.id,
          type: f.type,
          severity: f.severity,
          message: f.message,
          suggested_action: f.suggested_action,
        },
        evidence,
      });

      // Degrade unverifiable findings to "high" + add a verifier note.
      if (verdict.status === "not_supported") {
        return {
          ...f,
          severity: "high" as const,
          message: `[NEEDS REVIEW] ${f.message}`,
        };
      }
      if (verdict.status === "partially") {
        return {
          ...f,
          severity: "high" as const,
        };
      }
      return f;
    }),
  );

  const verifiedById = new Map(results.map((r) => [r.id, r]));
  return findings.map((f) => verifiedById.get(f.id) ?? f);
}

function lookupKind(claim: Claim, ref: string): string {
  if (claim.files.some((x) => x.id === ref)) return "file";
  if (claim.line_items.some((x) => x.id === ref)) return "line_item";
  if (claim.moisture.some((x) => x.id === ref)) return "moisture_reading";
  if (claim.drying.some((x) => x.id === ref)) return "drying_log_entry";
  return "unknown";
}

function lookupSummary(claim: Claim, ref: string): string {
  const f = claim.files.find((x) => x.id === ref);
  if (f) return `File: ${f.name} (${f.category})`;
  const li = claim.line_items.find((x) => x.id === ref);
  if (li) return `Line: ${li.code} – ${li.description} (${li.room})`;
  const m = claim.moisture.find((x) => x.id === ref);
  if (m) return `Moisture: Day ${m.day} ${m.room} ${m.material} ${m.reading_pct}%`;
  const d = claim.drying.find((x) => x.id === ref);
  if (d) return `Drying: Day ${d.day} status=${d.status} equipment=${d.equipment.join(",")}`;
  return "Unknown reference";
}

function applyAuditToClaim(
  claim: Claim,
  audit: Awaited<ReturnType<typeof runAudit>>,
  verifiedFindings: AuditFinding[],
) {
  // Sub-scores (merge: AI provides values, we keep labels/weights from spec)
  claim.sub_scores = claim.sub_scores.map((existing) => {
    const ai = audit.sub_scores.find((s) => s.key === existing.key);
    return ai
      ? { ...existing, value: clamp(ai.value, 0, 100) }
      : existing;
  });

  // Add any keys not previously present
  for (const ai of audit.sub_scores) {
    if (!claim.sub_scores.some((s) => s.key === ai.key)) {
      const def = SUB_SCORE_DEFS[ai.key];
      claim.sub_scores.push({
        key: ai.key,
        label: def.label,
        description: def.description,
        weight: def.weight,
        value: clamp(ai.value, 0, 100),
      });
    }
  }

  // Aggregate overall score with floor rule
  claim.score = aggregate(claim.sub_scores);

  // Replace findings
  claim.findings = verifiedFindings.map<QAFinding>((f) => ({
    id: f.id,
    type: f.type,
    severity: f.severity,
    confidence: f.confidence_pct,
    message: f.message,
    evidence_refs: f.evidence_refs ?? [],
    related_line_item_id: f.related_line_item_id ?? undefined,
    suggested_action: f.suggested_action,
  }));

  // Replace adjuster questions
  claim.questions = audit.questions.map<AdjusterQuestion>((q) => ({
    id: q.id,
    question: q.question,
    rationale: q.rationale,
    pre_answer_hint: q.pre_answer_hint,
    severity: q.severity,
    related_line_item_id: q.related_line_item_id ?? undefined,
  }));

  // Replace missing requirements
  claim.missing = audit.missing.map<MissingRequirement>((m) => ({
    id: m.id,
    key: m.key,
    label: m.label,
    category: m.category,
    status: "open",
    severity: m.severity,
  }));

  // Generate tasks from findings (idempotent: only add if not already present)
  const existingTaskKeys = new Set(claim.tasks.map((t) => t.related_finding_id));
  for (const f of claim.findings) {
    if (!existingTaskKeys.has(f.id)) {
      const task: ClaimTask = {
        id: `task_${f.id}`,
        title: f.suggested_action,
        assignee: assigneeForFindingType(f.type),
        status: "open",
        priority:
          f.severity === "critical" || f.severity === "high"
            ? "high"
            : f.severity === "medium"
              ? "med"
              : "low",
        related_finding_id: f.id,
      };
      claim.tasks.push(task);
    }
  }

  // Narrative draft
  if (audit.narrative_draft && audit.narrative_draft.length > 50) {
    claim.narrative_draft = audit.narrative_draft;
  }

  claim.status =
    claim.score >= 90
      ? "submission-ready"
      : claim.score >= 60
        ? "needs-review"
        : "needs-review";
}

function assigneeForFindingType(t: AuditFinding["type"]): string {
  switch (t) {
    case "missing_doc":
    case "log_gap":
      return "Mitigation Manager";
    case "weak_evidence":
      return "Field Tech";
    case "supplement_candidate":
    case "equipment_overuse":
    case "inconsistency":
      return "Estimator";
    default:
      return "Estimator";
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
