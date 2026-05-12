import Link from "next/link";
import { ArrowUpRight, AlertTriangle, ListChecks, Clock, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRingCompact } from "@/components/score-ring";
import { CLAIMS } from "@/lib/mock-data";
import { aggregate } from "@/lib/scoring";

export default function DashboardPage() {
  const avgScore = Math.round(
    CLAIMS.reduce((acc, c) => acc + c.score, 0) / CLAIMS.length,
  );
  const openTasks = CLAIMS.flatMap((c) => c.tasks).filter(
    (t) => t.status !== "done",
  );
  const submissionReady = CLAIMS.filter((c) => c.score >= 75).length;
  const highRiskClaims = CLAIMS.filter((c) => c.score < 60).length;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-[13px] text-app-muted">
            Pre-submission claim quality across your pipeline.
          </p>
        </div>
        <Badge tone="info">Growth plan · 14 of 40 audits used</Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Kpi
          label="Average Claim Score"
          value={avgScore.toString()}
          delta="+6 vs last 30d"
          tone="success"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <Kpi
          label="Submission Ready"
          value={`${submissionReady}/${CLAIMS.length}`}
          delta="claims at ≥ 75"
          tone="success"
          icon={<FileText className="h-4 w-4" />}
        />
        <Kpi
          label="High Risk Claims"
          value={highRiskClaims.toString()}
          delta="below score 60"
          tone="risk"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <Kpi
          label="Open Tasks"
          value={openTasks.length.toString()}
          delta="across all claims"
          tone="warning"
          icon={<ListChecks className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-app-border p-5">
            <div>
              <h2 className="text-[15px] font-semibold">Recent claims</h2>
              <p className="text-[12px] text-app-muted">
                Sorted by last update. Click to open the claim file.
              </p>
            </div>
            <Link
              href="/app/claims"
              className="text-[13px] font-medium text-brand"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-app-border">
            {CLAIMS.map((claim) => (
              <li key={claim.id}>
                <Link
                  href={`/app/claims/${claim.id}`}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-app-bg/60"
                >
                  <ScoreRingCompact value={claim.score} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{claim.policyholder}</span>
                      <Badge tone="muted">{claim.type.toUpperCase()}</Badge>
                      {claim.cat && <Badge tone="muted">Cat {claim.cat}</Badge>}
                      <Badge tone="neutral">{claim.carrier}</Badge>
                    </div>
                    <div className="mt-0.5 truncate text-[12px] text-app-muted">
                      {claim.address} · {claim.number}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] text-app-muted">
                      {claim.tasks.filter((t) => t.status !== "done").length} open tasks
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="border-b border-app-border p-5">
            <h2 className="text-[15px] font-semibold">Top open tasks</h2>
            <p className="text-[12px] text-app-muted">Across all active claims.</p>
          </div>
          <ul className="divide-y divide-app-border">
            {openTasks.slice(0, 6).map((task) => (
              <li
                key={task.id}
                className="flex items-start gap-3 px-5 py-3"
              >
                <div className="mt-0.5">
                  <Clock className="h-4 w-4 text-app-muted" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">
                    {task.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-app-muted">
                    Assigned to {task.assignee} · {task.priority.toUpperCase()}
                  </div>
                </div>
                <Badge
                  tone={
                    task.priority === "high"
                      ? "risk"
                      : task.priority === "med"
                        ? "warning"
                        : "muted"
                  }
                >
                  {task.priority}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <h3 className="text-[14px] font-semibold text-amber-900">
              Audit-Trail reminder
            </h3>
            <p className="mt-1 text-[12px] text-amber-900/80">
              All AI findings shown in ScopePilot are evidence-bound and include
              confidence levels. ScopePilot is a documentation QA tool, not a
              public adjuster. Final decisions rest with the contractor.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  tone,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "success" | "warning" | "risk";
  icon: React.ReactNode;
}) {
  const toneText =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-risk";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
          {label}
        </div>
        <div className={`grid h-7 w-7 place-items-center rounded-lg bg-app-bg ${toneText}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
      <div className={`mt-1 text-[12px] ${toneText}`}>{delta}</div>
    </Card>
  );
}
