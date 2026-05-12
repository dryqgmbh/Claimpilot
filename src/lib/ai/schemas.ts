import { z } from "zod";

export const RiskSchema = z.enum(["low", "medium", "high", "critical"]);
export type Risk = z.infer<typeof RiskSchema>;

export const FileCategorySchema = z.enum([
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
]);
export type FileCategory = z.infer<typeof FileCategorySchema>;

// ----------------------------------------------------------------------------
// Classifier: file → category + brief description
// ----------------------------------------------------------------------------

export const FileClassificationSchema = z.object({
  category: FileCategorySchema,
  confidence_pct: z.number().min(0).max(100),
  description: z.string().min(1).max(280),
  tags: z.array(z.string()).max(10).default([]),
  room_hint: z.string().nullable().default(null),
});
export type FileClassification = z.infer<typeof FileClassificationSchema>;

// ----------------------------------------------------------------------------
// Auditor: produces structured findings for a claim
// ----------------------------------------------------------------------------

export const FindingTypeSchema = z.enum([
  "missing_doc",
  "weak_evidence",
  "inconsistency",
  "adjuster_question",
  "supplement_candidate",
  "equipment_overuse",
  "log_gap",
]);

export const AuditFindingSchema = z.object({
  id: z.string(),
  type: FindingTypeSchema,
  severity: RiskSchema,
  confidence_pct: z.number().min(0).max(100),
  message: z.string().min(5).max(360),
  evidence_refs: z.array(z.string()).default([]),
  related_line_item_id: z.string().nullable().default(null),
  suggested_action: z.string().min(5).max(360),
});
export type AuditFinding = z.infer<typeof AuditFindingSchema>;

export const SubScoreInputSchema = z.object({
  key: z.enum([
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
  ]),
  value: z.number().min(0).max(100),
  rationale: z.string().min(1).max(280),
});

export const AdjusterQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(5).max(280),
  rationale: z.string().min(5).max(360),
  pre_answer_hint: z.string().min(5).max(360),
  severity: RiskSchema,
  related_line_item_id: z.string().nullable().default(null),
});
export type AdjusterQuestionAI = z.infer<typeof AdjusterQuestionSchema>;

export const MissingRequirementSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  category: z.enum(["photo", "log", "doc", "narrative"]),
  severity: RiskSchema,
});
export type MissingRequirementAI = z.infer<typeof MissingRequirementSchema>;

export const AuditResultSchema = z.object({
  summary: z.string().min(20).max(1200),
  sub_scores: z.array(SubScoreInputSchema).min(1).max(10),
  findings: z.array(AuditFindingSchema).min(0).max(40),
  questions: z.array(AdjusterQuestionSchema).min(0).max(20),
  missing: z.array(MissingRequirementSchema).min(0).max(40),
  narrative_draft: z.string().min(40).max(4000),
});
export type AuditResult = z.infer<typeof AuditResultSchema>;

// ----------------------------------------------------------------------------
// Verifier: validates a single critical finding against listed evidence
// ----------------------------------------------------------------------------

export const VerifierResultSchema = z.object({
  finding_id: z.string(),
  status: z.enum(["supported", "partially", "not_supported"]),
  reasoning: z.string().min(5).max(600),
});
export type VerifierResult = z.infer<typeof VerifierResultSchema>;
