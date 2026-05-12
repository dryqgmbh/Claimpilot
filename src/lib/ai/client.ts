import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  AuditResultSchema,
  FileClassificationSchema,
  VerifierResultSchema,
  type AuditResult,
  type FileClassification,
  type VerifierResult,
} from "./schemas";
import {
  AUDITOR_SYSTEM,
  AUDIT_TOOL_SCHEMA,
  CLASSIFIER_SYSTEM,
  CLASSIFIER_TOOL_SCHEMA,
  VERIFIER_SYSTEM,
  VERIFIER_TOOL_SCHEMA,
} from "./prompts";

// Model IDs per ScopePilot routing strategy
export const MODELS = {
  classifier: "claude-haiku-4-5-20251001",
  auditor: "claude-sonnet-4-6",
  verifier: "claude-opus-4-7",
} as const;

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = apiKey ? new Anthropic({ apiKey }) : null;

export const aiMode: "live" | "mock" = client ? "live" : "mock";

/**
 * Helper: pull the tool_use input out of a Claude response.
 */
function extractToolInput<T = unknown>(
  response: Anthropic.Messages.Message,
  toolName: string,
): T {
  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === toolName) {
      return block.input as T;
    }
  }
  throw new Error(
    `Anthropic response did not contain a ${toolName} tool_use block`,
  );
}

// ---------------------------------------------------------------------------
// Classifier
// ---------------------------------------------------------------------------

