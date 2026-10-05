"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS, isActive } from "@/components/shell/NavLinks";
import { cn } from "@/lib/utils/format";

/** Phones and tablets: tabs at the thumb; only the current one shows its name. Desktop uses the sidebar. */
export function TabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 flex lg:hidden justify-center px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <ul className="flex gap-1 rounded-full border border-line bg-card/85 p-1.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.18)] backdrop-blur-xl">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3.5 py-2.5 text-label font-medium transition-colors duration-300",
                  active ? "bg-ink text-page" : "text-muted hover:text-ink",
                )}
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden />
                {active && <span>{label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
