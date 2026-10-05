import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PlannedDate } from "@/types";
import { PhotoPlate } from "@/components/illustrations/PhotoPlate";
import { clock, daysBetween, shortDate, weekdayShort } from "@/lib/utils/format";

/** The next plan at a glance, right under the title: a little ticket stub. */
export function NextTicket({ plan, today }: { plan: PlannedDate; today: string }) {
  const n = daysBetween(today, plan.date);
  const when = n === 0 ? "Today" : n === 1 ? "Tomorrow" : `In ${n} days`;
  return (
    <Link
      href={`/plans/${plan.id}`}
      className="group mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl bg-card p-3 pr-4 text-left ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgb(0_0_0/0.35)]"
    >
      <span className="w-16 shrink-0 rotate-[-4deg] bg-print p-1 pb-2 shadow-[0_4px_10px_-4px_rgb(0_0_0/0.3)] transition-transform duration-300 group-hover:rotate-0">
        <PhotoPlate scene={plan.scene} src={plan.image} alt="" className="aspect-square" sizes="4rem" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[0.75rem] text-muted">
          Next up <span className="rounded-full bg-lime px-2 py-0.5 font-medium text-onlime">{when}</span>
        </span>
        <span className="mt-0.5 block truncate font-serif text-[1.25rem] leading-snug">{plan.title}</span>
        <span className="block truncate text-label text-muted">
          {weekdayShort(plan.date)}, {shortDate(plan.date)} · {clock(plan.startTime)} · {plan.location.name}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
