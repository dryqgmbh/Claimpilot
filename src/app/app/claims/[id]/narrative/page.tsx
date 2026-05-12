import { notFound } from "next/navigation";
import { Save, RotateCw, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getClaim } from "@/lib/mock-data";

export default async function NarrativeTab({
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
          <h2 className="text-[15px] font-semibold">Claim narrative</h2>
          <p className="text-[12px] text-app-muted">
            A factual, evidence-bound narrative draft. Edit freely — ScopePilot
            never asserts facts that aren’t in your uploads.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <RotateCw className="h-3.5 w-3.5" /> Regenerate
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button size="sm" className="gap-1.5">
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <textarea
          defaultValue={claim.narrative_draft}
          className="block min-h-[360px] w-full resize-y rounded-xl border-0 bg-white p-6 font-mono text-[13.5px] leading-relaxed text-app-text outline-none focus:ring-2 focus:ring-brand/20"
        />
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Badge tone="info">Guardrails</Badge>
          <p className="text-[12px] text-app-muted">
            Narrative drafts never contain pricing claims, coverage opinions or
            antagonistic language. Loss summary → mitigation → drying → findings
            → scope justification.
          </p>
        </div>
      </Card>
    </div>
  );
}
