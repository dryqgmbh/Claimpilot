import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-app-bg px-6">
      <Card className="w-full max-w-md p-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-white">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            ScopePilot<span className="text-brand">.ai</span>
          </span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-1 text-[13px] text-app-muted">
          Welcome back. Continue to your claims pipeline.
        </p>

        <form action="/app/dashboard" className="mt-6 space-y-4">
          <Field
            label="Work email"
            type="email"
            placeholder="you@company.com"
            required
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
          <Button type="submit" className="w-full" size="lg">
            Sign in
          </Button>
        </form>

        <div className="mt-6 border-t border-app-border pt-4 text-center text-[13px] text-app-muted">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand">
            Run a Free Claim Audit
          </Link>
        </div>
      </Card>
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
