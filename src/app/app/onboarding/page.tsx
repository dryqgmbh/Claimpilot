import Link from "next/link";
import { ArrowRight, Building2, Users, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OnboardingPage() {
  return (
    <div className="container-page py-10">
      <Badge tone="info">Onboarding · Step 1 of 3</Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        Welcome to ScopePilot.
      </h1>
      <p className="mt-2 text-app-muted">
        Let’s set up your organization. You can change anything later in Settings.
      </p>

      <Card className="mt-8 p-6">
        <form action="/app/claims/new" className="space-y-8">
          <Section
            icon={<Building2 className="h-4 w-4" />}
            title="Company"
            desc="We use this to brand reports and onboarding emails."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company name" defaultValue="Premium Restoration LLC" />
              <Field label="Primary state" defaultValue="Texas" />
            </div>
          </Section>

          <Section
            icon={<ListChecks className="h-4 w-4" />}
            title="Service lines"
            desc="Choose what you handle. We tune QA rules per service line."
          >
            <div className="flex flex-wrap gap-2">
              {[
                "Water Damage",
                "Mold Remediation",
                "Fire & Smoke",
                "Roofing Insurance",
                "Reconstruction",
              ].map((s, i) => (
                <label
                  key={s}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-app-border bg-white px-3 py-1.5 text-[13px] hover:border-brand"
                >
                  <input
                    type="checkbox"
                    defaultChecked={i < 3}
                    className="h-4 w-4 accent-brand"
                  />
                  {s}
                </label>
              ))}
            </div>
          </Section>

          <Section
            icon={<Users className="h-4 w-4" />}
            title="Invite your team"
            desc="Optional. You can do this later."
          >
            <div className="grid gap-3">
              <Field label="Estimator email" type="email" placeholder="dave@company.com" />
              <Field label="Mitigation manager email" type="email" placeholder="tony@company.com" />
              <Field label="Admin email" type="email" placeholder="lauren@company.com" />
            </div>
          </Section>

          <div className="flex items-center justify-between border-t border-app-border pt-6">
            <Link href="/app/dashboard" className="text-[13px] text-app-muted">
              Skip and go to dashboard
            </Link>
            <Button type="submit" className="gap-2">
              Audit your first claim <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Section({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand">
          {icon}
        </div>
        <h2 className="text-[15px] font-semibold">{title}</h2>
      </div>
      <p className="ml-9 text-[13px] text-app-muted">{desc}</p>
      <div className="ml-9 mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
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
