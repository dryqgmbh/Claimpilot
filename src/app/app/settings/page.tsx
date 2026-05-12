import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-[13px] text-app-muted">
        Organization, branding, integrations and security.
      </p>

      <div className="mt-6 space-y-6">
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Organization</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Company name" defaultValue="Premium Restoration LLC" />
            <Field label="Primary state" defaultValue="Texas" />
            <Field label="Phone" defaultValue="(713) 555-0188" />
            <Field label="Website" defaultValue="premiumrestoration.com" />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Branding (Pro & Enterprise)</h2>
          <p className="text-[12px] text-app-muted">
            White-label your generated reports with your logo and colors.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-app-border bg-app-bg text-[11px] text-app-muted">
              Logo
            </div>
            <Button variant="outline" size="sm">Upload logo</Button>
            <Field label="Brand color" defaultValue="#0B1220" className="ml-auto w-40" />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Integrations</h2>
          <p className="text-[12px] text-app-muted">
            Connect your existing field & estimating tools. Native integrations
            roll out in v1.1.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { name: "CompanyCam", status: "available-soon" },
              { name: "Encircle", status: "available-soon" },
              { name: "DASH", status: "available-soon" },
              { name: "JobNimbus", status: "available-soon" },
              { name: "Albi", status: "available-soon" },
              { name: "Xactimate ESX", status: "available-soon" },
            ].map((i) => (
              <div
                key={i.name}
                className="flex items-center justify-between rounded-lg border border-app-border bg-app-bg p-3"
              >
                <span className="text-[13px] font-medium">{i.name}</span>
                <Badge tone="muted">Roadmap</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">AI governance</h2>
          <p className="text-[12px] text-app-muted">
            ScopePilot only produces evidence-bound findings. These defaults
            cannot be turned off.
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            {[
              "All findings link to their evidence source.",
              "Findings carry a confidence score (0–100%).",
              "Critical findings pass through a second-pass verifier.",
              "Model never produces pricing or coverage opinions.",
              "Audit trail logs every AI invocation and re-run.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 rounded-md border border-app-border bg-white px-3 py-2"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-semibold">Security</h2>
          <ul className="mt-3 grid gap-2 text-[13px] md:grid-cols-2">
            <li className="rounded-md border border-app-border bg-white px-3 py-2">
              TLS 1.2+ in transit
            </li>
            <li className="rounded-md border border-app-border bg-white px-3 py-2">
              AES-256 at rest
            </li>
            <li className="rounded-md border border-app-border bg-white px-3 py-2">
              Postgres Row-Level Security
            </li>
            <li className="rounded-md border border-app-border bg-white px-3 py-2">
              SOC 2 Type I — target Q4
            </li>
          </ul>
        </Card>
      </div>
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
