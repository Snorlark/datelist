"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, CalendarDays, CalendarHeart, Images } from "lucide-react";
import { cn } from "@/lib/utils/format";

export const TABS = [
  { href: "/", label: "Plans", Icon: CalendarHeart },
  { href: "/calendar", label: "Calendar", Icon: CalendarDays },
  { href: "/ideas", label: "Ideas", Icon: Bookmark },
  { href: "/memories", label: "Memories", Icon: Images },
] as const;

export const isActive = (path: string, href: string) => (href === "/" ? path === "/" || path.startsWith("/plans") : path.startsWith(href));

/** Sidebar pages, Notion style: quiet rows, a soft fill on the current one. */
export function NavLinks() {
  const path = usePathname();
  return (
    <ul className="space-y-0.5">
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(path, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[0.875rem] transition-colors",
                active ? "bg-ink/[0.07] font-medium text-ink" : "text-ink/70 hover:bg-ink/[0.05] hover:text-ink",
              )}
            >
              <Icon size={16} strokeWidth={1.8} aria-hidden className={active ? "text-ink" : "text-muted"} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
