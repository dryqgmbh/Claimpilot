"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Status =
  | "idle"
  | "queued"
  | "parsing"
  | "matching"
  | "scoring"
  | "verifying"
  | "done"
  | "error";

interface Job {
  claim_id: string;
  status: Status;
  step: string;
  progress_pct: number;
  error?: string;
}

const STEPS: { key: Status; label: string }[] = [
  { key: "queued", label: "Queued" },
  { key: "parsing", label: "Parsing uploaded files" },
  { key: "matching", label: "Matching estimate to evidence" },
  { key: "scoring", label: "Running claim audit (Claude Sonnet)" },
  { key: "verifying", label: "Verifying critical findings (Claude Opus)" },
  { key: "done", label: "Audit complete" },
];

export default function AuditProgressPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    async function start() {
      // Kick off the audit
      await fetch(`/api/claims/${params.id}/audit`, { method: "POST" });

      // Poll status
      const poll = async () => {
        if (cancelled) return;
        const r = await fetch(`/api/claims/${params.id}/audit`);
        const j: Job = await r.json();
        setJob(j);

        if (j.status === "done") {
          setTimeout(() => {
            if (!cancelled) router.push(`/app/claims/${params.id}`);
          }, 900);
          return;
        }
        if (j.status === "error") return;
        setTimeout(poll, 750);
      };

      poll();
    }

    start();

    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  const currentIdx = job
    ? STEPS.findIndex((s) => s.key === job.status)
    : -1;

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <Badge tone="info">Audit in progress</Badge>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          Pre-auditing your claim
        </h1>
        <p className="text-[13px] text-app-muted">
          Most audits complete in 60–180 seconds. You can keep this tab open
          or come back later — the audit runs server-side.
        </p>

        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
                Current step
              </div>
              <div className="mt-1 text-[15px] font-semibold">
                {job?.step ?? "Initializing…"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
                Progress
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums">
                {job?.progress_pct ?? 0}%
              </div>
            </div>
          </div>
          <Progress
            value={job?.progress_pct ?? 0}
            tone={job?.status === "error" ? "risk" : "brand"}
            className="mt-4"
          />

          {job?.status === "error" && (
            <div className="mt-4 rounded-lg border border-risk/20 bg-risk-soft p-3 text-[12px] text-risk">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{job.error ?? "Audit failed. Please retry."}</p>
              </div>
            </div>
          )}
        </Card>

        <Card className="mt-4 p-6">
          <ul className="space-y-3">
            {STEPS.map((s, i) => {
              const done = currentIdx > i || job?.status === "done";
              const active = currentIdx === i && job?.status !== "done";
              return (
                <li key={s.key} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : active ? (
                      <Loader2 className="h-5 w-5 animate-spin text-brand" />
                    ) : (
                      <div className="grid h-5 w-5 place-items-center rounded-full border-2 border-app-border text-[10px] font-semibold text-app-muted">
                        {i + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <div
                      className={
                        done
                          ? "text-[13px] text-app-muted line-through"
                          : active
                            ? "text-[13px] font-semibold"
                            : "text-[13px] text-app-muted"
                      }
                    >
                      {s.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="mt-6 flex items-center justify-between text-[12px] text-app-muted">
          <p>
            Findings are evidence-bound. Critical findings are verified by a
            second-pass model. ScopePilot is not a public adjuster.
          </p>
          <Link href={`/app/claims/${params.id}`}>
            <Button variant="ghost" size="sm">
              Skip to claim
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
