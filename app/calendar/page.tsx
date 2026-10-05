import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { MonthCalendar, type CalendarCell, type DayDetail } from "@/components/calendar/MonthCalendar";
import { getEvents } from "@/lib/calendar";
import { buildLanes } from "@/lib/calendar/lanes";
import { monthGrid } from "@/lib/calendar/month";
import { getDates, getIdeas, getMemories, getPreferences, today } from "@/lib/repository";
import { suggestForWindow } from "@/lib/recommend";
import { addDays, shortDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Calendar" };
export const dynamic = "force-dynamic";

/** How far ahead the (mock) calendars are synced. */
const SYNCED_DAYS = 14;

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const now = today();
  const { month: asked } = await searchParams;
  const month = /^\d{4}-\d{2}$/.test(asked ?? "") ? asked! : now.slice(0, 7);
  const syncedTo = addDays(now, SYNCED_DAYS - 1);

  const [events, dates, memories, ideas, prefs] = await Promise.all([getEvents(now, syncedTo), getDates(), getMemories(), getIdeas(), getPreferences()]);
  const lanes = buildLanes(events, dates, now, SYNCED_DAYS, 120);
  const laneByDay = new Map(lanes.map((l) => [l.day, l]));

  const cells: CalendarCell[] = monthGrid(month).map(({ day, inMonth }) => {
    const lane = laneByDay.get(day);
    const memory = memories.find((m) => m.date === day);
    return {
      day,
      inMonth,
      plans: dates.filter((d) => d.date === day && d.status !== "cancelled").map((d) => ({ id: d.id, title: d.title, start: d.startTime, done: d.status === "done" })),
      free: lane?.free.map((f) => ({ start: f.start, end: f.end })) ?? [],
      memory: memory ? { title: memory.title, scene: memory.photos[0].scene } : undefined,
    };
  });

  // only days with synced calendars get the Lark / Sophia detail
  const details: Record<string, DayDetail> = {};
  for (const l of lanes) {
    details[l.day] = {
      lark: l.lark,
      sophia: l.sophia,
      planned: l.planned,
      free: l.free.map((w) => {
        const s = suggestForWindow(w, ideas, prefs);
        return { start: w.start, end: w.end, minutes: w.minutes, ideaIds: s?.ideas.map((i) => i.id) ?? [], ideas: s?.ideas.map((i) => i.title) ?? [] };
      }),
    };
  }

  return (
    <div className="pb-20">
      <PageHeader title="Calendar" sub={`Plans, memories, and when you're both free. Calendars are synced through ${shortDate(syncedTo)}.`} who="lark" />
      <MonthCalendar month={month} today={now} cells={cells} details={details} />
    </div>
  );
}
