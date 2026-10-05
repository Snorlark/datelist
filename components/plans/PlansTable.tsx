import Link from "next/link";
import { CalendarDays, Clock, MapPin, Sparkles, Type } from "lucide-react";
import type { PlannedDate } from "@/types";
import { PlanRow } from "./PlanRow";
import { clock, cn, daysBetween, shortDate, weekdayShort } from "@/lib/utils/format";

const until = (today: string, day: string) => {
  const n = daysBetween(today, day);
  return n === 0 ? "Today" : n === 1 ? "Tomorrow" : `In ${n} days`;
};

const cellLink = "block px-3 py-3";

const HEAD = [
  { label: "Date", Icon: CalendarDays, className: "w-[22%]" },
  { label: "Plan", Icon: Type, className: "" },
  { label: "Place", Icon: MapPin, className: "w-[26%]" },
  { label: "Time", Icon: Clock, className: "w-[13%]" },
  { label: "When", Icon: Sparkles, className: "w-[14%]" },
];

/** Plans as a Notion database table on desktop; simple rows on phones. */
export function PlansTable({ plans, today }: { plans: PlannedDate[]; today: string }) {
  return (
    <>
      <table className="hidden w-full table-fixed border-collapse text-[0.875rem] md:table">
        <thead>
          <tr className="border-y border-line text-left text-[0.8125rem] text-muted">
            {HEAD.map(({ label, Icon, className }) => (
              <th key={label} scope="col" className={cn("px-3 py-2 font-normal", className)}>
                <span className="inline-flex items-center gap-1.5">
                  <Icon size={14} strokeWidth={1.8} aria-hidden /> {label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plans.map((p, i) => (
            <tr key={p.id} className="group border-b border-line transition-colors hover:bg-sage/70">
              {/* every cell links to the plan, so the whole row is clickable in every browser;
                  only the name is a tab stop, the rest are hidden duplicates */}
              <td className="text-muted">
                <Link href={`/plans/${p.id}`} tabIndex={-1} aria-hidden className={cellLink}>
                  {weekdayShort(p.date)}, {shortDate(p.date)}
                </Link>
              </td>
              <td className="font-medium">
                <Link href={`/plans/${p.id}`} className={cn(cellLink, "group-hover:underline")}>
                  {p.title}
                </Link>
              </td>
              <td className="max-w-0 text-muted">
                <Link href={`/plans/${p.id}`} tabIndex={-1} aria-hidden className={cn(cellLink, "truncate")}>
                  {p.location.name}
                </Link>
              </td>
              <td className="tabular-nums text-muted">
                <Link href={`/plans/${p.id}`} tabIndex={-1} aria-hidden className={cellLink}>
                  {clock(p.startTime)}
                </Link>
              </td>
              <td>
                <Link href={`/plans/${p.id}`} tabIndex={-1} aria-hidden className={cellLink}>
                  <span className={cn("rounded-full px-2 py-0.5 text-[0.75rem] font-medium", i === 0 ? "bg-lime text-onlime" : "bg-sage text-ink/70")}>{until(today, p.date)}</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-line overflow-hidden rounded-card bg-card ring-1 ring-line md:hidden">
        {plans.map((p) => (
          <li key={p.id}>
            <PlanRow plan={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
