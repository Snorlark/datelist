import Link from "next/link";
import { Plus } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { SidebarPets } from "./SidebarPets";
import { ThemePicker } from "./ThemePicker";
import { pill } from "@/components/ui/Pill";
import { getFreeTogether } from "@/lib/freeTogether";
import { clock, cn, shortDate, weekdayShort } from "@/lib/utils/format";

/** Desktop only: the Notion-style left rail with pages, free times and the pets. */
export async function Sidebar() {
  const { suggestions } = await getFreeTogether();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line bg-sage/70 px-3 pb-5 pt-5 lg:flex">
      <Link href="/" className="px-2 font-serif text-[1.625rem] font-semibold italic leading-none tracking-[-0.01em]">
        datelist
      </Link>
      <p className="mt-1 px-2 text-[0.75rem] text-muted">Lark &amp; Sophia</p>

      <nav aria-label="Main" className="mt-6">
        <NavLinks />
      </nav>

      <Link href="/plans/new" className={cn(pill, "mx-2 mt-5 py-2.5")}>
        <Plus size={15} strokeWidth={2.2} aria-hidden /> Plan a date
      </Link>

      {suggestions.length > 0 && (
        <section aria-labelledby="side-free" className="mt-8">
          <h2 id="side-free" className="px-2 text-[0.75rem] font-medium text-muted">
            Both free
          </h2>
          <ul className="mt-1.5 space-y-0.5">
            {suggestions.slice(0, 3).map((s) => {
              const q = new URLSearchParams({ day: s.window.day, start: s.window.start, idea: s.ideas.map((i) => i.id).join(",") });
              return (
                <li key={`${s.window.day}-${s.window.start}`}>
                  <Link href={`/plans/new?${q}`} className="block rounded-md px-2 py-1.5 text-[0.8125rem] hover:bg-ink/[0.05]">
                    <span className="text-ink">
                      {weekdayShort(s.window.day)}, {shortDate(s.window.day)}
                    </span>
                    <span className="block text-[0.75rem] text-muted">from {clock(s.window.start)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-auto">
        <ThemePicker up />
        <div className="mt-3 px-2">
          <SidebarPets />
        </div>
      </div>
    </aside>
  );
}
