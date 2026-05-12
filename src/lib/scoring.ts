export type ScoreBand =
  | "submission-ready"
  | "strong"
  | "needs-review"
  | "high-risk"
  | "not-ready";

export interface SubScore {
  key: SubScoreKey;
  label: string;
  description: string;
  value: number;
  weight: number;
}

export type SubScoreKey =
  | "photo_completeness"
  | "moisture_documentation"
  | "drying_log_quality"
  | "estimate_evidence_match"
  | "equipment_justification"
  | "room_consistency"
  | "timeline_consistency"
  | "supplement_readiness"
  | "adjuster_risk"
  | "documentation_strength";

export const SUB_SCORE_DEFS: Record<
  SubScoreKey,
  { label: string; description: string; weight: number }
> = {
  photo_completeness: {
    label: "Photo Completeness",
    description:
      "Required photo types per claim type are present, sharp, and properly geo/timestamped.",
    weight: 0.12,
  },
  moisture_documentation: {
    label: "Moisture Documentation",
    description:
      "Daily moisture readings across all affected materials with documented dry standard.",
    weight: 0.12,
  },
  drying_log_quality: {
    label: "Drying Log Quality",
    description:
      "Daily equipment, temperature, RH and GPP recorded with decreasing trend.",
    weight: 0.1,
  },
  estimate_evidence_match: {
    label: "Estimate-to-Evidence Match",
    description: "Share of estimate line items with supporting evidence.",
    weight: 0.15,
  },
  equipment_justification: {
    label: "Equipment Justification",
    description:
      "Air mover, dehu and AFD counts align with S500 guidance for class/area.",
    weight: 0.08,
  },
  room_consistency: {
    label: "Room-by-Room Consistency",
    description: "Rooms match across estimate, photos, logs and sketch.",
    weight: 0.08,
  },
  timeline_consistency: {
    label: "Timeline Consistency",
    description: "Loss, mitigation, drying and completion timeline has no gaps.",
    weight: 0.07,
  },
  supplement_readiness: {
    label: "Supplement Readiness",
    description: "Field-documented items missing from estimate are surfaced.",
    weight: 0.06,
  },
  adjuster_risk: {
    label: "Adjuster Risk",
    description: "Count and severity of likely adjuster questions.",
    weight: 0.12,
  },
  documentation_strength: {
    label: "Overall Documentation Strength",
    description:
      "Authorization, IICRC certifications, source-of-loss documentation and notes.",
    weight: 0.1,
  },
};

export function aggregate(subs: SubScore[]): number {
  const weighted = subs.reduce((acc, s) => acc + s.value * s.weight, 0);
  const overall = Math.round(weighted);
  // Floor rule: if any component < 30, cap overall at 79
  const hasCritical = subs.some((s) => s.value < 30);
  return hasCritical ? Math.min(overall, 79) : overall;
}

export function scoreBand(value: number): ScoreBand {
  if (value >= 90) return "submission-ready";
  if (value >= 75) return "strong";
  if (value >= 60) return "needs-review";
  if (value >= 40) return "high-risk";
  return "not-ready";
}

export function bandLabel(band: ScoreBand): string {
  switch (band) {
    case "submission-ready":
      return "Submission Ready";
    case "strong":
      return "Strong — Minor Fixes";
    case "needs-review":
      return "Needs Review";
    case "high-risk":
      return "High Risk";
    case "not-ready":
      return "Not Submission Ready";
  }
}
