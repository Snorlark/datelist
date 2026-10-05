"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Scene } from "@/types";
import { PhotoPlate } from "@/components/illustrations/PhotoPlate";
import { cn } from "@/lib/utils/format";

const REST = "0 1px 2px rgb(0 0 0 / 0.06), 0 12px 28px -14px rgb(0 0 0 / 0.28)";
const LIFTED = "0 2px 4px rgb(0 0 0 / 0.06), 0 26px 40px -18px rgb(0 0 0 / 0.38)";

/**
 * A print with a white border and a typewriter caption, like the Sundays photos.
 * Optional washi `tape` on top and a typewriter date `note` stuck beside it.
 * With `hover`, it lifts and straightens under the pointer.
 */
export function Polaroid({
  scene,
  src,
  alt,
  caption,
  tilt = 0,
  aspect = "aspect-[4/3]",
  sizes,
  priority,
  tape,
  note,
  hover,
  className,
}: {
  scene: Scene;
  src?: string;
  alt: string;
  caption?: string;
  tilt?: number;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  tape?: boolean;
  note?: string;
  hover?: boolean;
  className?: string;
}) {
  const still = useReducedMotion();
  return (
    <motion.figure
      className={cn("relative bg-print p-2 pb-1", className)}
      style={{ rotate: tilt, boxShadow: REST }}
      whileHover={hover && !still ? { rotate: 0, y: -6, scale: 1.02, boxShadow: LIFTED } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {tape && <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-[38%] -translate-x-1/2 -rotate-3 bg-tape/75 mix-blend-multiply" />}
      <PhotoPlate scene={scene} src={src} alt={alt} className={aspect} sizes={sizes} priority={priority} />
      <figcaption className="truncate px-0.5 py-2 font-type text-[0.75rem] leading-none text-[#2b2b28]">{caption ?? " "}</figcaption>
      {note && <span className="absolute -bottom-6 right-1 -rotate-3 whitespace-nowrap font-type text-[0.8125rem] text-coral">{note}</span>}
    </motion.figure>
  );
}
