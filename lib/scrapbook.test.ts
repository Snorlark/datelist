import { test } from "node:test";
import assert from "node:assert/strict";
import { arcLayout } from "./scrapbook.ts";

test("no items, no positions", () => assert.deepEqual(arcLayout(0), []));

test("one item sits centred and straight-ish", () => {
  const [p] = arcLayout(1);
  assert.equal(p.x, 0);
  assert.ok(Math.abs(p.rotate) <= 4);
});

test("items stay inside the container and fan symmetrically", () => {
  for (const n of [2, 3, 5, 9]) {
    const ps = arcLayout(n);
    assert.equal(ps.length, n);
    for (const p of ps) assert.ok(p.x >= -42 && p.x <= 42, `x ${p.x}`);
    assert.equal(Math.round(ps[0].x), -Math.round(ps[n - 1].x));
    assert.ok(ps[0].rotate < 0 && ps[n - 1].rotate > 0);
  }
});

test("the arc never holds more prints than fit, and they never pile up", async () => {
  const { ARC_MAX, arcSpread } = await import("./scrapbook.ts");
  const inner = 664; // narrowest desktop content width (px)
  for (let n = 2; n <= ARC_MAX; n++) {
    const gap = ((arcSpread(n) / 100) * inner) / (n - 1);
    assert.ok(gap >= 120, `n=${n} gap=${gap}`);
  }
  assert.ok(ARC_MAX <= 5);
});
