"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Scene } from "@/types";
import { PhotoPlate } from "@/components/illustrations/PhotoPlate";
import { DayLanes } from "./DayLanes";
import { shiftMonth } from "@/lib/calendar/month";
import { clock, cn, dayOfMonth, longDate, monthName, weekday, year } from "@/lib/utils/format";

export interface CalendarCell {
  day: string;
  inMonth: boolean;
  plans: { id: string; title: string; start: string; done: boolean }[];
  free: { start: string; end: string }[];
  memory?: { title: string; scene: Scene };
}

export interface DayDetail {
  lark: [number, number][];
  sophia: [number, number][];
  planned?: { id: string; title: string; span: [number, number] };
  free: { start: string; end: string; minutes: number; ideaIds: string[]; ideas: string[] }[];
}

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const short = (t: string) => clock(t).replace(":00", "").replace(" ", "").toLowerCase(); // "2:30pm"

/** Notion-style month grid. Click a day to see both calendars side by side. */
export function MonthCalendar({ month, today, cells, details }: { month: string; today: string; cells: CalendarCell[]; details: Record<string, DayDetail> }) {
  // start on the next day you're both free, so the panel is useful right away
  const firstFree = cells.find((c) => c.day >= today && c.free.length > 0)?.day;
  const [selected, setSelected] = useState(firstFree ?? (cells.some((c) => c.day === today) ? today : cells.find((c) => c.inMonth)!.day));
  const cell = cells.find((c) => c.day === selected);
  const detail = details[selected];
  const first = `${month}-01`;

  return (
    <div className="content mt-8 grid gap-8 lg:mt-10 xl:grid-cols-[1fr_19rem]">
      <div className="min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-heading">
            {monthName(first)} <span className="text-muted">{year(first)}</span>
          </h2>
          <div className="flex items-center gap-1">
            <Link href={`/calendar?month=${shiftMonth(month, -1)}`} aria-label="Previous month" className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-ink/[0.05] hover:text-ink">
              <ChevronLeft size={18} aria-hidden />
            </Link>
            <Link href="/calendar" className="rounded-md px-2 py-1 text-label font-medium text-muted hover:bg-ink/[0.05] hover:text-ink">
              Today
            </Link>
            <Link href={`/calendar?month=${shiftMonth(month, 1)}`} aria-label="Next month" className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-ink/[0.05] hover:text-ink">
              <ChevronRight size={18} aria-hidden />
            </Link>
          </div>
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-muted" aria-label="Legend">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-lime" /> Plan
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-matcha" /> Both free
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-print ring-1 ring-line" /> Memory
          </li>
        </ul>

        <div role="grid" aria-label={`${monthName(first)} ${year(first)}`} className="mt-4 overflow-hidden rounded-card border border-line bg-card">
          <div role="row" className="grid grid-cols-7 border-b border-line">
            {WEEK.map((d) => (
              <div key={d} role="columnheader" className="px-2 py-2 text-[0.75rem] text-muted">
                <span className="sm:hidden">{d[0]}</span>
                <span className="hidden sm:inline">{d}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((c, i) => {
              const isToday = c.day === today;
              const on = c.day === selected;
              return (
                <button
                  key={c.day}
                  type="button"
                  role="gridcell"
                  aria-selected={on}
                  aria-label={`${weekday(c.day)}, ${longDate(c.day)}${c.plans.length ? `, ${c.plans.length} plan` : ""}${c.free.length ? ", both free" : ""}${c.memory ? ", memory" : ""}`}
                  onClick={() => setSelected(c.day)}
                  className={cn(
                    "relative flex min-h-[4.25rem] flex-col items-stretch gap-1 border-line p-1.5 text-left align-top transition-colors sm:min-h-[7rem] sm:p-2",
                    i % 7 !== 6 && "border-r",
                    i < cells.length - 7 && "border-b",
                    !c.inMonth && "bg-sage/50 text-faint",
                    on ? "bg-sage" : "hover:bg-sage/60",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className={cn("grid h-6 min-w-6 place-items-center rounded-full px-1 text-[0.8125rem]", isToday && "bg-coral font-medium text-page", on && !isToday && "ring-1 ring-ink")}>{dayOfMonth(c.day)}</span>
                    {c.memory && (
                      <span aria-hidden className="w-6 rotate-6 bg-print p-[2px] pb-1 shadow-[0_2px_6px_-2px_rgb(0_0_0/0.3)] sm:w-8">
                        <PhotoPlate scene={c.memory.scene} alt="" className="aspect-square" sizes="2rem" />
                      </span>
                    )}
                  </span>
                  {/* phones: dots; larger screens: little chips */}
                  <span className="flex gap-1 sm:hidden" aria-hidden>
                    {c.plans.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/20" />}
                    {c.free.length > 0 && <span className="h-1.5 w-3 rounded-full bg-matcha" />}
                  </span>
                  <span className="hidden flex-col gap-1 sm:flex" aria-hidden>
                    {c.plans.map((p) => (
                      <span key={p.id} className={cn("truncate rounded px-1.5 py-0.5 text-[0.6875rem] font-medium", p.done ? "bg-sage text-muted" : "bg-lime text-onlime")}>
                        {p.title}
                      </span>
                    ))}
                    {c.free.slice(0, 1).map((f) => (
                      <span key={f.start} className="truncate rounded bg-matcha/70 px-1.5 py-0.5 text-[0.6875rem] text-ink">
                        {short(f.start)}–{short(f.end)}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* the selected day */}
      <aside aria-live="polite" className="xl:pt-[4.5rem]">
        <div className="rounded-card bg-card p-5 ring-1 ring-line xl:sticky xl:top-8">
          <p className="text-label text-muted">{weekday(selected)}</p>
          <p className="font-serif text-[1.75rem] leading-tight">{longDate(selected)}</p>

          {cell?.plans.map((p) => (
            <Link key={p.id} href={`/plans/${p.id}`} className="mt-4 flex items-center justify-between rounded-lg bg-lime px-3 py-2 text-[0.875rem] font-medium text-onlime hover:brightness-95">
              {p.title}
              <span className="text-[0.75rem] font-normal">{clock(p.start)}</span>
            </Link>
          ))}
          {cell?.memory && (
            <Link href="/memories" className="mt-4 flex items-center gap-3 rounded-lg bg-sage px-3 py-2 text-[0.875rem] hover:bg-ink/[0.05]">
              <span className="w-8 -rotate-3 bg-print p-[2px] pb-1">
                <PhotoPlate scene={cell.memory.scene} alt="" className="aspect-square" sizes="2rem" />
              </span>
              {cell.memory.title}
            </Link>
          )}

          {detail ? (
            <DayLanes detail={detail} day={selected} />
          ) : (
            !cell?.plans.length &&
            !cell?.memory && (
              <p className="mt-4 text-label text-muted">{selected < today ? "Nothing saved for this day." : "Calendars aren't synced this far ahead yet."}</p>
            )
          )}
        </div>
      </aside>
    </div>
  );
}
