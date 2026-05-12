import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { getClaimById as getClaim } from "@/lib/store";

export default async function EvidenceTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold">Estimate-to-Evidence Match</h2>
        <p className="text-[12px] text-app-muted">
          Every line item paired with the photos, logs and notes we located.
        </p>
      </div>

      <div className="space-y-3">
        {claim.line_items.map((li) => (
          <Card key={li.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold">
                    {li.description}
                  </span>
                  <span className="font-mono text-[11px] text-app-muted">
                    {li.code}
                  </span>
                  <Badge tone="muted">{li.room}</Badge>
                  <Badge tone="neutral">
                    {li.quantity} {li.unit}
                  </Badge>
                </div>
                {li.recommended_action && (
                  <p className="mt-2 text-[13px] text-app-text">
                    <span className="font-medium">Recommended:</span>{" "}
                    {li.recommended_action}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-[11px] text-app-muted">
                  Confidence
                  <div className="text-[13px] font-semibold text-app-text">
                    {li.confidence}%
                  </div>
                </div>
                <RiskBadge level={li.risk} />
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-app-border bg-app-bg p-3">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4" /> Evidence found
                </div>
                <ul className="mt-2 space-y-1 text-[13px]">
                  {li.evidence_found.length > 0 ? (
                    li.evidence_found.map((e) => <li key={e}>· {e}</li>)
                  ) : (
                    <li className="text-app-muted">No evidence found</li>
                  )}
                </ul>
              </div>
              <div className="rounded-lg border border-app-border bg-app-bg p-3">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-risk">
                  <XCircle className="h-4 w-4" /> Evidence missing
                </div>
                <ul className="mt-2 space-y-1 text-[13px]">
                  {li.evidence_missing.length > 0 ? (
                    li.evidence_missing.map((e) => <li key={e}>· {e}</li>)
                  ) : (
                    <li className="text-app-muted">None — line item supported</li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
