"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Category, DateIdea } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Polaroid } from "@/components/ui/Polaroid";
import { SavedBy } from "@/components/ui/SavedBy";
import { Sheet } from "@/components/ui/Sheet";
import { pill, softPill } from "@/components/ui/Pill";
import { SaveLink } from "./SaveLink";
import { PetToast, type Toast } from "@/components/ui/PetToast";
import { Pet } from "@/components/illustrations/Pet";
import { cn, duration, priceMarks, shortDate } from "@/lib/utils/format";

export const CATEGORY: Record<Category, string> = {
  food: "Food",
  cafe: "Café",
  trip: "Trips",
  activity: "Activities",
  movie: "Movies",
  event: "Events",
  place: "Places",
};

/** Everything we keep saying we'll do: filter, tap for details, plan it. */
export function IdeasBoard({ ideas: initial, openId }: { ideas: DateIdea[]; openId?: string }) {
  const [ideas, setIdeas] = useState(initial);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [open, setOpen] = useState<DateIdea | undefined>(() => initial.find((i) => i.id === openId));
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const categories = (Object.keys(CATEGORY) as Category[]).filter((c) => ideas.some((i) => i.category === c));
  const shown = filter === "all" ? ideas : ideas.filter((i) => i.category === filter);

  return (
    <>
      <PageHeader
        title="Ideas"
        sub={`${ideas.length} places you keep saying you'll go`}
        action={
          <button type="button" onClick={() => setAdding(true)} className={pill} aria-haspopup="dialog">
            <Plus size={16} strokeWidth={2.2} aria-hidden /> Save
          </button>
        }
      />

      <div role="group" aria-label="Filter ideas" className="no-scrollbar content mt-6 flex gap-2 overflow-x-auto">
        {(["all", ...categories] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-label font-medium transition-colors", filter === c ? "bg-ink text-page" : "bg-sage text-muted hover:text-ink")}
          >
            {c === "all" ? "All" : CATEGORY[c]}
          </button>
        ))}
      </div>

      <ul className="content mt-10 grid grid-cols-2 gap-x-6 gap-y-10 pb-20 md:grid-cols-3 xl:grid-cols-4">
        {shown.map((idea, i) => (
          <li key={idea.id} className="relative">
            <button type="button" onClick={() => setOpen(idea)} className="block w-full text-left" aria-haspopup="dialog">
              <Polaroid
                scene={idea.scene}
                src={idea.image}
                alt={idea.title}
                caption={idea.title.toLowerCase()}
                aspect="aspect-square"
                tilt={i % 2 ? 1.6 : -1.6}
                hover
                note={idea.status === "planned" ? "planned ♡" : undefined}
                sizes="(min-width: 1280px) 14rem, (min-width: 768px) 30vw, 45vw"
              />
              <span className="mt-3 block px-1 text-label text-muted">{idea.location.area}</span>
            </button>
            <SavedBy who={idea.savedBy} className="pointer-events-none absolute -right-1 top-[58%]" />
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <div className="content mt-14 flex flex-col items-center text-center">
          <Pet who="sophia" mood="oops" size={72} />
          <p className="mt-4 text-muted">Nothing here yet. Save a link to start the list.</p>
        </div>
      )}

      <Sheet open={!!open} onClose={() => setOpen(undefined)} label={open?.title ?? "Idea"}>
        {open && (
          <div className="pt-6 lg:grid lg:grid-cols-[15rem_1fr] lg:items-center lg:gap-9 lg:pt-8">
            <div className="mx-auto w-3/5 lg:w-full">
              <Polaroid
                scene={open.scene}
                src={open.image}
                alt={open.title}
                caption={open.location.name.toLowerCase()}
                tilt={-2}
                tape
                note={`saved ${shortDate(open.savedAt).toLowerCase()}`}
                sizes="15rem"
              />
            </div>
            <div>
              <h2 className="mt-9 font-serif text-title lg:mt-0">{open.title}</h2>
              {open.description && <p className="mt-2 text-muted">{open.description}</p>}
              <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-label text-muted">
                <span>{open.location.area}</span>
                <span>{open.cuisine ?? CATEGORY[open.category]}</span>
                {open.rating && <span>{open.rating.toFixed(1)} ★</span>}
                {open.price && <span>{priceMarks(open.price)}</span>}
                <span>about {duration(open.durationMinutes)}</span>
              </p>
              {open.notes && <p className="mt-4 font-type text-[0.9375rem]">“{open.notes}”</p>}
              <p className="mt-4 flex items-center gap-2 text-[0.75rem] text-muted">
                <SavedBy who={open.savedBy} /> saved this {shortDate(open.savedAt)}
              </p>
              <div className="mt-6 flex gap-2">
                <Link href={`/plans/new?idea=${open.id}`} className={cn(pill, "flex-1 py-3.5")}>
                  Plan this
                </Link>
                {open.url && (
                  <a href={open.url} target="_blank" rel="noreferrer" className={cn(softPill, "py-3.5")}>
                    Open link <ArrowUpRight size={14} aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Sheet>

      <SaveLink
        open={adding}
        onClose={() => setAdding(false)}
        onSaved={(idea) => {
          setIdeas((xs) => [idea, ...xs]);
          setToast({ who: idea.savedBy, text: `Saved ${idea.title} to ideas` });
          setFilter("all");
        }}
      />
      <PetToast toast={toast} onDone={() => setToast(null)} />
    </>
  );
}
