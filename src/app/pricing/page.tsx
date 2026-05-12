import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

interface Plan {
  name: string;
  monthly: number;
  yearly: number | null;
  audits: number | string;
  users: number | string;
  description: string;
  highlights: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    monthly: 299,
    yearly: 2990,
    audits: 10,
    users: 1,
    description: "For solo owners auditing their own files.",
    highlights: [
      "Basic QA",
      "Claim Quality Score",
      "Missing Documentation Checklist",
      "PDF Export",
      "Stripe billing",
    ],
  },
  {
    name: "Growth",
    monthly: 799,
    yearly: 7990,
    audits: 40,
    users: 5,
    description: "Most contractors start here.",
    highlights: [
      "Estimate-to-Evidence Matching",
      "Adjuster Question Forecast",
      "Report Builder",
      "Task Board",
      "5 users",
    ],
    featured: true,
  },
  {
    name: "Pro",
    monthly: 1499,
    yearly: 14990,
    audits: 100,
    users: 15,
    description: "Multi-location restoration teams.",
    highlights: [
      "Advanced Risk Score",
      "Moisture / Drying Log Review",
      "Equipment Justification",
      "Supplement Readiness",
      "White-label Reports",
      "Multi-location dashboard",
    ],
  },
  {
    name: "Enterprise",
    monthly: 3500,
    yearly: null,
    audits: "custom",
    users: "custom",
    description: "Custom workflows and SLA.",
    highlights: [
      "Custom QA Rules",
      "API & integrations",
      "SLA",
      "Dedicated onboarding",
      "Custom report templates",
    ],
  },
];

const ADD_ONS = [
  { name: "Additional Claim Audit", price: "$79 / audit" },
  { name: "Human QA Review", price: "$249–$499 / claim" },
  { name: "Rush Processing (<2h)", price: "+$99 / claim" },
  { name: "Onboarding Setup", price: "$999–$2,500" },
  { name: "Custom Report Templates", price: "from $1,500" },
];

export default function PricingPage() {
  return (
    <>
      <MarketingHeader />
      <main className="bg-app-bg pb-24">
        <section className="bg-white py-16">
          <div className="container-page text-center">
            <Badge tone="info">Pricing</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Built to pay for itself on a single saved line item.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-app-muted">
              No setup fees. Annual plans save ~17%. Soft audit limits, not hard
              caps — we’ll never block you mid-claim.
            </p>
          </div>
        </section>

        <section className="container-page mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.featured
                  ? "relative border-brand p-6 ring-2 ring-brand/10"
                  : "p-6"
              }
            >
              {plan.featured && (
                <Badge tone="info" className="absolute -top-2 right-4">
                  Most popular
                </Badge>
              )}
              <h3 className="text-[16px] font-semibold">{plan.name}</h3>
              <p className="mt-1 text-[13px] text-app-muted">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-[34px] font-bold tabular-nums">
                  ${plan.monthly.toLocaleString()}
                </span>
                <span className="text-[13px] text-app-muted">/month</span>
              </div>
              <div className="mt-1 text-[12px] text-app-muted">
                {plan.yearly
                  ? `or $${plan.yearly.toLocaleString()} / year`
                  : "Custom annual contract"}
              </div>

              <ul className="mt-5 space-y-2 text-[13px]">
                <li className="flex items-center justify-between border-b border-app-border pb-2">
                  <span className="text-app-muted">Audits / month</span>
                  <span className="font-semibold">{plan.audits}</span>
                </li>
                <li className="flex items-center justify-between border-b border-app-border pb-2">
                  <span className="text-app-muted">Users</span>
                  <span className="font-semibold">{plan.users}</span>
                </li>
              </ul>

              <ul className="mt-4 space-y-2 text-[13px]">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="mt-6 block">
                <Button
                  variant={plan.featured ? "primary" : "outline"}
                  className="w-full"
                >
                  {plan.name === "Enterprise" ? "Contact sales" : "Start free audit"}
                </Button>
              </Link>
            </Card>
          ))}
        </section>

        <section className="container-page mt-16">
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold">Add-ons</h2>
            <p className="mt-1 text-[13px] text-app-muted">
              Pay-as-you-go upgrades that work on any plan.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {ADD_ONS.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between rounded-lg border border-app-border bg-app-bg px-4 py-3 text-[13px]"
                >
                  <span>{a.name}</span>
                  <span className="font-semibold">{a.price}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="container-page mt-12">
          <Card className="flex flex-col items-start justify-between gap-4 bg-navy p-8 text-white md:flex-row md:items-center">
            <div>
              <h3 className="text-[18px] font-semibold">Not sure which plan?</h3>
              <p className="mt-1 text-[13px] text-slate-300">
                Run a free audit first — most teams pick Growth after seeing
                their first score.
              </p>
            </div>
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Run a Free Claim Audit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
