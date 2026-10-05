import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { PageCover } from "@/components/shell/PageCover";
import { BalloonTitle } from "@/components/hero/BalloonTitle";
import { PetDivider } from "@/components/scrapbook/PetDivider";
import { NextTicket } from "@/components/plans/NextTicket";
import { PlanArc } from "@/components/plans/PlanArc";
import { PlansTable } from "@/components/plans/PlansTable";
import { FreeCards } from "@/components/plans/FreeCards";
import { LatelyCurve } from "@/components/memories/LatelyCurve";
import { Polaroid } from "@/components/ui/Polaroid";
import { SavedBy } from "@/components/ui/SavedBy";
import { PillLink } from "@/components/ui/Pill";
import { getIdeas, getMemories, getUpcomingDates, today } from "@/lib/repository";
import { getFreeTogether } from "@/lib/freeTogether";
import { dayOfMonth, monthName, weekday } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

// jump links under the hero, so the long page never feels lost
const JUMPS = [
  { href: "#coming-up-section", label: "Coming up" },
  { href: "#free-section", label: "Both free" },
  { href: "#ideas-section", label: "Ideas" },
  { href: "#lately-section", label: "Memories" },
];

/** The dashboard: plans first, then when we're both free, then ideas and memories. */
export default async function PlansPage() {
  const now = today();
  const [plans, ideas, memories, free] = await Promise.all([getUpcomingDates(), getIdeas(), getMemories(), getFreeTogether()]);
  const next = plans[0];
  const saved = ideas.filter((i) => i.status === "saved");

  return (
    <>
      <PageCover
        crumb="Plans"
        tall
        aside={
          <span>
            {weekday(now)}, {monthName(now)} {dayOfMonth(now)}
          </span>
        }
      />

      {/* hello */}
      <header className="content pt-14 text-center lg:pt-16">
        <p className="text-label text-muted">Lark &amp; Sophia&apos;s</p>
        <BalloonTitle text="datelist" />
        <p className="mx-auto max-w-xl font-serif text-[1.375rem] leading-relaxed lg:text-[1.75rem]">
          <span className="highlight">{next ? `${plans.length === 1 ? "One plan" : `${plans.length} plans`} coming up.` : "Nothing planned yet."}</span>
          {!next && " Pick something from your ideas."}
        </p>
        {next && (
          <div className="mt-7">
            <NextTicket plan={next} today={now} />
          </div>
        )}
        <PillLink href="/plans/new" className="mt-7">
          <Plus size={16} strokeWidth={2.2} aria-hidden /> Plan a date
        </PillLink>
        <nav aria-label="On this page" className="mt-8 flex flex-wrap justify-center gap-2">
          {JUMPS.map((j) => (
            <a key={j.href} href={j.href} className="rounded-full px-3 py-1.5 text-label text-muted ring-1 ring-line transition-colors hover:bg-sage hover:text-ink">
              {j.label}
            </a>
          ))}
        </nav>
      </header>

      {/* coming up */}
      {next && (
        <section aria-labelledby="coming-up">
          <PetDivider id="coming-up" who="lark" title="Coming up" sub="Tap a print to open the plan." />
          <div className="content mt-10">
            <PlanArc plans={plans} />
            <div className="mt-6 lg:mt-4">
              <PlansTable plans={plans} today={now} />
            </div>
          </div>
        </section>
      )}

      {/* both free */}
      {free.suggestions.length > 0 && (
        <section aria-labelledby="free">
          <PetDivider id="free" who="sophia" petAt="right" title="When you're both free" sub="From both calendars, the next two weeks." />
          <div className="content mt-10">
            <FreeCards suggestions={free.suggestions} />
          </div>
        </section>
      )}

      {/* ideas */}
      <section aria-labelledby="ideas">
        <PetDivider
          id="ideas"
          who="lark"
          title="Someday list"
          sub={`${saved.length} places you keep saying you'll go.`}
          action={
            <Link href="/ideas" className="inline-flex items-center text-label font-medium text-muted hover:text-ink">
              All ideas <ChevronRight size={15} aria-hidden />
            </Link>
          }
        />
        <ul className="content mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {saved.slice(0, 8).map((idea, i) => (
            <li key={idea.id} className="relative">
              <Link href={`/ideas?open=${idea.id}`} className="block" aria-label={idea.title}>
                <Polaroid scene={idea.scene} src={idea.image} alt="" caption={idea.title.toLowerCase()} aspect="aspect-square" tilt={i % 2 ? 1.6 : -1.6} hover sizes="(min-width: 1280px) 14rem, (min-width: 768px) 30vw, 45vw" />
              </Link>
              <SavedBy who={idea.savedBy} className="pointer-events-none absolute -right-1 top-[62%]" />
            </li>
          ))}
        </ul>
      </section>

      {/* memories */}
      {memories.length > 0 && (
        <section aria-labelledby="lately" className="pb-20 lg:pb-28">
          <PetDivider id="lately" who="sophia" petAt="right" title="Lately" />
          <div className="content mt-12">
            <LatelyCurve memories={memories} />
          </div>
        </section>
      )}
    </>
  );
}
