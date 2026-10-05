import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PlannedDate } from "@/types";
import { clock, dayOfMonth, weekdayShort } from "@/lib/utils/format";

/** One plan as a list row: date tile, name, time and place. */
export function PlanRow({ plan }: { plan: PlannedDate }) {
  return (
    <Link href={`/plans/${plan.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-page active:bg-sage">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage leading-none">
        <span className="text-center">
          <span className="block text-[0.625rem] font-semibold uppercase text-muted">{weekdayShort(plan.date)}</span>
          <span className="mt-0.5 block font-serif text-[1.375rem]">{dayOfMonth(plan.date)}</span>
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{plan.title}</span>
        <span className="block truncate text-label text-muted">
          {clock(plan.startTime)} · {plan.location.name}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-faint" aria-hidden />
    </Link>
  );
}
