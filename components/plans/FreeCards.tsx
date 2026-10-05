import Link from "next/link";
import type { Suggestion } from "@/types";
import { softPill } from "@/components/ui/Pill";
import { clock, cn, dayOfMonth, monthName, weekday } from "@/lib/utils/format";

/** Open windows in both calendars, each with an idea that fits and a way to plan it. */
export function FreeCards({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {suggestions.slice(0, 3).map((s) => {
        const q = new URLSearchParams({ day: s.window.day, start: s.window.start, idea: s.ideas.map((i) => i.id).join(",") });
        return (
          <li key={`${s.window.day}-${s.window.start}`} className="flex flex-col rounded-card bg-card p-5 ring-1 ring-line transition-shadow hover:shadow-[0_14px_30px_-20px_rgb(0_0_0/0.35)]">
            <p className="text-label text-muted">{weekday(s.window.day)}</p>
            <p className="font-serif text-[2rem] leading-none">
              {monthName(s.window.day).slice(0, 3)} {dayOfMonth(s.window.day)}
            </p>
            <p className="mt-2 text-label text-muted">
              {clock(s.window.start)} – {clock(s.window.end)}
            </p>
            <p className="mt-4 flex-1 text-[0.875rem]">
              <span className="text-muted">Maybe </span>
              {s.ideas.map((i) => i.title).join(" + ")}
            </p>
            <Link href={`/plans/new?${q}`} className={cn(softPill, "mt-4 self-start")}>
              Plan it
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
