import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "risk"
  | "muted"
  | "navy";

const tones: Record<Tone, string> = {
  neutral: "bg-app-bg text-app-text border-app-border",
  info: "bg-brand-50 text-brand-700 border-brand-100",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/30",
  risk: "bg-risk-soft text-risk border-risk/20",
  muted: "bg-slate-100 text-slate-600 border-slate-200",
  navy: "bg-navy text-white border-navy",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
