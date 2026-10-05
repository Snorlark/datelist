"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { AgendaItem, DateIdea } from "@/types";
import { PhotoPlate } from "@/components/illustrations/PhotoPlate";
import { Polaroid } from "@/components/ui/Polaroid";
import { Pet } from "@/components/illustrations/Pet";
import { pill, softPill } from "@/components/ui/Pill";
import { addDays, clock, cn, fromMinutes, isISODay, shortDate, toMinutes, weekday, weekdayShort } from "@/lib/utils/format";

/** Leave → each idea in turn → home, so a plan always has a rough shape. */
function draftAgenda(ideas: DateIdea[], start: string): AgendaItem[] {
  let t = toMinutes(start);
  const items: AgendaItem[] = [];
  for (const i of ideas) {
    items.push({ time: fromMinutes(Math.min(t, 23 * 60 + 30)), label: i.title, note: i.location.area });
    t += i.durationMinutes + 20;
  }
  return items;
}

const field = "w-full bg-transparent px-4 py-3.5 outline-none placeholder:text-faint";
const row = "flex items-center justify-between gap-3 px-4";

/** Four questions: what, when, what to call it, anything to remember. */
export function PlanForm({ ideas, prefill, today }: { ideas: DateIdea[]; prefill: { ideaIds: string[]; day?: string; start?: string }; today: string }) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>(prefill.ideaIds.filter((id) => ideas.some((i) => i.id === id)));
  const [day, setDay] = useState(prefill.day ?? addDays(today, 5));
  const [start, setStart] = useState(prefill.start ?? "18:00");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const chosen = picked.map((id) => ideas.find((i) => i.id === id)!).filter(Boolean);
  // a cleared or half-typed date input gives "" — keep showing the last real day
  const lastDay = useRef(day);
  if (isISODay(day)) lastDay.current = day;
  const shownDay = lastDay.current;
  const name = title.trim() || `Our ${weekday(shownDay)}`;
  const toggle = (id: string) => setPicked((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    const agenda = draftAgenda(chosen, start);
    const end = fromMinutes(
      Math.min(
        toMinutes(start) +
          Math.max(
            120,
            chosen.reduce((a, i) => a + i.durationMinutes + 20, 0),
          ),
        23 * 60 + 59,
      ),
    );
    const res = await fetch("/api/dates", {
      method: "POST",
      body: JSON.stringify({ title: name, date: day, startTime: start, endTime: end, ideaIds: picked, agenda, notes: notes || undefined }),
    });
    if (!res.ok) return setState("error");
    setState("saved");
    router.refresh();
  }

  if (state === "saved")
    return (
      <div className="content mt-16 text-center">
        <span className="flex items-end justify-center gap-2">
          <Pet who="lark" mood="love" size={78} />
          <Pet who="sophia" mood="love" size={66} />
        </span>
        <p role="status" className="mt-5 font-serif text-[2rem] leading-tight">
          {name} is planned.
        </p>
        <p className="mt-2 text-label text-muted">It&apos;s on your plans now.</p>
        <Link href="/" className={cn(pill, "mt-6")}>
          Back to plans
        </Link>
      </div>
    );

  return (
    <div className="content mt-8 grid gap-12 pb-20 lg:mt-10 lg:grid-cols-[1fr_17rem] lg:gap-16">
      <form onSubmit={save} className="min-w-0 space-y-10">
        <fieldset className="min-w-0">
          <legend className="font-serif text-heading">What are you doing?</legend>
          <p className="mt-1 text-label text-muted">Pick from your ideas, or skip it and decide later.</p>
          <ul className="no-scrollbar -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1 pt-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0">
            {ideas.map((i) => {
              const on = picked.includes(i.id);
              return (
                <li key={i.id} className="w-28 shrink-0 lg:w-auto">
                  <button type="button" aria-pressed={on} onClick={() => toggle(i.id)} className="block w-full text-left">
                    <span className={cn("relative block rounded-2xl bg-card p-1.5 ring-1 transition-all", on ? "ring-2 ring-ink" : "ring-line")}>
                      <PhotoPlate scene={i.scene} src={i.image} alt="" className="aspect-square rounded-xl" sizes="7rem" />
                      {on && (
                        <span className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-ink text-page">
                          <Check size={14} strokeWidth={3} aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 block truncate px-1 text-label font-medium">{i.title}</span>
                    <span className="block truncate px-1 text-[0.75rem] text-muted">{i.location.area}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="font-serif text-heading">When?</legend>
          <div className="mt-3 divide-y divide-line rounded-card bg-card ring-1 ring-line">
            <label className={row}>
              <span>Day</span>
              <input type="date" required value={day} min={today} onChange={(e) => setDay(e.target.value)} className="bg-transparent py-3.5 text-right text-muted outline-none" />
            </label>
            <label className={row}>
              <span>Starts</span>
              <input type="time" required value={start} onChange={(e) => setStart(e.target.value)} className="bg-transparent py-3.5 text-right text-muted outline-none" />
            </label>
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="font-serif text-heading">Anything else?</legend>
          <div className="mt-3 divide-y divide-line rounded-card bg-card ring-1 ring-line">
            <label className="block">
              <span className="sr-only">Name</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`Name it (${name})`} className={field} />
            </label>
            <label className="block">
              <span className="sr-only">Note</span>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="A note, like “wear the old jeans”" className={cn(field, "resize-none")} />
            </label>
          </div>
        </fieldset>

        {state === "error" && (
          <p role="alert" className="text-label text-sophia">
            That didn&apos;t save. Check your connection and try again.
          </p>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={state === "saving"} className={cn(pill, "flex-1 py-3.5")}>
            {state === "saving" ? "Planning…" : `Plan ${name}`}
          </button>
          <Link href="/" className={cn(softPill, "py-3.5")}>
            Cancel
          </Link>
        </div>
      </form>

      {/* live preview: the plan as a print, before it exists */}
      <aside aria-label="Preview" className="hidden lg:block">
        <div className="sticky top-10">
          <p className="mb-5 text-label text-muted">Preview</p>
          <Polaroid
            scene={chosen[0]?.scene ?? "sunset"}
            src={chosen[0]?.image}
            alt=""
            caption={name.toLowerCase()}
            tilt={-2.5}
            tape
            note={`${weekdayShort(shownDay)} · ${shortDate(shownDay)} ♡`.toLowerCase()}
            sizes="17rem"
          />
          <p className="mt-12 font-serif text-[1.375rem] leading-snug">{name}</p>
          <p className="mt-1 text-label text-muted">
            {weekday(shownDay)} at {clock(start)}
            {chosen.length > 0 && <> · {chosen.map((i) => i.title).join(" + ")}</>}
          </p>
        </div>
      </aside>
    </div>
  );
}
