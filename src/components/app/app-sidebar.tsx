"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  FileText,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/claims", label: "Claims", icon: FolderKanban },
  { href: "/app/tasks", label: "Tasks", icon: ListChecks },
  { href: "/app/reports", label: "Reports", icon: FileText },
  { href: "/app/team", label: "Team", icon: Users },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-slate-850 bg-navy text-slate-200 md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-850 px-5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
          <Compass className="h-4 w-4" />
        </div>
        <span className="text-[14px] font-semibold tracking-tight text-white">
          ScopePilot<span className="text-brand">.ai</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/app/claims"
              ? pathname.startsWith("/app/claims")
              : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-slate-850 text-white"
                  : "text-slate-300 hover:bg-slate-850/60 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-850 p-3">
        <Link
          href="/app/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-slate-400 hover:bg-slate-850/60 hover:text-white"
        >
          <HelpCircle className="h-4 w-4" />
          Help & docs
        </Link>
        <div className="mt-3 rounded-lg border border-slate-850 bg-slate-850/60 p-3 text-[11px] leading-relaxed text-slate-400">
          ScopePilot is a documentation QA tool. We are not a public adjuster
          and do not guarantee any insurance outcome.
        </div>
      </div>
    </aside>
  );
}
