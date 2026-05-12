import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { getClaim } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function EstimateTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  const total = claim.line_items.reduce((acc, li) => acc + li.total, 0);
  const counts = {
    low: claim.line_items.filter((l) => l.risk === "low").length,
    medium: claim.line_items.filter((l) => l.risk === "medium").length,
    high: claim.line_items.filter((l) => l.risk === "high").length,
    critical: claim.line_items.filter((l) => l.risk === "critical").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold">Estimate line items</h2>
          <p className="text-[12px] text-app-muted">
            Parsed from your contractor estimate. Risk levels reflect evidence
            strength, not pricing.
          </p>
        </div>
        <div className="text-right text-[13px]">
          <div className="text-app-muted">Estimate total (RCV)</div>
          <div className="text-xl font-bold tabular-nums">
            {formatCurrency(total)}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <RiskTile label="Low risk" value={counts.low} tone="success" />
        <RiskTile label="Medium risk" value={counts.medium} tone="warning" />
        <RiskTile label="High risk" value={counts.high} tone="risk" />
        <RiskTile label="Critical" value={counts.critical} tone="risk" />
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <THead>
            <TR>
              <TH>Line item</TH>
              <TH>Room</TH>
              <TH>Qty</TH>
              <TH>Total</TH>
              <TH>Risk</TH>
              <TH>Confidence</TH>
              <TH>Recommended action</TH>
            </TR>
          </THead>
          <TBody>
            {claim.line_items.map((li) => (
              <TR key={li.id}>
                <TD>
                  <div className="font-medium">{li.description}</div>
                  <div className="font-mono text-[11px] text-app-muted">
                    {li.code}
                  </div>
                </TD>
                <TD>{li.room}</TD>
                <TD className="tabular-nums">
                  {li.quantity} {li.unit}
                </TD>
                <TD className="font-mono tabular-nums">
                  {formatCurrency(li.total)}
                </TD>
                <TD>
                  <RiskBadge level={li.risk} />
                </TD>
                <TD className="tabular-nums">{li.confidence}%</TD>
                <TD className="max-w-md">
                  {li.recommended_action ? (
                    <span className="text-app-text">{li.recommended_action}</span>
                  ) : (
                    <span className="text-app-muted">—</span>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Badge tone="info">AI governance</Badge>
          <p className="text-[12px] text-app-muted">
            Risk levels are derived from evidence completeness only. ScopePilot
            never recommends pricing, coverage opinions or legal positions.
          </p>
        </div>
      </Card>
    </div>
  );
}

function RiskTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "risk";
}) {
  const text = {
    success: "text-success",
    warning: "text-warning",
    risk: "text-risk",
  }[tone];
  return (
    <Card className="p-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-app-muted">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${text}`}>
        {value}
      </div>
    </Card>
  );
}
