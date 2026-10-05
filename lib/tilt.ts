/**
 * Where the pointer is relative to a box → how far to turn something inside it.
 * Returns radians: yaw (turn left/right) and pitch (tip up/down), clamped so a
 * pointer far away never over-rotates. Dependency-free for `node --test`.
 */
const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

export function tiltFromPointer(
  px: number,
  py: number,
  rect: { left: number; top: number; width: number; height: number },
  max = { yaw: 0.32, pitch: 0.18 },
) {
  const nx = (px - rect.left - rect.width / 2) / (rect.width / 2);
  const ny = (py - rect.top - rect.height / 2) / (rect.height / 2);
  // `|| 0` turns NaN (zero-size box) and -0 into a clean 0
  return { yaw: clamp(nx * max.yaw, max.yaw) || 0, pitch: clamp(ny * max.pitch, max.pitch) || 0 };
}
