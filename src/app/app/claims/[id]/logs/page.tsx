import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { getClaimById as getClaim } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default async function LogsTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  if (claim.moisture.length === 0 && claim.drying.length === 0) {
    return (
      <div className="grid place-items-center rounded-lg border border-dashed border-app-border bg-app-bg p-12 text-center">
        <div className="text-[14px] font-medium">No drying or moisture logs uploaded.</div>
        <p className="mt-1 text-[12px] text-app-muted">
          For mitigation claims, upload daily moisture readings and a drying log
          to run psychrometric checks.
        </p>
      </div>
    );
  }

  const gaps = claim.drying.filter((d) => d.status !== "ok");

  return (
    <div className="space-y-8">
      {gaps.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <h3 className="text-[14px] font-semibold text-amber-900">
                {gaps.length} drying log {gaps.length === 1 ? "anomaly" : "anomalies"} detected
              </h3>
              <p className="mt-1 text-[12px] text-amber-900/80">
                {gaps
                  .map((g) =>
                    g.status === "missing"
                      ? `Day ${g.day} (${formatDate(g.date)}) — no log entry`
                      : `Day ${g.day} (${formatDate(g.date)}) — anomaly: ${g.notes ?? "review readings"}`,
                  )
                  .join(" · ")}
              </p>
            </div>
          </div>
        </Card>
      )}

      {claim.drying.length > 0 && (
        <Card>
          <div className="border-b border-app-border p-5">
            <h3 className="text-[14px] font-semibold">Drying log</h3>
            <p className="text-[12px] text-app-muted">
              Daily equipment, temperature, RH and GPP. Trend should decrease
              across days.
            </p>
          </div>
          <Table>
            <THead>
              <TR>
                <TH>Day</TH>
                <TH>Date</TH>
                <TH>Equipment</TH>
                <TH>Temp °F</TH>
                <TH>RH %</TH>
                <TH>GPP</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {claim.drying.map((d) => (
                <TR key={d.id}>
                  <TD className="font-mono tabular-nums">{d.day}</TD>
                  <TD>{formatDate(d.date)}</TD>
                  <TD>
                    {d.equipment.length === 0 ? (
                      <span className="text-app-muted">—</span>
                    ) : (
                      d.equipment.join(", ")
                    )}
                  </TD>
                  <TD className="tabular-nums">{d.temp_f || "—"}</TD>
                  <TD className="tabular-nums">{d.rh_pct || "—"}</TD>
                  <TD className="tabular-nums">{d.gpp || "—"}</TD>
                  <TD>
                    <Badge
                      tone={
                        d.status === "ok"
                          ? "success"
                          : d.status === "anomaly"
                            ? "warning"
                            : "risk"
                      }
                    >
                      {d.status}
                    </Badge>
                    {d.notes && (
                      <div className="mt-1 text-[11px] text-app-muted">
                        {d.notes}
                      </div>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      {claim.moisture.length > 0 && (
        <Card>
          <div className="border-b border-app-border p-5">
            <h3 className="text-[14px] font-semibold">Moisture readings</h3>
            <p className="text-[12px] text-app-muted">
              Per-material readings across days. Should converge toward dry standard.
            </p>
          </div>
          <Table>
            <THead>
              <TR>
                <TH>Day</TH>
                <TH>Date</TH>
                <TH>Room</TH>
                <TH>Material</TH>
                <TH>Reading %</TH>
                <TH>Equipment</TH>
              </TR>
            </THead>
            <TBody>
              {claim.moisture.map((m) => (
                <TR key={m.id}>
                  <TD className="font-mono tabular-nums">{m.day}</TD>
                  <TD>{formatDate(m.date)}</TD>
                  <TD>{m.room}</TD>
                  <TD>{m.material}</TD>
                  <TD className="tabular-nums">
                    <span
                      className={
                        m.reading_pct > 20
                          ? "font-semibold text-risk"
                          : m.reading_pct > 16
                            ? "font-semibold text-warning"
                            : "font-semibold text-success"
                      }
                    >
                      {m.reading_pct}%
                    </span>
                  </TD>
                  <TD>{m.equipment ?? "—"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
