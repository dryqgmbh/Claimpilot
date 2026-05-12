import { notFound } from "next/navigation";
import { Camera, FileText, ListChecks, Droplets, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Button } from "@/components/ui/button";
import { getClaim } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const CAT_ICON = {
  photo: Camera,
  log: Droplets,
  doc: FileText,
  narrative: ListChecks,
} as const;

export default async function MissingTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  const open = claim.missing.filter((m) => m.status === "open");
  const done = claim.missing.filter((m) => m.status === "satisfied");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold">Missing documentation</h2>
        <p className="text-[12px] text-app-muted">
          Dynamic checklist based on claim type, IICRC standards and what we found
          in your uploads.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Tile label="Open" value={open.length} tone="warning" />
        <Tile
          label="Critical open"
          value={open.filter((m) => m.severity === "critical").length}
          tone="risk"
        />
        <Tile label="Satisfied" value={done.length} tone="success" />
      </div>

      <Card>
        <div className="border-b border-app-border p-5">
          <h3 className="text-[14px] font-semibold">Open items ({open.length})</h3>
        </div>
        <ul className="divide-y divide-app-border">
          {open.map((m) => {
            const Icon = CAT_ICON[m.category];
            return (
              <li key={m.id} className="flex items-start gap-4 px-5 py-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-brand"
                  aria-label={m.label}
                />
                <div className="grid h-8 w-8 place-items-center rounded-md bg-app-bg text-brand">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-medium">{m.label}</span>
                    <RiskBadge level={m.severity} />
                  </div>
                  <div className="mt-1 text-[12px] text-app-muted">
                    {m.assignee ? `Assigned to ${m.assignee}` : "Unassigned"}
                    {m.due_at ? ` · Due ${formatDate(m.due_at)}` : ""}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>

      {done.length > 0 && (
        <Card>
          <div className="border-b border-app-border p-5">
            <h3 className="text-[14px] font-semibold">Satisfied items ({done.length})</h3>
          </div>
          <ul className="divide-y divide-app-border">
            {done.map((m) => {
              const Icon = CAT_ICON[m.category];
              return (
                <li key={m.id} className="flex items-center gap-4 px-5 py-3 opacity-60">
                  <Icon className="h-4 w-4 text-success" />
                  <span className="line-through">{m.label}</span>
                  <Badge tone="success" className="ml-auto">
                    Satisfied
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Tile({
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
