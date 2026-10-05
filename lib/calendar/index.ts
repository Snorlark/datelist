import "server-only";
import type { CalendarConnection, CalendarEvent, ISODate } from "@/types";
import { calendarEvents } from "@/lib/data/mock";

/**
 * Calendar provider boundary. Today it returns mock events; later this is where
 * Google / Apple calendar sync lives (OAuth tokens stay server-side).
 * Components never call providers directly — they get typed CalendarEvent[].
 */
export async function getEvents(from: ISODate, to: ISODate): Promise<CalendarEvent[]> {
  return calendarEvents
    .filter((e) => e.day >= from && e.day <= to)
    .map((e) => (e.private ? { ...e, title: "Busy" } : e));
}

export async function getConnections(): Promise<CalendarConnection[]> {
  return [
    { owner: "lark", provider: "mock", connected: true, lastSyncedAt: "2026-10-05T08:00:00+08:00" },
    { owner: "sophia", provider: "mock", connected: true, lastSyncedAt: "2026-10-05T08:00:00+08:00" },
  ];
}
