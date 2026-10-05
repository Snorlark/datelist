import type { PersonId } from "@/types";
import { cn } from "@/lib/utils/format";

const NAME: Record<PersonId, string> = { lark: "Lark", sophia: "Sophia" };
const BG: Record<PersonId, string> = { lark: "bg-lark", sophia: "bg-sophia" };
const FILL: Record<PersonId, string> = { lark: "fill-lark", sophia: "fill-sophia" };

/** A little multiplayer cursor with a name tag — shows who saved something. */
export function SavedBy({ who, className }: { who: PersonId; className?: string }) {
  return (
    <span className={cn("inline-flex items-start", className)}>
      <svg viewBox="0 0 12 14" className={cn("h-3 w-3 -rotate-6", FILL[who])} aria-hidden>
        <path d="M0 0 12 6.5 6.6 7.6 4 13.5z" />
      </svg>
      <span className={cn("ml-0.5 mt-2 rounded-[4px] px-1.5 py-0.5 text-[0.6875rem] font-medium leading-none text-white", BG[who])}>{NAME[who]}</span>
    </span>
  );
}
