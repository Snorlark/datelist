"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { Memory, Scene } from "@/types";
import { Polaroid } from "@/components/ui/Polaroid";

type Print = { key: string; scene: Scene; src?: string; caption: string };

// hand-placed, like prints spilling in from two corners (Sundays "who we are")
const LEFT = [
  { left: "-6%", top: "44%", rotate: -14 },
  { left: "4%", top: "56%", rotate: -5 },
  { left: "14%", top: "70%", rotate: 6 },
];
const RIGHT = [
  { right: "14%", top: "0%", rotate: -6 },
  { right: "4%", top: "8%", rotate: 5 },
  { right: "-6%", top: "22%", rotate: 15 },
];

/** A print that slides in from its corner as `fan` goes 0 → 1. */
function FannedPrint({ p, i, side, fan }: { p: Print; i: number; side: "left" | "right"; fan: MotionValue<number> }) {
  const spot = side === "left" ? LEFT[i] : RIGHT[i];
  // the outermost print arrives first, the inner ones follow
  const start = (2 - i) * 0.14;
  const t = useTransform(fan, [start, start + 0.6], [0, 1], { clamp: true });
  const dir = side === "left" ? -1 : 1;
  const x = useTransform(t, [0, 1], [dir * 220, 0]);
  const y = useTransform(t, [0, 1], [side === "left" ? 140 : -120, 0]);
  const rotate = useTransform(t, [0, 1], [spot.rotate + dir * 24, spot.rotate]);
  const opacity = useTransform(t, [0, 0.25], [0, 1]);
  return (
    <motion.div className="absolute w-[10rem] hover:!z-20" style={{ ...("left" in spot ? { left: spot.left } : { right: spot.right }), top: spot.top, x, y, rotate, opacity }}>
      <Polaroid scene={p.scene} src={p.src} alt="" caption={p.caption} aspect="aspect-[4/5]" hover sizes="10rem" />
    </motion.div>
  );
}

/** Memories fanning in from the corners (scroll-linked on desktop) around one quiet line. */
export function LatelyCurve({ memories }: { memories: Memory[] }) {
  const still = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 95%", "center 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const done = useMotionValue(1);
  const fan = still ? done : smooth;

  const prints: Print[] = memories.flatMap((m) => m.photos.map((p, i) => ({ key: `${m.id}-${i}`, scene: p.scene, src: p.src, caption: p.caption ?? m.title.toLowerCase() }))).slice(0, 6);

  const line = (
    <div className="relative z-10 mx-auto max-w-sm text-center">
      <p className="font-serif text-[1.625rem] leading-snug lg:text-[2rem]">
        <em>{memories.length}</em> dates we actually went on, kept like a scrapbook.
      </p>
      <Link href="/memories" className="mt-4 inline-flex items-center text-label font-medium text-muted hover:text-ink">
        All memories <ChevronRight size={15} aria-hidden />
      </Link>
    </div>
  );

  return (
    <>
      <div ref={box} className="relative hidden h-[32rem] lg:block">
        {prints.slice(0, 3).map((p, i) => (
          <FannedPrint key={p.key} p={p} i={i} side="left" fan={fan} />
        ))}
        {prints.slice(3, 6).map((p, i) => (
          <FannedPrint key={p.key} p={p} i={i} side="right" fan={fan} />
        ))}
        <div className="absolute inset-x-0 top-[34%]">{line}</div>
      </div>

      <div className="lg:hidden">
        {line}
        <div className="mt-8 flex justify-center pb-4">
          {prints.slice(0, 3).map((p, i) => (
            <Polaroid key={p.key} scene={p.scene} src={p.src} alt="" caption={p.caption} aspect="aspect-[4/5]" tilt={[-7, 1, 8][i]} sizes="8rem" className={i ? "-ml-6 w-[34%]" : "w-[34%]"} />
          ))}
        </div>
      </div>
    </>
  );
}
