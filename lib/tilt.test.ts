import { test } from "node:test";
import assert from "node:assert/strict";
import { tiltFromPointer } from "./tilt.ts";

const r = { left: 0, top: 0, width: 200, height: 100 };

test("centre is rest", () => assert.deepEqual(tiltFromPointer(100, 50, r), { yaw: 0, pitch: 0 }));

test("right edge turns right, top edge tips up", () => {
  const t = tiltFromPointer(200, 0, r);
  assert.ok(t.yaw > 0 && t.pitch < 0);
});

test("far outside is clamped to max", () => {
  const t = tiltFromPointer(99999, -99999, r, { yaw: 0.3, pitch: 0.2 });
  assert.equal(t.yaw, 0.3);
  assert.equal(t.pitch, -0.2);
});

test("an empty rect never produces NaN", () => {
  const t = tiltFromPointer(10, 10, { left: 0, top: 0, width: 0, height: 0 });
  assert.ok(Number.isFinite(t.yaw) && Number.isFinite(t.pitch));
});
