import { NextResponse } from "next/server";
import { getClaimById } from "@/lib/store";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const claim = getClaimById(id);
  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }
  return NextResponse.json({ claim });
}
