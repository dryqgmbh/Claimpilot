import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { SubScoreCard } from "@/components/sub-score-card";
import { getClaimById as getClaim } from "@/lib/store";

export default async function ClaimOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  const topFindings = [...claim.findings]
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[15px] font-semibold">Executive summary</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-app-text">
          {summarize(claim)}
        </p>
      </div>

      <div>
        <h2 className="text-[15px] font-semibold">Sub-score breakdown</h2>
        <p className="text-[12px] text-app-muted">
          Ten weighted signals that drive the overall Claim Quality Score.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {claim.sub_scores.map((s) => (
            <SubScoreCard key={s.key} sub={s} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-app-border p-5">
            <h2 className="text-[15px] font-semibold">Top findings</h2>
            <p className="text-[12px] text-app-muted">
              Highest-severity issues first. Each finding is evidence-bound.
            </p>
          </div>
          <ul className="divide-y divide-app-border">
            {topFindings.map((f) => (
              <li key={f.id} className="flex items-start gap-3 px-5 py-4">
                <div className="mt-0.5">
                  <AlertTriangle
                    className={
                      f.severity === "critical" || f.severity === "high"
                        ? "h-4 w-4 text-risk"
                        : "h-4 w-4 text-warning"
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-medium">{f.message}</span>
                    <RiskBadge level={f.severity} />
                    <span className="text-[11px] text-app-muted">
                      confidence {f.confidence}%
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-app-muted">
                    Suggested: {f.suggested_action}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold">What to do next</h3>
            <ul className="mt-3 space-y-2 text-[13px]">
              {claim.tasks
                .filter((t) => t.status !== "done")
                .slice(0, 5)
                .map((t) => (
                  <li
                    key={t.id}
                    className="flex items-start gap-2 rounded-md border border-app-border bg-app-bg px-3 py-2"
                  >
                    <Badge
                      tone={
                        t.priority === "high"
                          ? "risk"
                          : t.priority === "med"
                            ? "warning"
                            : "muted"
                      }
                    >
                      {t.priority}
                    </Badge>
                    <span className="flex-1">{t.title}</span>
                  </li>
                ))}
            </ul>
            <Link
              href={`/app/claims/${claim.id}/tasks`}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-brand"
            >
              View all tasks <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="text-[14px] font-semibold">Submission readiness</h3>
            <ul className="mt-3 space-y-2 text-[13px]">
              <Readiness done label="Authorization signed" />
              <Readiness
                done={claim.files.some((f) => f.category === "estimate")}
                label="Contractor estimate uploaded"
              />
              <Readiness
                done={claim.missing.filter((m) => m.severity === "critical" && m.status === "open").length === 0}
                label="No critical missing docs"
              />
              <Readiness
                done={claim.score >= 75}
                label="Claim Quality Score ≥ 75"
              />
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Readiness({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between rounded-md border border-app-border px-3 py-2">
      <span>{label}</span>
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-success" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-warning" />
      )}
    </li>
  );
}

function severityRank(s: string) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[s] ?? 0;
}

function summarize(claim: ReturnType<typeof getClaim>) {
  if (!claim) return "";
  const open = claim.missing.filter((m) => m.status === "open").length;
  const high = claim.findings.filter(
    (f) => f.severity === "critical" || f.severity === "high",
  ).length;
  return `This ${claim.type} claim currently scores ${claim.score} / 100. ${open} documentation items are open across photos, logs and narrative. ${high} high-severity findings were detected — none of which are pricing or coverage opinions. Address the highlighted line items and missing documentation before submitting to ${claim.carrier}.`;
}
