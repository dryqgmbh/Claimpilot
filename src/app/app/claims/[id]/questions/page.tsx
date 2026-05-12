import { notFound } from "next/navigation";
import { MessageCircleQuestion, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { getClaim } from "@/lib/mock-data";

export default async function QuestionsTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold">Adjuster question forecast</h2>
        <p className="text-[12px] text-app-muted">
          Questions the carrier is most likely to ask, based on your claim type
          and the documentation we located. Each comes with a suggested
          pre-answer drawn from your evidence.
        </p>
      </div>

      <ul className="space-y-3">
        {claim.questions.map((q, i) => (
          <li key={q.id}>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-brand-50 text-brand">
                    <MessageCircleQuestion className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="muted">Q{i + 1}</Badge>
                      <RiskBadge level={q.severity} />
                    </div>
                    <h3 className="mt-1 text-[14px] font-semibold">
                      “{q.question}”
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-app-border bg-app-bg p-3 text-[13px]">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-app-muted">
                    Why we forecast this
                  </div>
                  <p className="mt-1 text-app-text">{q.rationale}</p>
                </div>
                <div className="rounded-lg border border-brand-100 bg-brand-50/40 p-3 text-[13px]">
                  <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                    <Lightbulb className="h-3.5 w-3.5" /> Suggested pre-answer
                  </div>
                  <p className="mt-1 text-app-text">{q.pre_answer_hint}</p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
