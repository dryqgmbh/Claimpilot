import { NextResponse } from "next/server";
import { orchestrateAudit } from "@/lib/ai/orchestrator";
import { getClaimById, getJob } from "@/lib/store";

// Trigger an audit run.
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const claim = getClaimById(id);
  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  // Fire-and-forget so the API returns immediately; UI polls /status.
  orchestrateAudit(id).catch((err) => {
    console.error("[audit] error", err);
  });

  return NextResponse.json({ claim_id: id, status: "queued" }, { status: 202 });
}

// Poll job status.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const job = getJob(id);
  if (!job) {
    return NextResponse.json(
      { claim_id: id, status: "idle", step: "No audit run yet", progress_pct: 0 },
      { status: 200 },
    );
  }
  return NextResponse.json(job);
}
