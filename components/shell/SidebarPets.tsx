"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PersonId } from "@/types";
import { Pet } from "@/components/illustrations/Pet";

function Buddy({ who }: { who: PersonId }) {
  const still = useReducedMotion();
  const [happy, setHappy] = useState(false);
  return (
    <motion.span
      className="inline-block"
      onHoverStart={() => setHappy(true)}
      onHoverEnd={() => setHappy(false)}
      animate={happy && !still ? { y: [0, -6, 0], rotate: [0, who === "lark" ? -6 : 6, 0] } : { y: 0, rotate: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* hover swaps to the love face */}
      <Pet who={who} mood={happy ? "love" : "happy"} size={44} />
    </motion.span>
  );
}

/** Lark's dog and Sophia's cat at the bottom of the sidebar. Hover one to say hi. */
export function SidebarPets() {
  return (
    <div className="flex items-end gap-2" aria-hidden>
      <Buddy who="lark" />
      <Buddy who="sophia" />
    </div>
  );
}
