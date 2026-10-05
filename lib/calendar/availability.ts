import type { CalendarEvent, FreeWindow, ISODate, PersonId } from "@/types";
import { addDays, fromMinutes, toMinutes } from "@/lib/utils/format";

/** The part of the day they'd realistically do something together. */
export const DAY_START = 8 * 60;
export const DAY_END = 23 * 60;

type Span = [number, number];

function mergeSpans(spans: Span[]): Span[] {
  const sorted = [...spans].sort((a, b) => a[0] - b[0]);
  const out: Span[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]);
    else out.push([s[0], s[1]]);
  }
  return out;
}

export function busySpans(events: CalendarEvent[], day: ISODate, owner?: PersonId): Span[] {
  return mergeSpans(
    events
      .filter((e) => e.day === day && (!owner || e.owner === owner))
      .map((e) => [toMinutes(e.start), toMinutes(e.end)] as Span),
  );
}

/** Windows where BOTH are free on a day. Busy = union of both calendars, padded for travel. */
export function sharedFreeWindows(
  events: CalendarEvent[],
  day: ISODate,
  minMinutes = 90,
  bufferMinutes = 30,
): FreeWindow[] {
  const busy = mergeSpans(
    busySpans(events, day).map(([s, e]) => [s, Math.min(DAY_END, e + bufferMinutes)] as Span),
  );
  const windows: FreeWindow[] = [];
  let cursor = DAY_START;
  for (const [s, e] of busy) {
    if (s - cursor >= minMinutes) windows.push(win(day, cursor, s));
    cursor = Math.max(cursor, e);
  }
  if (DAY_END - cursor >= minMinutes) windows.push(win(day, cursor, DAY_END));
  return windows.filter((w) => w.minutes >= minMinutes);
}

function win(day: ISODate, s: number, e: number): FreeWindow {
  // round the start to the next quarter hour — "2:30", not "2:23"
  const start = Math.ceil(s / 15) * 15;
  return { day, start: fromMinutes(start), end: fromMinutes(e), minutes: e - start };
}

export function freeWindowsBetween(
  events: CalendarEvent[],
  from: ISODate,
  days: number,
  minMinutes = 150,
): FreeWindow[] {
  const out: FreeWindow[] = [];
  for (let i = 0; i < days; i++) out.push(...sharedFreeWindows(events, addDays(from, i), minMinutes));
  return out;
}

/** Fraction of the waking day someone is busy (0–1), for the calendar's thin bars. */
export function busyRatio(events: CalendarEvent[], day: ISODate, owner: PersonId) {
  const total = busySpans(events, day, owner).reduce(
    (a, [s, e]) => a + Math.max(0, Math.min(e, DAY_END) - Math.max(s, DAY_START)),
    0,
  );
  return Math.max(0, Math.min(1, total / (DAY_END - DAY_START)));
}
