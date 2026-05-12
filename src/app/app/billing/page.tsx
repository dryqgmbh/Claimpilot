import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function BillingPage() {
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold tracking-tight">Billing & subscription</h1>
      <p className="text-[13px] text-app-muted">
        Manage your plan, audits and add-ons.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <Badge tone="info">Growth plan · Monthly</Badge>
              <h2 className="mt-3 text-[18px] font-semibold">$799 / month</h2>
              <p className="mt-1 text-[12px] text-app-muted">
                Renews on June 12, 2026. 5 users included.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Switch to annual (save $1,598)</Button>
              <Button size="sm">Upgrade to Pro</Button>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-app-muted">Audit usage this period</span>
              <span className="font-semibold">14 of 40</span>
            </div>
            <Progress value={(14 / 40) * 100} className="mt-2" />
            <p className="mt-2 text-[11px] text-app-muted">
              Soft limit — we never block you mid-claim. Overage at $79 / audit.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-[14px] font-semibold">Payment method</h3>
          <p className="mt-1 text-[12px] text-app-muted">Visa ending in 4242</p>
          <Button variant="outline" size="sm" className="mt-3">
            Update payment
          </Button>
          <h3 className="mt-5 text-[14px] font-semibold">Billing email</h3>
          <p className="mt-1 text-[12px] text-app-muted">
            billing@premiumrestoration.com
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="text-[15px] font-semibold">Add-ons</h2>
        <p className="text-[12px] text-app-muted">Buy one-off services per claim.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Extra audit", price: "$79", desc: "Beyond plan quota" },
            { name: "Human QA review", price: "$249–$499", desc: "Reviewer SLA 24–48h" },
            { name: "Rush processing", price: "+$99", desc: "< 2h turnaround" },
            { name: "Custom template", price: "from $1,500", desc: "Built with your team" },
          ].map((a) => (
            <div key={a.name} className="rounded-lg border border-app-border bg-app-bg p-4">
              <div className="text-[13px] font-semibold">{a.name}</div>
              <div className="mt-1 text-[12px] text-app-muted">{a.desc}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[14px] font-semibold">{a.price}</span>
                <Button size="sm" variant="outline">
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="text-[15px] font-semibold">Invoices</h2>
        <ul className="mt-3 divide-y divide-app-border">
          {[
            { date: "May 12, 2026", amount: "$799.00", status: "Paid" },
            { date: "Apr 12, 2026", amount: "$799.00", status: "Paid" },
            { date: "Mar 12, 2026", amount: "$799.00", status: "Paid" },
          ].map((i) => (
            <li key={i.date} className="flex items-center justify-between py-3">
              <span className="text-[13px] font-medium">{i.date}</span>
              <span className="text-[12px] text-app-muted">{i.amount}</span>
              <span className="inline-flex items-center gap-1 text-[12px] text-success">
                <Check className="h-3.5 w-3.5" /> {i.status}
              </span>
              <Button variant="ghost" size="sm">Download</Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
