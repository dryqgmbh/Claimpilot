import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRingCompact } from "@/components/score-ring";
import { CLAIMS } from "@/lib/mock-data";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import type { ClaimStatus, Claim } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const COLUMNS: { id: ClaimStatus; label: string }[] = [
  { id: "intake", label: "Intake" },
  { id: "analyzing", label: "Analyzing" },
  { id: "needs-review", label: "Needs Review" },
  { id: "submission-ready", label: "Submission Ready" },
  { id: "submitted", label: "Submitted" },
  { id: "supplement", label: "Supplement" },
  { id: "closed", label: "Closed" },
];

export default function ClaimsPipelinePage() {
  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Claim Pipeline</h1>
          <p className="text-[13px] text-app-muted">
            Every active claim, organised by submission status.
          </p>
        </div>
        <Link href="/app/claims/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> New claim
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[13px]">
        <button className="rounded-md border border-app-border bg-white px-3 py-1.5 font-medium">
          Kanban
        </button>
        <button className="rounded-md px-3 py-1.5 text-app-muted hover:text-app-text">
          Table
        </button>
        <div className="ml-auto flex items-center gap-2">
          <select className="rounded-md border border-app-border bg-white px-2 py-1.5 text-[12px]">
            <option>All service lines</option>
            <option>Water</option>
            <option>Mold</option>
            <option>Roof</option>
          </select>
          <select className="rounded-md border border-app-border bg-white px-2 py-1.5 text-[12px]">
            <option>All carriers</option>
            <option>State Farm</option>
            <option>Allstate</option>
            <option>Citizens</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 overflow-x-auto pb-4 md:grid-cols-3 xl:grid-cols-7 xl:flex-row">
        {COLUMNS.map((col) => {
          const claims = CLAIMS.filter((c) => c.status === col.id);
          return (
            <div
              key={col.id}
              className="min-w-[260px] rounded-xl border border-app-border bg-white"
            >
              <div className="flex items-center justify-between border-b border-app-border px-3 py-2.5">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-app-muted">
                  {col.label}
                </span>
                <span className="text-[11px] font-semibold text-app-muted">
                  {claims.length}
                </span>
              </div>
              <div className="space-y-2 p-2">
                {claims.length === 0 ? (
                  <div className="rounded-md border border-dashed border-app-border p-4 text-center text-[12px] text-app-muted">
                    No claims
                  </div>
                ) : (
                  claims.map((claim) => <KanbanCard key={claim.id} claim={claim} />)
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="mt-8">
        <div className="border-b border-app-border p-5">
          <h2 className="text-[15px] font-semibold">All claims</h2>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Claim</TH>
              <TH>Type</TH>
              <TH>Carrier</TH>
              <TH>Loss date</TH>
              <TH>RCV</TH>
              <TH>Score</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {CLAIMS.map((claim) => (
              <TR key={claim.id}>
                <TD>
                  <Link
                    href={`/app/claims/${claim.id}`}
                    className="font-medium hover:text-brand"
                  >
                    {claim.policyholder}
                  </Link>
                  <div className="text-[11px] text-app-muted">
                    {claim.number}
                  </div>
                </TD>
                <TD>
                  <Badge tone="muted">{claim.type.toUpperCase()}</Badge>
                </TD>
                <TD>{claim.carrier}</TD>
                <TD>{formatDate(claim.loss_date)}</TD>
                <TD className="font-mono tabular-nums">
                  {claim.rcv ? formatCurrency(claim.rcv) : "—"}
                </TD>
                <TD>
                  <ScoreRingCompact value={claim.score} />
                </TD>
                <TD>
                  <Badge tone={statusTone(claim.status)}>
                    {COLUMNS.find((c) => c.id === claim.status)?.label}
                  </Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}

function KanbanCard({ claim }: { claim: Claim }) {
  return (
    <Link
      href={`/app/claims/${claim.id}`}
      className="block rounded-lg border border-app-border bg-white p-3 transition-shadow hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold">
            {claim.policyholder}
          </div>
          <div className="mt-0.5 truncate text-[11px] text-app-muted">
            {claim.address}
          </div>
        </div>
        <ScoreRingCompact value={claim.score} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge tone="muted">{claim.type.toUpperCase()}</Badge>
        {claim.cat && <Badge tone="muted">Cat {claim.cat}</Badge>}
        <Badge tone="neutral">{claim.carrier}</Badge>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-app-muted">
        <span>{claim.tasks.filter((t) => t.status !== "done").length} tasks</span>
        <span>{formatDate(claim.updated_at)}</span>
      </div>
    </Link>
  );
}

function statusTone(status: ClaimStatus) {
  switch (status) {
    case "submission-ready":
      return "success" as const;
    case "needs-review":
      return "warning" as const;
    case "submitted":
      return "info" as const;
    case "supplement":
      return "warning" as const;
    case "closed":
      return "muted" as const;
    default:
      return "neutral" as const;
  }
}
