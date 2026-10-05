import type { CalendarEvent, ISODate, PlannedDate } from "@/types";
import { busySpans, sharedFreeWindows } from "./availability";
import { addDays, toMinutes } from "@/lib/utils/format";
import type { FreeWindow } from "@/types";

export type Span = [number, number];

export interface DayLanes {
  day: ISODate;
  lark: Span[];
  sophia: Span[];
  free: FreeWindow[];
  planned?: { id: string; title: string; span: Span };
}

/** Planned dates block both calendars — you can't be "free" during your own date. */
export function withPlannedDates(events: CalendarEvent[], dates: PlannedDate[]): CalendarEvent[] {
  const planned = dates
    .filter((d) => d.status === "planned")
    .flatMap((d) =>
      (["lark", "sophia"] as const).map((owner) => ({
        id: `${d.id}-${owner}`,
        owner,
        title: d.title,
        day: d.date,
        start: d.startTime,
        end: d.endTime,
      })),
    );
  return [...events, ...planned];
}

export function buildLanes(
  events: CalendarEvent[],
  dates: PlannedDate[],
  from: ISODate,
  days: number,
  minFree = 120,
): DayLanes[] {
  const all = withPlannedDates(events, dates);
  return Array.from({ length: days }, (_, i) => {
    const day = addDays(from, i);
    const plan = dates.find((d) => d.date === day && d.status === "planned");
    return {
      day,
      lark: busySpans(events, day, "lark"),
      sophia: busySpans(events, day, "sophia"),
      free: sharedFreeWindows(all, day, minFree),
      planned: plan ? { id: plan.id, title: plan.title, span: [toMinutes(plan.startTime), toMinutes(plan.endTime)] } : undefined,
    };
  });
}
