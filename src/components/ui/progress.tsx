import { cn } from "@/lib/utils";

export function Progress({
  value,
  tone = "brand",
  className,
}: {
  value: number;
  tone?: "brand" | "success" | "warning" | "risk";
  className?: string;
}) {
  const colorMap = {
    brand: "bg-brand",
    success: "bg-success",
    warning: "bg-warning",
    risk: "bg-risk",
  };
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-2 rounded-full transition-all", colorMap[tone])}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
