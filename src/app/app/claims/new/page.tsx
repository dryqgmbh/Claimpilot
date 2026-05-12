import Link from "next/link";
import {
  Upload,
  FileText,
  Camera,
  Droplets,
  Wind,
  Map,
  Mail,
  ArrowRight,
  ClipboardSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SLOTS = [
  { icon: FileText, title: "Xactimate / Contractor Estimate", desc: "PDF or ESX", required: true },
  { icon: FileText, title: "Insurance Estimate", desc: "Adjuster scope PDF", required: false },
  { icon: Camera, title: "Photos", desc: "JPG, PNG, HEIC (multiple)", required: true },
  { icon: Droplets, title: "Moisture Logs", desc: "CSV / PDF / image", required: true },
  { icon: Wind, title: "Drying Logs", desc: "CSV / PDF", required: true },
  { icon: Map, title: "Sketch / Floorplan", desc: "Matterport link or PDF", required: false },
  { icon: ClipboardSignature, title: "Work Authorization", desc: "Signed PDF", required: false },
  { icon: Mail, title: "Adjuster Correspondence", desc: "Email PDFs", required: false },
];

export default function NewClaimPage() {
  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <Badge tone="info">New claim · Step 1 of 2</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            Start a new claim audit
          </h1>
          <p className="text-[13px] text-app-muted">
            Add claim details and upload your existing claim files.
            ScopePilot does the rest.
          </p>
        </div>
        <Link href="/app/claims" className="text-[13px] text-app-muted">
          Cancel
        </Link>
      </div>

      <form action="/app/claims/C-2026-00148" className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-[15px] font-semibold">Claim details</h2>
          <p className="text-[12px] text-app-muted">
            Required to tune QA rules. You can update these later.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Select label="Claim type" options={["Water Damage", "Mold Remediation", "Fire & Smoke", "Roofing Insurance", "Reconstruction"]} />
            <Select label="Category (water only)" options={["N/A", "Cat 1 — Clean", "Cat 2 — Gray", "Cat 3 — Black"]} defaultValue="Cat 2 — Gray" />
            <Field label="Loss date" type="date" defaultValue="2026-04-28" />
            <Field label="Date reported" type="date" defaultValue="2026-04-29" />
            <Field label="Cause of loss" defaultValue="Supply line failure under kitchen sink" />
            <Field label="Property type" defaultValue="Single Family Residence" />
            <Field label="Property address" defaultValue="4421 Magnolia Ln, Houston, TX 77019" className="md:col-span-2" />
            <Field label="Policyholder name" defaultValue="Robert & Diane Mendez" />
            <Field label="Carrier" defaultValue="State Farm" />
            <Field label="Adjuster name" defaultValue="Karen Whitaker" />
            <Field label="Carrier claim #" defaultValue="SF-89C-441-7723" />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-[15px] font-semibold">Audit preferences</h2>
          <p className="text-[12px] text-app-muted">Tune QA rules to your workflow.</p>
          <div className="mt-5 space-y-4">
            <Toggle label="Run IICRC S500 checks" defaultChecked />
            <Toggle label="Run S520 (mold) checks" />
            <Toggle label="Forecast adjuster questions" defaultChecked />
            <Toggle label="Surface supplement candidates" defaultChecked />
            <Toggle label="Use white-label branding on reports" />
          </div>
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
            Reminder: ScopePilot is a documentation QA tool. Findings are
            based solely on uploaded materials. ScopePilot is not a public
            adjuster.
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <h2 className="text-[15px] font-semibold">Upload claim files</h2>
          <p className="text-[12px] text-app-muted">
            Drag files into the slot. We auto-classify, parse and index every
            file. Most audits complete in 60–180 seconds.
          </p>

          <label
            htmlFor="dropzone"
            className="mt-5 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-app-border bg-app-bg/60 py-12 text-center transition-colors hover:border-brand hover:bg-brand-50/40"
          >
            <Upload className="h-6 w-6 text-brand" />
            <p className="mt-3 text-[14px] font-semibold">
              Drag & drop or click to upload
            </p>
            <p className="mt-1 text-[12px] text-app-muted">
              PDF, JPG, PNG, HEIC, MP4, CSV — up to 200MB per file
            </p>
            <input id="dropzone" type="file" multiple className="sr-only" />
          </label>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SLOTS.map((s) => (
              <div
                key={s.title}
                className="rounded-lg border border-app-border bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand">
                    <s.icon className="h-4 w-4" />
                  </div>
                  {s.required ? (
                    <Badge tone="risk">Required</Badge>
                  ) : (
                    <Badge tone="muted">Optional</Badge>
                  )}
                </div>
                <div className="mt-3 text-[13px] font-semibold">{s.title}</div>
                <div className="text-[11px] text-app-muted">{s.desc}</div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-brand"
                >
                  <Upload className="h-3.5 w-3.5" /> Add file
                </button>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 flex items-center justify-between">
          <span className="text-[12px] text-app-muted">
            By starting the audit you agree that ScopePilot may process your
            uploads. We never share your data.
          </span>
          <Button type="submit" size="lg" className="gap-2">
            Start audit <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  className,
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
        {label}
      </span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </label>
  );
}

function Select({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
        {label}
      </span>
      <select
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-app-border bg-white px-3 py-2.5 text-[13px]">
      <span>{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-brand"
      />
    </label>
  );
}
