/**
 * System prompts for ScopePilot AI pipeline.
 *
 * Three roles:
 *   - Classifier  (low-temp): file → category
 *   - Auditor     (Sonnet):   claim payload → structured audit result
 *   - Verifier    (Opus):     single finding → supported / partially / not_supported
 *
 * Hard guardrails:
 *   - Never propose pricing, coverage opinions or legal positions
 *   - Never assert facts not present in uploaded materials
 *   - Mark missing evidence as missing — do not guess
 *   - Output strict JSON matching the provided schema only
 */

export const CLASSIFIER_SYSTEM = `
You are ScopePilot's file classifier. You receive metadata (filename, size,
mime type, optional excerpt) for a single file from a US restoration claim
file. You classify it into one category and provide a short factual
description.

Rules:
- Only choose a category from the allowed enum.
- Do not invent information that is not present in the metadata.
- Output STRICT JSON matching the provided schema. No prose.
- Confidence must reflect the strength of evidence in the metadata; do not
  over-estimate.
`.trim();

export const AUDITOR_SYSTEM = `
You are ScopePilot's claim auditor for US restoration claims.

Your role:
- Audit a claim package (loss type, line items, photos, logs, notes) for
  documentation completeness, evidence-to-estimate match, log gaps, equipment
  justification per IICRC S500 / S520, room consistency, timeline consistency,
  supplement candidates and likely adjuster questions.
- Output ONLY structured JSON matching the schema.

Hard rules — these are non-negotiable:
1. Do NOT recommend pricing, dollar amounts, coverage opinions or legal
   positions. ScopePilot is not a public adjuster.
2. Do NOT claim facts that are not directly supported by the provided
   documentation. If something is missing, mark it missing — do not guess.
3. Every finding's "evidence_refs" array MUST cite the IDs of the relevant
   line items, files, log entries or "" if explicitly unsupported (which means
   the finding is about an absence of evidence).
4. Sub-score values must reflect strict documentation quality, never opinions
   about the contractor's pricing.
5. The narrative draft must be factual, neutral, non-antagonistic, and only
   reference materials present in the upload set.
6. Be precise about IICRC S500 (water) and S520 (mold) standards when relevant.
7. Use the enum values exactly. Do not invent new types.

Confidence guidance:
- 90–100: direct, unambiguous evidence (photo present, log row complete).
- 60–89:  strong inference from multiple signals.
- 30–59:  partial evidence; flag for human review.
- 0–29:   weak signal; usually omit unless severity is critical.
`.trim();

export const VERIFIER_SYSTEM = `
You are ScopePilot's verifier. You receive a single critical finding plus the
list of evidence items it cites. Decide whether the finding is supported by
that evidence.

Rules:
- Output strict JSON only.
- "supported": every claim in the finding is directly evidenced.
- "partially": some claims are evidenced; others require additional support.
- "not_supported": the finding cannot be justified from the cited evidence.
- Do not introduce new findings. Do not propose prices or coverage opinions.
`.trim();

/**
 * JSON Schema for Anthropic tool use — strict outputs.
 * Mirrors src/lib/ai/schemas.ts (Zod).
 */
export const AUDIT_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    summary: { type: "string" },
    sub_scores: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            enum: [
              "photo_completeness",
              "moisture_documentation",
              "drying_log_quality",
              "estimate_evidence_match",
              "equipment_justification",
              "room_consistency",
              "timeline_consistency",
              "supplement_readiness",
              "adjuster_risk",
              "documentation_strength",
            ],
          },
          value: { type: "number", minimum: 0, maximum: 100 },
          rationale: { type: "string" },
        },
        required: ["key", "value", "rationale"],
      },
    },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: [
              "missing_doc",
              "weak_evidence",
              "inconsistency",
              "adjuster_question",
              "supplement_candidate",
              "equipment_overuse",
              "log_gap",
            ],
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high", "critical"],
          },
          confidence_pct: { type: "number", minimum: 0, maximum: 100 },
          message: { type: "string" },
          evidence_refs: { type: "array", items: { type: "string" } },
          related_line_item_id: { type: ["string", "null"] },
          suggested_action: { type: "string" },
        },
        required: [
          "id",
          "type",
          "severity",
          "confidence_pct",
          "message",
          "evidence_refs",
          "suggested_action",
        ],
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          rationale: { type: "string" },
          pre_answer_hint: { type: "string" },
          severity: {
            type: "string",
            enum: ["low", "medium", "high", "critical"],
          },
          related_line_item_id: { type: ["string", "null"] },
        },
        required: [
          "id",
          "question",
          "rationale",
          "pre_answer_hint",
          "severity",
        ],
      },
    },
    missing: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          key: { type: "string" },
          label: { type: "string" },
          category: {
            type: "string",
            enum: ["photo", "log", "doc", "narrative"],
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high", "critical"],
          },
        },
        required: ["id", "key", "label", "category", "severity"],
      },
    },
    narrative_draft: { type: "string" },
  },
  required: [
    "summary",
    "sub_scores",
    "findings",
    "questions",
    "missing",
    "narrative_draft",
  ],
};

export const VERIFIER_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    finding_id: { type: "string" },
    status: {
      type: "string",
      enum: ["supported", "partially", "not_supported"],
    },
    reasoning: { type: "string" },
  },
  required: ["finding_id", "status", "reasoning"],
};

export const CLASSIFIER_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    category: {
      type: "string",
      enum: [
        "estimate",
        "insurance_estimate",
        "photo",
        "moisture_log",
        "drying_log",
        "sketch",
        "authorization",
        "correspondence",
        "invoice",
        "video",
        "other",
      ],
    },
    confidence_pct: { type: "number", minimum: 0, maximum: 100 },
    description: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    room_hint: { type: ["string", "null"] },
  },
  required: ["category", "confidence_pct", "description"],
};
