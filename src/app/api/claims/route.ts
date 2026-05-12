import { NextResponse } from "next/server";
import { z } from "zod";
import { listClaims, upsertClaim } from "@/lib/store";
import type { Claim, ClaimType } from "@/types";

const CreateClaimSchema = z.object({
  type: z.enum(["water", "mold", "fire", "roof", "recon"]),
  cat: z.number().int().min(1).max(3).optional(),
  policyholder: z.string().min(2),
  address: z.string().min(4),
  loss_date: z.string(),
  cause_of_loss: z.string().min(2),
  carrier: z.string().min(2),
  adjuster_name: z.string().optional(),
  claim_number_carrier: z.string().optional(),
  rcv: z.number().nonnegative().optional(),
});

export async function GET() {
  return NextResponse.json({ claims: listClaims() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateClaimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const id = `C-${new Date().getFullYear()}-${Math.floor(
    Math.random() * 99999,
  )
    .toString()
    .padStart(5, "0")}`;

  const claim: Claim = {
    id,
    number: id,
    org_id: "org_demo",
    type: parsed.data.type as ClaimType,
    cat: parsed.data.cat as 1 | 2 | 3 | undefined,
    status: "intake",
    policyholder: parsed.data.policyholder,
    address: parsed.data.address,
    loss_date: parsed.data.loss_date,
    cause_of_loss: parsed.data.cause_of_loss,
    carrier: parsed.data.carrier,
    adjuster_name: parsed.data.adjuster_name,
    claim_number_carrier: parsed.data.claim_number_carrier,
    rcv: parsed.data.rcv,
    created_at: now,
    updated_at: now,
    score: 0,
    sub_scores: [],
    files: [],
    line_items: [],
    moisture: [],
    drying: [],
    missing: [],
    questions: [],
    findings: [],
    tasks: [],
    reports: [],
    narrative_draft: "",
  };

  upsertClaim(claim);
  return NextResponse.json({ claim }, { status: 201 });
}
