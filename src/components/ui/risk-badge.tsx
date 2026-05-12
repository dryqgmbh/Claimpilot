import { Badge } from "./badge";

export type RiskLevel = "low" | "medium" | "high" | "critical";

const toneMap = {
  low: "success",
  medium: "warning",
  high: "risk",
  critical: "risk",
} as const;

const labelMap = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
  critical: "Critical",
} as const;

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge tone={toneMap[level]}>{labelMap[level]}</Badge>;
}
