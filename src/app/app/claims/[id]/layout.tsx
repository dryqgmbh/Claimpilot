import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/score-ring";
import { Tabs } from "@/components/ui/tabs";
import { getClaimById } from "@/lib/store";
import { ReanalyzeButton } from "@/components/claim/reanalyze-button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClaimDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaimById(id);
  if (!claim) notFound();

  const tabBase = `/app/claims/${claim.id}`;
  const tabs = [
    { label: "Overview", href: tabBase },
    { label: "Files", href: `${tabBase}/files`, count: claim.files.length },
    { label: "Estimate Items", href: `${tabBase}/estimate`, count: claim.line_items.length },
    {
      label: "Evidence Match",
      href: `${tabBase}/evidence`,
      count: claim.line_items.filter((l) => l.risk !== "low").length,
    },
    {
      label: "Missing Docs",
      href: `${tabBase}/missing`,
      count: claim.missing.filter((m) => m.status === "open").length,
    },
    {
      label: "Adjuster Questions",
      href: `${tabBase}/questions`,
      count: claim.questions.length,
    },
    { label: "Logs", href: `${tabBase}/logs` },
    { label: "Narrative", href: `${tabBase}/narrative` },
    {
      label: "Tasks",
      href: `${tabBase}/tasks`,
      count: claim.tasks.filter((t) => t.status !== "done").length,
    },
    { label: "Reports", href: `${tabBase}/reports`, count: claim.reports.length },
  ];

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 text-[12px] text-app-muted">
        <Link href="/app/claims" className="inline-flex items-center hover:text-app-text">
          <ChevronLeft className="h-3.5 w-3.5" /> Claims
        </Link>
        <span>/</span>
        <span className="font-mono">{claim.number}</span>
      </div>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {claim.policyholder}
            </h1>
            <Badge tone="muted">{claim.type.toUpperCase()}</Badge>
            {claim.cat && <Badge tone="muted">Cat {claim.cat}</Badge>}
            <Badge tone="neutral">{claim.carrier}</Badge>
            <Badge
              tone={
                claim.status === "submission-ready"
                  ? "success"
                  : claim.status === "needs-review"
                    ? "warning"
                    : claim.status === "submitted"
                      ? "info"
                      : "neutral"
              }
            >
              {claim.status.replace("-", " ")}
            </Badge>
          </div>
          <p className="mt-1 text-[13px] text-app-muted">
            {claim.address} · Loss {formatDate(claim.loss_date)} ·{" "}
            {claim.cause_of_loss}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-app-muted">
            <Meta label="Carrier claim #" value={claim.claim_number_carrier ?? "—"} />
            <Meta label="Adjuster" value={claim.adjuster_name ?? "—"} />
            <Meta
              label="RCV"
              value={claim.rcv ? formatCurrency(claim.rcv) : "—"}
            />
            <Meta
              label="ACV"
              value={claim.acv ? formatCurrency(claim.acv) : "—"}
            />
            <Meta label="Created" value={formatDate(claim.created_at)} />
            <Meta label="Updated" value={formatDate(claim.updated_at)} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ReanalyzeButton claimId={claim.id} />
            <Link href={`/app/claims/${claim.id}/reports`}>
              <Button size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" /> Generate report
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 grid place-items-center rounded-xl border border-app-border bg-white p-6">
          <ScoreRing value={claim.score} />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-app-border bg-white">
        <Tabs items={tabs} />
        <div className="border-t border-app-border p-5">{children}</div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium uppercase tracking-wide text-app-muted">{label}: </span>
      <span className="text-app-text">{value}</span>
    </div>
  );
}
