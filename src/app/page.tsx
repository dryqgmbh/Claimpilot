import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Camera,
  ListChecks,
  ClipboardCheck,
  ShieldCheck,
  Gauge,
  Workflow,
  ScanSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { ScoreRing } from "@/components/score-ring";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-app-border bg-gradient-to-b from-white to-app-bg">
          <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Badge tone="info" className="mb-4">
                Built for US restoration teams
              </Badge>
              <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-app-text md:text-[56px]">
                Pre-audit your restoration claim{" "}
                <span className="text-brand">before the carrier does.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-app-muted">
                ScopePilot checks your estimates, photos, moisture logs and
                documentation for missing evidence, weak line items and likely
                adjuster questions — before submission.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Run a Free Claim Audit <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg">See a demo claim</Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-app-muted">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  No card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Works alongside Xactimate, CompanyCam, Encircle
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Not a public adjuster
                </span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <HeroPreviewCard />
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="border-b border-app-border bg-white py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight">
                Your team did the work. Your file doesn’t prove it.
              </h2>
              <p className="mt-3 text-[16px] text-app-muted">
                Missing photos, incomplete drying logs and weak line items
                quietly cost restoration companies 10–25% of claim revenue —
                and every adjuster ping delays cashflow by 7–21 days.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              <ProblemCard
                title="Underpayment"
                body="Weakly evidenced line items get adjusted out of every claim."
              />
              <ProblemCard
                title="Supplement leakage"
                body="Field-documented items never make it into the estimate."
              />
              <ProblemCard
                title="Adjuster pings"
                body="Predictable questions delay every submission you send."
              />
              <ProblemCard
                title="Slow cashflow"
                body="Incomplete files stall in carrier review for weeks."
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="border-b border-app-border bg-app-bg py-20">
          <div className="container-page">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 max-w-2xl text-app-muted">
              Three steps from messy claim file to submission-ready
              documentation. No new field workflow.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <StepCard
                step="01"
                icon={<FileText className="h-5 w-5" />}
                title="Upload your claim file"
                body="Drag in your Xactimate estimate, photos, moisture and drying logs, sketch, authorization and adjuster correspondence."
              />
              <StepCard
                step="02"
                icon={<ScanSearch className="h-5 w-5" />}
                title="ScopePilot scans every line item"
                body="Each line item is matched against your evidence. Missing photos, logs and inconsistencies are flagged with confidence levels."
              />
              <StepCard
                step="03"
                icon={<ClipboardCheck className="h-5 w-5" />}
                title="Get a Claim Quality Score"
                body="A 0–100 score, a missing-docs checklist, an adjuster-question forecast and an exportable PDF report."
              />
            </div>
          </div>
        </section>

        {/* SCORE DEMO */}
        <section id="score" className="border-b border-app-border bg-white py-20">
          <div className="container-page grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge tone="info">Claim Quality Score</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                One score. Ten signals. Zero guesswork.
              </h2>
              <p className="mt-3 text-app-muted">
                The Claim Quality Score aggregates ten weighted signals —
                photo completeness, moisture documentation, drying log
                quality, estimate-to-evidence match, equipment justification,
                room consistency, timeline, supplement readiness, adjuster
                risk, and overall documentation strength.
              </p>
              <ul className="mt-6 space-y-3 text-[14px]">
                <ScoreBandRow band="90–100" label="Submission Ready" tone="success" />
                <ScoreBandRow band="75–89" label="Strong — minor fixes" tone="success" />
                <ScoreBandRow band="60–74" label="Needs Review" tone="warning" />
                <ScoreBandRow band="40–59" label="High Risk" tone="risk" />
                <ScoreBandRow band="0–39" label="Not Submission Ready" tone="risk" />
              </ul>
            </div>
            <Card className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
                    Before fix
                  </div>
                  <ScoreRing value={67} />
                </div>
                <ArrowRight className="h-6 w-6 text-app-muted" />
                <div>
                  <div className="text-[12px] font-medium uppercase tracking-wide text-app-muted">
                    After 4 uploads
                  </div>
                  <ScoreRing value={89} />
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-app-border bg-app-bg p-4 text-[13px] text-app-muted">
                Uploading the missing Day 3 drying log, source-of-loss photo,
                containment photo and reconciled antimicrobial quantity moved
                this claim from <strong className="text-warning">Needs Review</strong> to{" "}
                <strong className="text-success">Strong — minor fixes</strong>.
              </div>
            </Card>
          </div>
        </section>

        {/* EVIDENCE MATCH TABLE */}
        <section className="border-b border-app-border bg-app-bg py-20">
          <div className="container-page">
            <Badge tone="info">Estimate-to-Evidence Match</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Every line item, matched against your evidence.
            </h2>
            <p className="mt-3 max-w-2xl text-app-muted">
              Each estimate line item is paired with photos, logs and notes.
              We flag weakness, not pricing. You stay in control of scope.
            </p>
            <Card className="mt-8 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="border-b border-app-border bg-app-bg text-left text-[11px] uppercase tracking-wide text-app-muted">
                    <tr>
                      <th className="px-5 py-3">Line item</th>
                      <th className="px-5 py-3">Room</th>
                      <th className="px-5 py-3">Evidence</th>
                      <th className="px-5 py-3">Risk</th>
                      <th className="px-5 py-3">Recommended action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border">
                    <tr>
                      <td className="px-5 py-3 font-medium">
                        Remove drywall — flood cut 2 ft
                      </td>
                      <td className="px-5 py-3">Living Room</td>
                      <td className="px-5 py-3 text-app-muted">3 photos, sketch annotated</td>
                      <td className="px-5 py-3"><RiskBadge level="low" /></td>
                      <td className="px-5 py-3 text-app-muted">No action needed</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-medium">
                        Air mover (per day) × 4 × 4 days
                      </td>
                      <td className="px-5 py-3">Master Bath</td>
                      <td className="px-5 py-3 text-app-muted">
                        Drying log Day 1–2, placement photo
                      </td>
                      <td className="px-5 py-3"><RiskBadge level="medium" /></td>
                      <td className="px-5 py-3 text-app-muted">
                        Upload Day 3+4 logs and justify 4 AMs in 48 sqft
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-medium">Antimicrobial treatment</td>
                      <td className="px-5 py-3">Kitchen + Dining + LR + Hall</td>
                      <td className="px-5 py-3 text-app-muted">1 spray-bottle photo</td>
                      <td className="px-5 py-3"><RiskBadge level="high" /></td>
                      <td className="px-5 py-3 text-app-muted">
                        Reconcile 950 SF vs sketch 720 SF; add per-room photos + SDS
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-medium">Containment / poly barrier</td>
                      <td className="px-5 py-3">Hallway → LR1</td>
                      <td className="px-5 py-3 text-app-muted">No supporting photos</td>
                      <td className="px-5 py-3"><RiskBadge level="high" /></td>
                      <td className="px-5 py-3 text-app-muted">
                        Upload containment in-place and removal photos
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* MODULES STRIP */}
        <section className="border-b border-app-border bg-white py-20">
          <div className="container-page">
            <h2 className="text-3xl font-bold tracking-tight">
              A focused QA layer — not another job platform.
            </h2>
            <p className="mt-3 max-w-2xl text-app-muted">
              ScopePilot doesn’t replace Xactimate, CompanyCam, Encircle, DASH
              or JobNimbus. It pre-audits the file you’re about to submit.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <ModuleCard
                icon={<Camera />}
                title="Photo & log review"
                body="Photo completeness checks per claim type, moisture & drying log gap detection."
              />
              <ModuleCard
                icon={<ListChecks />}
                title="Missing docs checklist"
                body="Dynamic, claim-type-aware checklist with assignees and due dates."
              />
              <ModuleCard
                icon={<Workflow />}
                title="Adjuster forecast"
                body="Predicted carrier questions with suggested pre-answers backed by your evidence."
              />
              <ModuleCard
                icon={<Gauge />}
                title="Claim Quality Score"
                body="Ten weighted sub-scores aggregated into a single 0–100 score with bands."
              />
              <ModuleCard
                icon={<FileText />}
                title="Reports"
                body="QA, Missing Docs, Adjuster Risk, Supplement Readiness — exportable, white-label on Pro."
              />
              <ModuleCard
                icon={<ShieldCheck />}
                title="Source-bound AI"
                body="Every finding is tied to evidence with confidence levels. Optional human QA review."
              />
            </div>
          </div>
        </section>

        {/* DEMO CLAIMS */}
        <section id="demo" className="border-b border-app-border bg-app-bg py-20">
          <div className="container-page">
            <h2 className="text-3xl font-bold tracking-tight">
              See how it works on a real claim.
            </h2>
            <p className="mt-3 max-w-2xl text-app-muted">
              Three demo files we built from the most common restoration
              scenarios. Open one and click through the full claim QA flow.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <DemoCard
                title="Water Cat 2 — Houston, TX"
                desc="Supply-line failure under kitchen sink. 47 line items, 28 photos, 1 missing drying log."
                score={67}
                tag="water"
                href="/app/claims/C-2026-00148"
              />
              <DemoCard
                title="Mold remediation — Tampa, FL"
                desc="Long-term moisture intrusion. Pre-sample done, post-clearance pending — high risk."
                score={58}
                tag="mold"
                href="/app/claims/C-2026-00161"
              />
              <DemoCard
                title="Roof supplement — Atlanta, GA"
                desc="1.5 in hail (NOAA confirmed). Adjuster scope under-billed underlayment & drip edge."
                score={84}
                tag="roof"
                href="/app/claims/C-2026-00177"
              />
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section id="trust" className="border-b border-app-border bg-white py-20">
          <div className="container-page grid gap-10 lg:grid-cols-2">
            <div>
              <Badge tone="info">Trust & positioning</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                We are not a public adjuster.
              </h2>
              <p className="mt-3 text-app-muted">
                ScopePilot is a documentation quality tool. We do not
                negotiate claims, do not represent contractors or policyholders,
                and do not guarantee insurance outcomes. We make your file
                stronger by surfacing what’s missing — your team submits the
                claim.
              </p>
              <ul className="mt-6 space-y-3 text-[14px]">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-brand" />
                  <span>Findings are evidence-bound; every finding has a confidence level and links to its source.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-brand" />
                  <span>AI never recommends prices, coverage outcomes or legal positions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-brand" />
                  <span>Optional human QA review available on Pro and Enterprise plans.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-brand" />
                  <span>Customer data is tenant-isolated and encrypted at rest and in transit.</span>
                </li>
              </ul>
            </div>
            <Card className="p-6">
              <h3 className="text-[15px] font-semibold">Reports built for real submissions</h3>
              <p className="mt-2 text-[13px] text-app-muted">
                Six purpose-built report types. Each is fact-based and
                non-antagonistic in tone.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Claim QA Report",
                  "Missing Documentation Report",
                  "Adjuster Risk Report",
                  "Supplement Readiness Report",
                  "Internal Estimator Notes",
                  "Customer/Adjuster-Friendly Summary",
                ].map((r) => (
                  <li
                    key={r}
                    className="flex items-center gap-2 rounded-lg border border-app-border bg-app-bg px-3 py-2 text-[13px]"
                  >
                    <FileText className="h-4 w-4 text-brand" />
                    {r}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-900">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Reports are internal QA tools by default. You decide what
                    to share with your adjuster. Customer/Adjuster summaries
                    are neutral and non-antagonistic.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-b border-app-border bg-app-bg py-20">
          <div className="container-page">
            <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <FaqItem
                q="Are you a public adjuster?"
                a="No. ScopePilot is a documentation QA tool. We do not negotiate claims, represent any party, or guarantee outcomes."
              />
              <FaqItem
                q="Will this replace my estimator?"
                a="No. ScopePilot makes your estimator stronger by surfacing weak line items and missing evidence before submission."
              />
              <FaqItem
                q="Do you integrate with CompanyCam, Encircle or DASH?"
                a="Native integrations are on the roadmap. Today you can upload exports directly. Integrations launch alongside our v1.1 release."
              />
              <FaqItem
                q="How accurate is the AI?"
                a="Every finding is evidence-bound with a confidence level. Critical findings go through a second-pass verifier. Pro plans include optional human QA review."
              />
              <FaqItem
                q="Will my carrier accept your reports?"
                a="Reports are internal QA tools by default. You choose what to share. The Customer/Adjuster summary is neutral and submission-friendly."
              />
              <FaqItem
                q="What happens to my data?"
                a="Your data stays yours. Tenant-isolated, encrypted, with a clear data processing agreement. Delete-on-request supported."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy py-20 text-white">
          <div className="container-page text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Stop submitting incomplete claims.
            </h2>
            <p className="mt-3 text-[15px] text-slate-300">
              Run your first audit free. No card. No commitment. 90 seconds
              from upload to score.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link href="/signup">
                <Button size="lg">Run a Free Claim Audit</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-slate-700 bg-transparent text-white hover:bg-slate-850">
                  See pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}

function HeroPreviewCard() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-app-border bg-app-bg/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-risk" />
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="ml-3 font-mono text-[12px] text-app-muted">
            claim/C-2026-00148
          </span>
        </div>
        <Badge tone="warning">Needs Review</Badge>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-6">
          <ScoreRing value={67} size={120} thickness={10} />
          <div className="flex-1 space-y-2 text-[13px]">
            <Row label="Photo completeness" value="64" tone="warning" />
            <Row label="Moisture documentation" value="82" tone="success" />
            <Row label="Drying log quality" value="55" tone="risk" />
            <Row label="Estimate-to-evidence" value="71" tone="warning" />
            <Row label="Equipment justification" value="60" tone="warning" />
          </div>
        </div>
        <div className="mt-6 space-y-2 border-t border-app-border pt-4 text-[13px]">
          <Finding
            severity="critical"
            text="Day 3 drying log missing"
          />
          <Finding
            severity="high"
            text="Antimicrobial 950 SF vs sketch 720 SF"
          />
          <Finding
            severity="medium"
            text="4 air movers in 48 sqft master bath — justification needed"
          />
        </div>
      </div>
    </Card>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "risk";
}) {
  const color = {
    success: "text-success",
    warning: "text-warning",
    risk: "text-risk",
  }[tone];
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-app-muted">{label}</span>
      <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

function Finding({
  severity,
  text,
}: {
  severity: "critical" | "high" | "medium";
  text: string;
}) {
  const map = {
    critical: { tone: "risk" as const, label: "Critical" },
    high: { tone: "risk" as const, label: "High" },
    medium: { tone: "warning" as const, label: "Medium" },
  };
  return (
    <div className="flex items-start gap-3">
      <Badge tone={map[severity].tone}>{map[severity].label}</Badge>
      <span className="text-app-text">{text}</span>
    </div>
  );
}

function ProblemCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-5">
      <div className="text-[12px] font-medium uppercase tracking-wide text-risk">
        Hidden cost
      </div>
      <h3 className="mt-2 text-[15px] font-semibold">{title}</h3>
      <p className="mt-2 text-[13px] text-app-muted">{body}</p>
    </Card>
  );
}

