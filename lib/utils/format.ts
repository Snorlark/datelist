import type { ClockTime, ISODate } from "@/types";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/** Parse "YYYY-MM-DD" as a UTC calendar day so formatting never shifts by timezone. */
export function parseDay(day: ISODate) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISODay(date: Date): ISODate {
  return date.toISOString().slice(0, 10);
}

export function addDays(day: ISODate, n: number): ISODate {
  const d = parseDay(day);
  d.setUTCDate(d.getUTCDate() + n);
  return toISODay(d);
}

export const weekday = (day: ISODate) => DAYS[parseDay(day).getUTCDay()];
export const weekdayShort = (day: ISODate) => weekday(day).slice(0, 3);
export const monthName = (day: ISODate) => MONTHS[parseDay(day).getUTCMonth()];
export const dayOfMonth = (day: ISODate) => parseDay(day).getUTCDate();
export const year = (day: ISODate) => parseDay(day).getUTCFullYear();

/** "October 17" */
export const longDate = (day: ISODate) => `${monthName(day)} ${dayOfMonth(day)}`;
/** "Oct. 17" */
export const shortDate = (day: ISODate) => `${monthName(day).slice(0, 3)}. ${dayOfMonth(day)}`;
/** "08.03.2026" — the scrapbook stamp */
export const stampDate = (day: ISODate) => {
  const d = parseDay(day);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}.${d.getUTCFullYear()}`;
};

export const toMinutes = (t: ClockTime) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const fromMinutes = (mins: number): ClockTime => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** "6:30 PM" */
export function clock(t: ClockTime, withPeriod = true) {
  const [h, m] = t.split(":").map(Number);
  const hh = ((h + 11) % 12) + 1;
  const base = `${hh}:${String(m).padStart(2, "0")}`;
  return withPeriod ? `${base} ${h < 12 ? "AM" : "PM"}` : base;
}

/** "3h 20m" */
export function duration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;
export const priceMarks = (p?: number) => (p ? "₱".repeat(p) : "");

export const daysBetween = (a: ISODate, b: ISODate) =>
  Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86_400_000);

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** True for a real calendar day like "2026-10-05" (a cleared date input gives ""). */
export function isISODay(v: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  return toISODay(parseDay(v)) === v; // rejects 2026-02-30 and friends
}
