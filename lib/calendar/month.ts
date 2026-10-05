/**
 * Month grid maths for the calendar page. Weeks start on Monday; the grid
 * covers whole weeks, so it includes the tail of the previous month and the
 * head of the next. Dependency-free (UTC dates) so it runs under `node --test`.
 */
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** "2026-10" → every day shown in that month's grid. */
export function monthGrid(month: string): { day: string; inMonth: boolean }[] {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const last = new Date(Date.UTC(y, m, 0));
  const lead = (first.getUTCDay() + 6) % 7; // Monday = 0
  const trail = 6 - ((last.getUTCDay() + 6) % 7);
  const start = new Date(first);
  start.setUTCDate(1 - lead);
  const total = lead + last.getUTCDate() + trail;
  return Array.from({ length: total }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return { day: iso(d), inMonth: d.getUTCMonth() === m - 1 };
  });
}

/** "2026-12", +1 → "2027-01" */
export function shiftMonth(month: string, by: number) {
  const [y, m] = month.split("-").map(Number);
  return iso(new Date(Date.UTC(y, m - 1 + by, 1))).slice(0, 7);
}
