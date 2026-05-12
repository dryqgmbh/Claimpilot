import type { SubScore } from "@/lib/scoring";
import type { RiskLevel } from "@/components/ui/risk-badge";

export type ClaimType = "water" | "mold" | "fire" | "roof" | "recon";
export type WaterCat = 1 | 2 | 3;
export type ClaimStatus =
  | "intake"
  | "analyzing"
  | "needs-review"
  | "submission-ready"
  | "submitted"
  | "supplement"
  | "closed";

export type FindingType =
  | "missing_doc"
  | "weak_evidence"
  | "inconsistency"
  | "adjuster_question"
  | "supplement_candidate"
  | "equipment_overuse"
  | "log_gap";

export interface FileItem {
  id: string;
  name: string;
  category:
    | "estimate"
    | "insurance_estimate"
    | "photo"
    | "moisture_log"
    | "drying_log"
    | "sketch"
    | "authorization"
    | "correspondence"
    | "invoice"
    | "video"
    | "other";
  size_kb: number;
  uploaded_at: string;
  uploaded_by: string;
  parse_status: "queued" | "parsing" | "parsed" | "error";
  tags?: string[];
  room?: string;
}

export interface EstimateLineItem {
  id: string;
  source: "contractor" | "insurance";
  code: string;
  description: string;
  room: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  evidence_found: string[];
  evidence_missing: string[];
  risk: RiskLevel;
  confidence: number;
  recommended_action?: string;
}

export interface MoistureReading {
  id: string;
  day: number;
  date: string;
  room: string;
  material: string;
  reading_pct: number;
  equipment?: string;
}

export interface DryingLogEntry {
  id: string;
  day: number;
  date: string;
  equipment: string[];
  temp_f: number;
  rh_pct: number;
  gpp: number;
  status: "ok" | "missing" | "anomaly";
  notes?: string;
}

export interface MissingRequirement {
  id: string;
  key: string;
  label: string;
  category: "photo" | "log" | "doc" | "narrative";
  status: "open" | "satisfied";
  assignee?: string;
  due_at?: string;
  severity: RiskLevel;
}

export interface AdjusterQuestion {
  id: string;
  question: string;
  rationale: string;
  pre_answer_hint: string;
  severity: RiskLevel;
  related_line_item_id?: string;
}

export interface QAFinding {
  id: string;
  type: FindingType;
  severity: RiskLevel;
  confidence: number;
  message: string;
  evidence_refs: string[];
  related_line_item_id?: string;
  suggested_action: string;
}

export interface ClaimTask {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  status: "open" | "in_progress" | "done";
  priority: "low" | "med" | "high";
  due_at?: string;
  related_finding_id?: string;
}

export interface ReportRecord {
  id: string;
  kind:
    | "claim_qa"
    | "missing_docs"
    | "adjuster_risk"
    | "supplement_readiness"
    | "estimator_notes"
    | "customer_summary";
  generated_at: string;
  generated_by: string;
  whitelabel: boolean;
}

export interface Claim {
  id: string;
  number: string;
  org_id: string;
  type: ClaimType;
  cat?: WaterCat;
  status: ClaimStatus;
  policyholder: string;
  address: string;
  loss_date: string;
  cause_of_loss: string;
  carrier: string;
  adjuster_name?: string;
  claim_number_carrier?: string;
  rcv?: number;
  acv?: number;
  created_at: string;
  updated_at: string;
  score: number;
  sub_scores: SubScore[];
  files: FileItem[];
  line_items: EstimateLineItem[];
  moisture: MoistureReading[];
  drying: DryingLogEntry[];
  missing: MissingRequirement[];
  questions: AdjusterQuestion[];
  findings: QAFinding[];
  tasks: ClaimTask[];
  reports: ReportRecord[];
  narrative_draft: string;
}
