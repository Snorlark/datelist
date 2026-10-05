import { test } from "node:test";
import assert from "node:assert/strict";
import { monthGrid, shiftMonth } from "./month.ts";

test("October 2026 starts on a Thursday, weeks start Monday", () => {
  const g = monthGrid("2026-10");
  assert.equal(g.length % 7, 0);
  assert.equal(g[0].day, "2026-09-28"); // Monday before Oct 1
  assert.equal(g[3].day, "2026-10-01");
  assert.equal(g[3].inMonth, true);
  assert.equal(g[0].inMonth, false);
  assert.equal(g.at(-1)!.day, "2026-11-01"); // Sunday after Oct 31
});

test("a month that starts on Monday has no leading days", () => {
  const g = monthGrid("2026-06"); // June 1 2026 is a Monday
  assert.equal(g[0].day, "2026-06-01");
});

test("February in a leap year fits", () => {
  const g = monthGrid("2028-02");
  assert.equal(g.filter((c) => c.inMonth).length, 29);
});

test("shiftMonth crosses years", () => {
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
});
