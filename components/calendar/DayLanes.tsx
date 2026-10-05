import Link from "next/link";
import type { DayDetail } from "./MonthCalendar";
import { softPill } from "@/components/ui/Pill";
import { clock, cn, duration, toMinutes } from "@/lib/utils/format";

// the part of the day worth drawing: 8 am to midnight
const FROM = 8 * 60;
const TO = 24 * 60;
const pct = (m: number) => `${((Math.min(Math.max(m, FROM), TO) - FROM) / (TO - FROM)) * 100}%`;
const width = (a: number, b: number) => `calc(${pct(b)} - ${pct(a)})`;

function Lane({ name, dot, busy, free, planned }: { name: string; dot: string; busy: [number, number][]; free: [number, number][]; planned?: [number, number] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-14 shrink-0 items-center gap-1.5 text-[0.75rem] text-muted">
        <span className={cn("h-2 w-2 rounded-full", dot)} /> {name}
      </span>
      <div className="relative h-5 flex-1 overflow-hidden rounded bg-sage">
        {free.map(([a, b]) => (
          <span key={`f${a}`} className="absolute inset-y-0 bg-matcha" style={{ left: pct(a), width: width(a, b) }} />
        ))}
        {busy.map(([a, b]) => (
          <span key={`b${a}`} className="absolute inset-y-0 bg-[repeating-linear-gradient(135deg,var(--color-faint)_0_2px,transparent_2px_6px)]" style={{ left: pct(a), width: width(a, b) }} />
        ))}
        {planned && <span className="absolute inset-y-0 bg-lime" style={{ left: pct(planned[0]), width: width(planned[0], planned[1]) }} />}
      </div>
    </div>
  );
}

/** One day as two lanes — Lark and Sophia — with the time you're both free highlighted. */
export function DayLanes({ detail, day }: { detail: DayDetail; day: string }) {
  const free = detail.free.map((f) => [toMinutes(f.start), toMinutes(f.end)] as [number, number]);
  return (
    <div className="mt-5">
      <div className="space-y-2" role="img" aria-label={`Lark busy ${detail.lark.length} times, Sophia busy ${detail.sophia.length} times, both free ${detail.free.length} times`}>
        <Lane name="Lark" dot="bg-lark" busy={detail.lark} free={free} planned={detail.planned?.span} />
        <Lane name="Sophia" dot="bg-sophia" busy={detail.sophia} free={free} planned={detail.planned?.span} />
        <div className="ml-16 flex justify-between text-[0.625rem] text-muted" aria-hidden>
          <span>8am</span>
          <span>12</span>
          <span>4pm</span>
          <span>8pm</span>
          <span>12</span>
        </div>
      </div>

      {detail.free.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {detail.free.map((f) => {
            const q = new URLSearchParams({ day, start: f.start, idea: f.ideaIds.join(",") });
            return (
              <li key={f.start} className="rounded-lg border border-line p-3">
                <p className="text-[0.875rem] font-medium">
                  Both free {clock(f.start)} – {clock(f.end)}
                </p>
                <p className="text-[0.75rem] text-muted">
                  {duration(f.minutes)}
                  {f.ideas.length > 0 && <> · maybe {f.ideas.join(" + ")}</>}
                </p>
                <Link href={`/plans/new?${q}`} className={cn(softPill, "mt-2.5 px-3 py-1.5")}>
                  Plan it
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-5 text-label text-muted">{detail.planned ? "Your plan fills the free time." : "No time you're both free this day."}</p>
      )}
    </div>
  );
}