export async function classifyFile(input: {
  filename: string;
  mime: string;
  size_kb: number;
  excerpt?: string;
}): Promise<FileClassification> {
  if (!client) return mockClassify(input);

  const response = await client.messages.create({
    model: MODELS.classifier,
    max_tokens: 512,
    system: CLASSIFIER_SYSTEM,
    tools: [
      {
        name: "submit_classification",
        description: "Submit the file classification result.",
        input_schema: CLASSIFIER_TOOL_SCHEMA as unknown as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: "submit_classification" },
    messages: [
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  const raw = extractToolInput(response, "submit_classification");
  return FileClassificationSchema.parse(raw);
}

// ---------------------------------------------------------------------------
// Auditor
// ---------------------------------------------------------------------------

export interface AuditorInput {
  claim: {
    id: string;
    type: string;
    cat?: number | null;
    cause_of_loss: string;
    address: string;
    carrier: string;
    loss_date: string;
  };
  files: Array<{ id: string; name: string; category: string; tags?: string[] }>;
  line_items: Array<{
    id: string;
    code: string;
    description: string;
    room: string;
    quantity: number;
    unit: string;
    total: number;
  }>;
  moisture: Array<{
    id: string;
    day: number;
    room: string;
    material: string;
    reading_pct: number;
  }>;
  drying: Array<{
    id: string;
    day: number;
    equipment: string[];
    temp_f: number;
    rh_pct: number;
    gpp: number;
    status: string;
  }>;
}

export async function runAudit(input: AuditorInput): Promise<AuditResult> {
  if (!client) return mockAudit(input);

  const response = await client.messages.create({
    model: MODELS.auditor,
    max_tokens: 8000,
    system: AUDITOR_SYSTEM,
    tools: [
      {
        name: "submit_audit",
        description:
          "Submit the structured ScopePilot claim audit. Output MUST satisfy the schema.",
        input_schema: AUDIT_TOOL_SCHEMA as unknown as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: "submit_audit" },
    messages: [
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  const raw = extractToolInput(response, "submit_audit");
  return AuditResultSchema.parse(raw);
}

// ---------------------------------------------------------------------------
// Verifier (only run on critical findings)
// ---------------------------------------------------------------------------

export async function verifyFinding(input: {
  finding: {
    id: string;
    type: string;
    severity: string;
    message: string;
    suggested_action: string;
  };
  evidence: Array<{ id: string; kind: string; summary: string }>;
}): Promise<VerifierResult> {
  if (!client) return mockVerify(input);

  const response = await client.messages.create({
    model: MODELS.verifier,
    max_tokens: 1024,
    system: VERIFIER_SYSTEM,
    tools: [
      {
        name: "submit_verification",
        description: "Submit the verification result for a single finding.",
        input_schema: VERIFIER_TOOL_SCHEMA as unknown as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: "submit_verification" },
    messages: [
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  const raw = extractToolInput(response, "submit_verification");
  return VerifierResultSchema.parse(raw);
}

// ---------------------------------------------------------------------------
// Mock fallbacks — produce deterministic, evidence-grounded fixtures so the
// pipeline is fully testable without an API key.
// ---------------------------------------------------------------------------

function mockClassify(input: {
  filename: string;
  mime: string;
  size_kb: number;
}): FileClassification {
  const name = input.filename.toLowerCase();
  const cat: FileClassification["category"] = name.includes("xactimate")
    ? "estimate"
    : name.includes("insurance")
      ? "insurance_estimate"
      : name.includes("photo") || input.mime.startsWith("image/")
        ? "photo"
        : name.includes("moisture")
          ? "moisture_log"
          : name.includes("drying")
            ? "drying_log"
            : name.includes("sketch") || name.includes("floor")
              ? "sketch"
              : name.includes("auth")
                ? "authorization"
                : name.includes("email") || name.includes("correspond")
                  ? "correspondence"
                  : name.includes("invoice")
                    ? "invoice"
                    : input.mime.startsWith("video/")
                      ? "video"
                      : "other";

  return {
    category: cat,
    confidence_pct: 78,
    description: `Heuristic classification based on filename and mime type.`,
    tags: [],
    room_hint: null,
  };
}

function mockAudit(input: AuditorInput): AuditResult {
  const findings = [
    {
      id: "fnd_mock_log_gap",
      type: "log_gap" as const,
      severity: "critical" as const,
      confidence_pct: 94,
      message:
        "Drying log appears incomplete across the mitigation window. At least one day has no equipment entry.",
      evidence_refs: input.drying
        .filter((d) => d.status !== "ok")
        .map((d) => d.id),
      related_line_item_id: null,
      suggested_action: "Upload the missing drying log day or document the gap.",
    },
    {
      id: "fnd_mock_weak_evidence",
      type: "weak_evidence" as const,
      severity: "medium" as const,
      confidence_pct: 81,
      message:
        "Several line items appear to lack matching photo or log evidence.",
      evidence_refs: input.line_items.slice(0, 1).map((li) => li.id),
      related_line_item_id: input.line_items[0]?.id ?? null,
      suggested_action:
        "Re-photo flagged areas with measuring tape, or add F9 notes.",
    },
  ];

  return {
    summary: `Mock audit for ${input.claim.type} claim at ${input.claim.address}. This audit runs in mock mode because no ANTHROPIC_API_KEY was configured. Findings are illustrative — wire up the API key for real reasoning.`,
    sub_scores: [
      { key: "photo_completeness", value: 68, rationale: "Mock baseline" },
      { key: "moisture_documentation", value: 75, rationale: "Mock baseline" },
      { key: "drying_log_quality", value: 60, rationale: "Mock baseline" },
      { key: "estimate_evidence_match", value: 72, rationale: "Mock baseline" },
      { key: "equipment_justification", value: 65, rationale: "Mock baseline" },
      { key: "room_consistency", value: 78, rationale: "Mock baseline" },
      { key: "timeline_consistency", value: 70, rationale: "Mock baseline" },
      { key: "supplement_readiness", value: 66, rationale: "Mock baseline" },
      { key: "adjuster_risk", value: 64, rationale: "Mock baseline" },
      { key: "documentation_strength", value: 74, rationale: "Mock baseline" },
    ],
    findings,
    questions: [
      {
        id: "q_mock_1",
        question: "Please provide the missing drying log day.",
        rationale: "A day in the mitigation window has no equipment record.",
        pre_answer_hint:
          "Upload the missing log or add a written note explaining the gap.",
        severity: "high",
        related_line_item_id: null,
      },
    ],
    missing: [
      {
        id: "mr_mock_log",
        key: "drying_log_full_coverage",
        label: "Complete drying log day coverage",
        category: "log",
        severity: "high",
      },
    ],
    narrative_draft:
      "MOCK NARRATIVE: A factual mitigation narrative would be drafted here from your uploaded materials. Configure ANTHROPIC_API_KEY to enable real narrative generation. The structure follows: loss summary, mitigation steps, drying process, findings, scope justification — strictly based on uploaded evidence.",
  };
}

function mockVerify(input: {
  finding: { id: string };
}): VerifierResult {
  return {
    finding_id: input.finding.id,
    status: "supported",
    reasoning:
      "MOCK VERIFICATION: Returning supported by default. Configure ANTHROPIC_API_KEY for real verification.",
  };
}