function StepCard({
  step,
  icon,
  title,
  body,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="relative p-6">
      <div className="absolute right-5 top-5 font-mono text-[11px] text-app-muted">
        {step}
      </div>
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand">
        {icon}
      </div>
      <h3 className="mt-4 text-[15px] font-semibold">{title}</h3>
      <p className="mt-2 text-[13px] text-app-muted">{body}</p>
    </Card>
  );
}

function ScoreBandRow({
  band,
  label,
  tone,
}: {
  band: string;
  label: string;
  tone: "success" | "warning" | "risk";
}) {
  const color = {
    success: "bg-success",
    warning: "bg-warning",
    risk: "bg-risk",
  }[tone];
  return (
    <li className="flex items-center justify-between rounded-lg border border-app-border bg-white px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <span className="font-mono text-[12px] text-app-muted">{band}</span>
      </div>
      <span className="font-medium">{label}</span>
    </li>
  );
}

function ModuleCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-app-bg text-brand">
        {icon}
      </div>
      <h3 className="mt-4 text-[15px] font-semibold">{title}</h3>
      <p className="mt-2 text-[13px] text-app-muted">{body}</p>
    </Card>
  );
}

function DemoCard({
  title,
  desc,
  score,
  tag,
  href,
}: {
  title: string;
  desc: string;
  score: number;
  tag: string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="p-5 transition-shadow group-hover:shadow-pop">
        <div className="flex items-start justify-between">
          <Badge tone="muted">{tag.toUpperCase()}</Badge>
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums">{score}</div>
            <div className="text-[10px] uppercase tracking-wider text-app-muted">
              Claim Score
            </div>
          </div>
        </div>
        <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
        <p className="mt-2 text-[13px] text-app-muted">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-brand">
          Open demo claim <ArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <Card className="p-5">
      <h3 className="text-[14px] font-semibold">{q}</h3>
      <p className="mt-2 text-[13px] text-app-muted">{a}</p>
    </Card>
  );
}
