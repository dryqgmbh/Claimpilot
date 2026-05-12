import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { listClaims } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function GlobalTasksPage() {
  const CLAIMS = listClaims();
  const tasks = CLAIMS.flatMap((c) =>
    c.tasks.map((t) => ({ ...t, claim: c })),
  );
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
      <p className="text-[13px] text-app-muted">
        All tasks across your claim pipeline.
      </p>

      <div className="mt-4 flex items-center gap-2 text-[13px]">
        <select className="rounded-md border border-app-border bg-white px-2 py-1.5 text-[12px]">
          <option>All statuses</option>
          <option>Open</option>
          <option>In progress</option>
          <option>Done</option>
        </select>
        <select className="rounded-md border border-app-border bg-white px-2 py-1.5 text-[12px]">
          <option>All priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="rounded-md border border-app-border bg-white px-2 py-1.5 text-[12px]">
          <option>All assignees</option>
          <option>Tony</option>
          <option>Dave</option>
          <option>Lauren</option>
          <option>Field Tech</option>
        </select>
      </div>

      <Card className="mt-6">
        <Table>
          <THead>
            <TR>
              <TH>Task</TH>
              <TH>Claim</TH>
              <TH>Assignee</TH>
              <TH>Priority</TH>
              <TH>Status</TH>
              <TH>Due</TH>
            </TR>
          </THead>
          <TBody>
            {tasks.map((t) => (
              <TR key={t.id}>
                <TD className="font-medium">{t.title}</TD>
                <TD>
                  <Link
                    href={`/app/claims/${t.claim.id}`}
                    className="text-brand hover:underline"
                  >
                    {t.claim.policyholder}
                  </Link>
                  <div className="text-[11px] text-app-muted">{t.claim.number}</div>
                </TD>
                <TD>{t.assignee}</TD>
                <TD>
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
                </TD>
                <TD>
                  <Badge tone={t.status === "done" ? "success" : t.status === "in_progress" ? "info" : "neutral"}>
                    {t.status.replace("_", " ")}
                  </Badge>
                </TD>
                <TD className="text-app-muted">{t.due_at ? formatDate(t.due_at) : "—"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
