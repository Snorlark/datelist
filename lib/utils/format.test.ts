import { test } from "node:test";
import assert from "node:assert/strict";
import { isISODay } from "./format.ts";

test("a cleared or half-typed date input is not a day", () => {
  for (const v of ["", "2026-1", "2026-13-01", "2026-02-30", "abc"]) assert.equal(isISODay(v), false, v);
});

test("real days are days", () => {
  for (const v of ["2026-10-05", "2028-02-29"]) assert.equal(isISODay(v), true, v);
});
