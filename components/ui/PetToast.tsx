"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PersonId } from "@/types";
import { Pet, type Mood } from "@/components/illustrations/Pet";

export type Toast = { who: PersonId; mood?: Mood; text: string } | null;

/** A small confirmation at the bottom, with the pet who did it. Goes away by itself. */
export function PetToast({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8 lg:pl-[248px]">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.text}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="flex items-center gap-3 rounded-full bg-ink py-1.5 pl-2 pr-5 text-label font-medium text-page shadow-[0_14px_30px_-12px_rgb(0_0_0/0.4)]"
          >
            <motion.span initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12, delay: 0.05 }}>
              <Pet who={toast.who} mood={toast.mood ?? "love"} size={34} />
            </motion.span>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
