"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface TabItem {
  label: string;
  href: string;
  count?: number;
}

export function Tabs({ items }: { items: TabItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1 overflow-x-auto px-2">
      {items.map((item) => {
        // Exact match preferred; otherwise the longest matching prefix beats Overview
        const active =
          pathname === item.href ||
          (item.href !== items[0].href &&
            pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative whitespace-nowrap px-3 py-3 text-[13px] font-medium",
              active
                ? "text-app-text"
                : "text-app-muted hover:text-app-text",
            )}
          >
            <span className="inline-flex items-center gap-2">
              {item.label}
              {typeof item.count === "number" && item.count > 0 && (
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {item.count}
                </span>
              )}
            </span>
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 bg-brand" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
