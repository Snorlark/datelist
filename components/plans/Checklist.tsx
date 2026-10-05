"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Reminder } from "@/types";
import { cn } from "@/lib/utils/format";

/** Things to remember for a plan. The secret one stays blurred until tapped. */
export function Checklist({ initial }: { initial: Reminder[] }) {
  const [items, setItems] = useState(initial);
  const toggle = (id: string) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <ul className="divide-y divide-line">
      {items.map((r) => (
        <li key={r.id}>
          <label className="group flex cursor-pointer items-center gap-3 px-4 py-3">
            <input type="checkbox" checked={r.done} onChange={() => toggle(r.id)} className="peer sr-only" />
            <span
              aria-hidden
              className={cn(
                "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-violet",
                r.done ? "border-ink bg-ink text-page" : "border-faint",
              )}
            >
              {r.done && <Check size={13} strokeWidth={3} />}
            </span>
            <span className={cn("flex-1 transition-colors", r.done && "text-muted line-through", r.secret && !r.done && "blur-[4px] group-active:blur-0 group-hover:blur-0")}>
              {r.label}
            </span>
            {r.secret && <span className="rounded-full bg-sophia/10 px-2 py-0.5 text-[0.6875rem] font-medium text-sophia">secret</span>}
          </label>
        </li>
      ))}
    </ul>
  );
}
