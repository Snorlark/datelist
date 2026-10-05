"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PersonId } from "@/types";
import { Pet } from "@/components/illustrations/Pet";
import { Scallop } from "./Scallop";
import { cn } from "@/lib/utils/format";

/**
 * Section divider: a scalloped edge with Lark's dog or Sophia's cat peeking
 * over it. The pet pops up once when the edge reaches the middle of the screen,
 * tilts its head, and ducks when you hover it.
 */
export function PetDivider({
  who,
  id,
  title,
  sub,
  petAt = "left",
  action,
}: {
  who: PersonId;
  id: string;
  title: string;
  sub?: string;
  petAt?: "left" | "right";
  action?: React.ReactNode;
}) {
  const still = useReducedMotion();
  return (
    <div className="mt-24 scroll-mt-6 lg:mt-32" id={`${id}-section`}>
      <div className="relative">
        {/* the pet hides behind the edge; only the top of its head shows until it peeks */}
        <div className={cn("absolute bottom-[12px] h-[52px] w-[84px] overflow-hidden", petAt === "left" ? "left-[9%]" : "right-[9%]")}>
          <motion.div
            className="absolute inset-x-0 top-0 flex justify-center"
            initial={still ? false : { y: 46 }}
            whileInView={still ? undefined : { y: [46, 2, 6], rotate: [0, 0, petAt === "left" ? -8 : 8, 0] }}
            whileHover={still ? undefined : { y: 30, transition: { type: "spring", stiffness: 400, damping: 18 } }}
            // fire when the edge is ~40% up the screen ("some" — the pet itself starts hidden behind the edge)
            viewport={{ once: true, margin: "0px 0px -40% 0px" }}
            transition={{ duration: 1.1, times: [0, 0.45, 1], ease: "easeOut" }}
          >
            <Pet who={who} size={64} />
          </motion.div>
        </div>
        <Scallop />
        <div className="h-px bg-ink/80" />
      </div>
      <div className="content mt-12 flex flex-col items-center text-center">
        <h2 id={id} className="font-serif text-[1.875rem] leading-tight lg:text-[2.25rem]">
          {title}
        </h2>
        {sub && <p className="mt-2 text-label text-muted">{sub}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
