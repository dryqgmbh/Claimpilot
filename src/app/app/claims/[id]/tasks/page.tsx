import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getClaimById as getClaim } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { ClaimTask } from "@/types";

const COLS = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
] as const;

export default async function TasksTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold">Tasks</h2>
          <p className="text-[12px] text-app-muted">
            Generated from findings. Assign to the right team member and track
            progress.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map((col) => {
          const list = claim.tasks.filter((t) => t.status === col.id);
          return (
            <Card key={col.id} className="p-0">
              <div className="flex items-center justify-between border-b border-app-border px-4 py-2.5">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-app-muted">
                  {col.label}
                </span>
                <span className="text-[11px] font-semibold text-app-muted">
                  {list.length}
                </span>
              </div>
              <div className="space-y-2 p-3">
                {list.length === 0 ? (
                  <div className="rounded-md border border-dashed border-app-border p-4 text-center text-[12px] text-app-muted">
                    No tasks
                  </div>
                ) : (
                  list.map((t) => <TaskCard key={t.id} task={t} />)
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: ClaimTask }) {
  return (
    <div className="rounded-lg border border-app-border bg-white p-3">
      <div className="flex items-start gap-2">
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
        <div className="flex-1 text-[13px] font-medium">{task.title}</div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-app-muted">
        <span>{task.assignee}</span>
        {task.due_at && <span>Due {formatDate(task.due_at)}</span>}
      </div>
    </div>
  );
}
