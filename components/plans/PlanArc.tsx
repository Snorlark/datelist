"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { PlannedDate } from "@/types";
import { Polaroid } from "@/components/ui/Polaroid";
import { ARC_MAX, arcLayout, arcSpread } from "@/lib/scrapbook";
import { shortDate, weekdayShort } from "@/lib/utils/format";

const note = (p: PlannedDate) => `${weekdayShort(p.date)} · ${shortDate(p.date)} ♡`.toLowerCase();
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** One print, dealt from the stack to its place on the arc as `deal` goes 0 → 1. */
function DealtPrint({ plan, i, n, spot, deal }: { plan: PlannedDate; i: number; n: number; spot: { x: number; y: number; rotate: number }; deal: MotionValue<number> }) {
  // each print leaves the stack a little after the one before it
  const start = (i / Math.max(n, 1)) * 0.45;
  const t = useTransform(deal, [start, start + 0.55], [0, 1], { clamp: true });
  const stackRotate = (i - (n - 1) / 2) * 5;
  const left = useTransform(t, (v) => `${50 + lerp(0, spot.x, v)}%`);
  const top = useTransform(t, (v) => lerp(46 - i * 3, spot.y, v));
  const rotate = useTransform(t, (v) => lerp(stackRotate, spot.rotate, v));
  return (
    <motion.li className="absolute w-[15rem] -translate-x-1/2 hover:!z-20 focus-within:!z-20" style={{ left, top, rotate, zIndex: n - i }}>
      <Link href={`/plans/${plan.id}`} className="block" aria-label={`${plan.title}, ${shortDate(plan.date)}`}>
        <Polaroid scene={plan.scene} src={plan.image} alt="" caption={plan.title.toLowerCase()} tape={i === 0} note={note(plan)} hover sizes="15rem" priority={i === 0} />
      </Link>
    </motion.li>
  );
}

/**
 * Upcoming plans as prints. On desktop they start as a stack and get dealt
 * into an arc as the section scrolls into view (scroll back and they gather
 * up again). On phones they're a strip you swipe.
 */
export function PlanArc({ plans }: { plans: PlannedDate[] }) {
  const still = useReducedMotion();
  const box = useRef<HTMLUListElement>(null);
  const shown = plans.slice(0, ARC_MAX); // the table below lists every plan
  const spots = arcLayout(shown.length, { spread: arcSpread(shown.length), lift: 40 });

  const { scrollYProgress } = useScroll({ target: box, offset: ["start 92%", "center 58%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const done = useMotionValue(1);
  const deal = still ? done : smooth;

  return (
    <>
      <ul ref={box} className="relative mx-auto hidden h-[23rem] max-w-[60rem] lg:block">
        {shown.map((p, i) => (
          <DealtPrint key={p.id} plan={p} i={i} n={shown.length} spot={spots[i]} deal={deal} />
        ))}
      </ul>

      <ul className="no-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-10 pt-4 lg:hidden">
        {plans.map((p, i) => (
          <li key={p.id} className="w-[13.5rem] shrink-0 snap-center">
            <Link href={`/plans/${p.id}`} className="block" aria-label={`${p.title}, ${shortDate(p.date)}`}>
              <Polaroid scene={p.scene} src={p.image} alt="" caption={p.title.toLowerCase()} tilt={i % 2 ? 2 : -2} tape={i === 0} note={note(p)} sizes="13.5rem" priority={i === 0} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
