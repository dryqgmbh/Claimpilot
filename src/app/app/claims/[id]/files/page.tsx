import { notFound } from "next/navigation";
import {
  FileText,
  Image,
  Droplets,
  Wind,
  Map,
  ClipboardSignature,
  Mail,
  Film,
  Receipt,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { getClaimById as getClaim } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const ICON = {
  estimate: FileText,
  insurance_estimate: FileText,
  photo: Image,
  moisture_log: Droplets,
  drying_log: Wind,
  sketch: Map,
  authorization: ClipboardSignature,
  correspondence: Mail,
  invoice: Receipt,
  video: Film,
  other: FileText,
} as const;

const LABEL = {
  estimate: "Contractor estimate",
  insurance_estimate: "Insurance estimate",
  photo: "Photo set",
  moisture_log: "Moisture log",
  drying_log: "Drying log",
  sketch: "Sketch / floorplan",
  authorization: "Work authorization",
  correspondence: "Correspondence",
  invoice: "Invoice",
  video: "Video",
  other: "Other",
} as const;

export default async function FilesTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = getClaim(id);
  if (!claim) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold">Files</h2>
          <p className="text-[12px] text-app-muted">
            All uploaded files, auto-classified and parsed.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" /> Upload more
        </Button>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>File</TH>
            <TH>Category</TH>
            <TH>Tags</TH>
            <TH>Size</TH>
            <TH>Uploaded</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {claim.files.map((f) => {
            const Icon = ICON[f.category];
            return (
              <TR key={f.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-app-bg text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-[11px] text-app-muted">
                        Uploaded by {f.uploaded_by}
                      </div>
                    </div>
                  </div>
                </TD>
                <TD>
                  <Badge tone="muted">{LABEL[f.category]}</Badge>
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-1">
                    {(f.tags ?? []).map((t) => (
                      <Badge key={t} tone="neutral">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </TD>
                <TD className="text-app-muted">
                  {f.size_kb > 1024
                    ? `${(f.size_kb / 1024).toFixed(1)} MB`
                    : `${f.size_kb} KB`}
                </TD>
                <TD className="text-app-muted">{formatDate(f.uploaded_at)}</TD>
                <TD>
                  <Badge
                    tone={
                      f.parse_status === "parsed"
                        ? "success"
                        : f.parse_status === "error"
                          ? "risk"
                          : "warning"
                    }
                  >
                    {f.parse_status}
                  </Badge>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
