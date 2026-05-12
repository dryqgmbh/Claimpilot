import { NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { getClaimById } from "@/lib/store";
import { ClaimQAReportPDF } from "@/lib/reports/claim-qa-report";
import { MissingDocsReportPDF } from "@/lib/reports/missing-docs-report";
import { AdjusterRiskReportPDF } from "@/lib/reports/adjuster-risk-report";

export const dynamic = "force-dynamic";
// React-PDF needs Node runtime, not Edge.
export const runtime = "nodejs";

const KIND_MAP = {
  claim_qa: { Component: ClaimQAReportPDF, filename: "Claim-QA-Report" },
  missing_docs: { Component: MissingDocsReportPDF, filename: "Missing-Docs" },
  adjuster_risk: { Component: AdjusterRiskReportPDF, filename: "Adjuster-Risk" },
} as const;

type Kind = keyof typeof KIND_MAP;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string; kind: string }> },
) {
  const { id, kind } = await ctx.params;
  const claim = getClaimById(id);
  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  if (!(kind in KIND_MAP)) {
    return NextResponse.json(
      { error: `Unknown report kind: ${kind}` },
      { status: 400 },
    );
  }

  const { Component, filename } = KIND_MAP[kind as Kind];
  const element = React.createElement(
    Component as React.ComponentType<{ claim: typeof claim }>,
    { claim },
  ) as unknown as React.ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(element);

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}-${claim.number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
