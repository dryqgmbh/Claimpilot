import Link from "next/link";
import { Compass, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen bg-app-bg lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              ScopePilot<span className="text-brand">.ai</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Run a Free Claim Audit
          </h1>
          <p className="mt-1 text-[13px] text-app-muted">
            No card required. One free audit on any restoration claim.
          </p>

          <form action="/app/onboarding" className="mt-6 space-y-4">
            <Field label="Full name" placeholder="Mike Diaz" required />
            <Field
              label="Work email"
              type="email"
              placeholder="mike@premiumrestoration.com"
              required
            />
            <Field
              label="Company"
              placeholder="Premium Restoration LLC"
              required
            />
            <Field
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <Button type="submit" className="w-full" size="lg">
              Create account
            </Button>
          </form>

          <p className="mt-5 text-[11px] leading-relaxed text-app-muted">
            By signing up you agree to our Terms and Privacy Policy. ScopePilot
            is a documentation QA tool and is not a public adjuster.
          </p>

          <div className="mt-6 border-t border-app-border pt-4 text-center text-[13px] text-app-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
      <aside className="hidden bg-navy text-white lg:block">
        <div className="flex h-full flex-col justify-center px-12 py-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            From messy claim file to submission-ready in 90 seconds.
          </h2>
          <ul className="mt-8 space-y-4 text-[14px] text-slate-200">
            {[
              "Upload your existing claim files — no new field workflow",
              "Get a 0–100 Claim Quality Score with 10 weighted signals",
              "See exactly which photos, logs and notes are missing",
              "Get a forecast of your adjuster’s likely questions",
              "Export a polished PDF report for your team",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-xl border border-slate-700 bg-slate-850 p-5 text-[13px] text-slate-300">
            “We caught 7 missing photos and 1 incomplete drying log on the
            very first audit. The carrier didn’t even need to ask.”
            <div className="mt-3 text-[12px] text-slate-400">
              — Restoration Owner, Design Partner Program
            </div>
          </div>
        </div>
      </aside>
    </main>
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
