import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-app-border bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-white">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            ScopePilot<span className="text-brand">.ai</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-[13px] text-app-muted md:flex">
          <Link href="/#how" className="hover:text-app-text">How it works</Link>
          <Link href="/#score" className="hover:text-app-text">Claim Score</Link>
          <Link href="/#demo" className="hover:text-app-text">Demo Claims</Link>
          <Link href="/pricing" className="hover:text-app-text">Pricing</Link>
          <Link href="/#faq" className="hover:text-app-text">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Run a Free Claim Audit</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
