/**
 * Positions for prints laid along a gentle arc, like the Sundays photo strip.
 * x is a percentage offset from the container centre (−spread/2…spread/2),
 * y is how far (px) a print drops below the top of the arc, rotate is degrees.
 * Dependency-free so it can be unit tested with `node --test`.
 */
export function arcLayout(n: number, { spread = 84, lift = 36 }: { spread?: number; lift?: number } = {}) {
  if (n <= 0) return [];
  if (n === 1) return [{ x: 0, y: 0, rotate: -2 }];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1) - 0.5; // −0.5 … 0.5
    const jitter = i % 2 ? 1.5 : -1.5;
    return { x: t * spread, y: Math.round(lift * 4 * t * t), rotate: Math.round((t * 16 + jitter) * 10) / 10 };
  });
}

/** More than this and the arc turns into a pile; the table lists the rest. */
export const ARC_MAX = 5;

/** How wide (% of the container) an arc of n prints should spread. */
export const arcSpread = (n: number) => Math.min(84, (n - 1) * Math.max(19, 26 - (n - 1) * 2));
