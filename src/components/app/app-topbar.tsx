import Link from "next/link";
import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-app-border bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <input
            type="search"
            placeholder="Search claims, line items, files…"
            className="h-9 w-full rounded-lg border border-app-border bg-app-bg pl-9 pr-3 text-[13px] outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/app/claims/new">
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> New claim
          </Button>
        </Link>
        <button className="grid h-9 w-9 place-items-center rounded-lg border border-app-border bg-white text-app-muted hover:bg-app-bg">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-app-border bg-white px-2 py-1">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">
            MD
          </div>
          <div className="hidden text-[12px] leading-tight sm:block">
            <div className="font-medium">Mike Diaz</div>
            <div className="text-app-muted">Premium Restoration</div>
          </div>
        </div>
      </div>
    </header>
  );
}
