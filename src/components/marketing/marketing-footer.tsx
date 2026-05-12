import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-app-border bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="text-[15px] font-semibold tracking-tight">
            ScopePilot<span className="text-brand">.ai</span>
          </div>
          <p className="mt-3 max-w-xs text-[13px] text-app-muted">
            Documentation QA for US restoration teams. Pre-audit your claim
            before the carrier does.
          </p>
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-app-muted">
            Product
          </div>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li><Link href="/#how" className="hover:text-brand">How it works</Link></li>
            <li><Link href="/#score" className="hover:text-brand">Claim Quality Score</Link></li>
            <li><Link href="/#demo" className="hover:text-brand">Demo Claims</Link></li>
            <li><Link href="/pricing" className="hover:text-brand">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-app-muted">
            Company
          </div>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li><Link href="/#trust" className="hover:text-brand">Trust & Security</Link></li>
            <li><Link href="/#faq" className="hover:text-brand">FAQ</Link></li>
            <li><a href="mailto:hello@scopepilot.ai" className="hover:text-brand">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wide text-app-muted">
            Legal
          </div>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li><Link href="/legal/terms" className="hover:text-brand">Terms</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-brand">Privacy</Link></li>
            <li><Link href="/legal/dpa" className="hover:text-brand">Data Processing</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-app-border bg-app-bg/50 py-6">
        <div className="container-page grid gap-3 text-[11px] text-app-muted md:flex md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} ScopePilot Inc. All rights reserved.
          </p>
          <p className="max-w-3xl text-[11px] leading-relaxed">
            ScopePilot is a documentation quality and claim file readiness
            tool. ScopePilot is not a public adjuster, not a law firm, and
            does not negotiate, settle, or represent any party in an insurance
            claim. ScopePilot does not guarantee any insurance approval,
            coverage decision, or payment outcome. Findings are based solely
            on uploaded documentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
