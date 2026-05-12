import { NextResponse } from "next/server";
import { getClaimById, upsertClaim } from "@/lib/store";
import { classifyFile } from "@/lib/ai/client";
import type { FileItem } from "@/types";

/**
 * Upload endpoint.
 *
 * Accepts multipart/form-data. In v1 backend we'd stream to S3/Supabase
 * Storage with signed URLs; here we register file metadata + run a
 * classification pass so downstream tabs and reports render properly.
 */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const claim = getClaimById(id);
  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  const form = await req.formData();
  const files = form.getAll("file");
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const created: FileItem[] = [];

  for (const f of files) {
    if (!(f instanceof File)) continue;

    const classification = await classifyFile({
      filename: f.name,
      mime: f.type,
      size_kb: Math.max(1, Math.round(f.size / 1024)),
    });

    const file: FileItem = {
      id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      category: classification.category,
      size_kb: Math.max(1, Math.round(f.size / 1024)),
      uploaded_at: new Date().toISOString(),
      uploaded_by: "Mike (Owner)",
      parse_status: "parsed",
      tags: classification.tags,
    };

    claim.files.push(file);
    created.push(file);
  }

  upsertClaim(claim);

  return NextResponse.json({ files: created }, { status: 201 });
}
