import { cn } from "@/lib/utils";
import type { SubScore } from "@/lib/scoring";
import { Progress } from "./ui/progress";

function toneFor(value: number) {
  if (value >= 80) return "success" as const;
  if (value >= 60) return "warning" as const;
  return "risk" as const;
}

export function SubScoreCard({ sub }: { sub: SubScore }) {
  const tone = toneFor(sub.value);
  return (
    <div className="rounded-lg border border-app-border bg-app-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
            {sub.label}
          </div>
          <div
            className={cn(
              "mt-1 text-2xl font-bold tabular-nums",
              tone === "success" && "text-success",
              tone === "warning" && "text-warning",
              tone === "risk" && "text-risk",
            )}
          >
            {Math.round(sub.value)}
          </div>
        </div>
        <div className="text-right text-[11px] text-app-muted">
          weight
          <div className="text-app-text font-semibold">
            {(sub.weight * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      <Progress value={sub.value} tone={tone} className="mt-3" />
      <p className="mt-2 line-clamp-2 text-[12px] text-app-muted">
        {sub.description}
      </p>
    </div>
  );
}
