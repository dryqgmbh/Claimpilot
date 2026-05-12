import { cn } from "@/lib/utils";
import { scoreBand, type ScoreBand } from "@/lib/scoring";

const bandColors: Record<ScoreBand, { ring: string; text: string; bg: string }> = {
  "submission-ready": {
    ring: "stroke-success",
    text: "text-success",
    bg: "bg-success-soft",
  },
  "strong": {
    ring: "stroke-success",
    text: "text-success",
    bg: "bg-success-soft",
  },
  "needs-review": {
    ring: "stroke-warning",
    text: "text-warning",
    bg: "bg-warning-soft",
  },
  "high-risk": {
    ring: "stroke-risk",
    text: "text-risk",
    bg: "bg-risk-soft",
  },
  "not-ready": {
    ring: "stroke-risk",
    text: "text-risk",
    bg: "bg-risk-soft",
  },
};

const bandLabel: Record<ScoreBand, string> = {
  "submission-ready": "Submission Ready",
  "strong": "Strong — Minor Fixes",
  "needs-review": "Needs Review",
  "high-risk": "High Risk",
  "not-ready": "Not Submission Ready",
};

export function ScoreRing({
  value,
  size = 160,
  thickness = 12,
}: {
  value: number;
  size?: number;
  thickness?: number;
}) {
  const band = scoreBand(value);
  const colors = bandColors[band];
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative grid place-items-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-none stroke-slate-100"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={cn("fill-none transition-all", colors.ring)}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className={cn("text-4xl font-bold leading-none", colors.text)}>
              {Math.round(value)}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-app-muted">
              Claim Score
            </div>
          </div>
        </div>
      </div>
      <span
        className={cn(
          "rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
          colors.bg,
          colors.text,
        )}
      >
        {bandLabel[band]}
      </span>
    </div>
  );
}

export function ScoreRingCompact({ value }: { value: number }) {
  const band = scoreBand(value);
  const colors = bandColors[band];
  return (
    <div
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold",
        colors.text,
        band === "needs-review"
          ? "border-warning"
          : band === "high-risk" || band === "not-ready"
            ? "border-risk"
            : "border-success",
      )}
    >
      {Math.round(value)}
    </div>
  );
}
