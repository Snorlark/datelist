"use client";

import { useState } from "react";
import type { Memory, PlannedDate } from "@/types";
import { MemoryCard } from "./MemoryCard";
import { Pet } from "@/components/illustrations/Pet";
import { pill } from "@/components/ui/Pill";
import { cn } from "@/lib/utils/format";

/** Plan → memory. Stars, a favourite part, done. */
export function HowWasIt({ date }: { date: PlannedDate }) {
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState("");
  const [kept, setKept] = useState<Memory | null>(null);

  function keep(e: React.FormEvent) {
    e.preventDefault();
    setKept({
      id: `m-${date.id}`,
      dateId: date.id,
      title: date.title,
      date: date.date,
      place: date.location.name,
      area: date.location.area,
      photos: [{ scene: date.scene, src: date.image }],
      rating: (rating || 5) as Memory["rating"],
      favoriteMoment: favorite,
      createdAt: date.date,
    });
  }

  if (kept)
    return (
      <div className="mt-5">
        <div className="mx-auto w-1/2">
          <MemoryCard memory={kept} tilt={-2} />
        </div>
        <p role="status" className="mt-6 flex items-center justify-center gap-2 text-center text-label text-muted">
          <Pet who="lark" mood="love" size={30} />
          Here&apos;s how it&apos;ll look in your memories.
        </p>
      </div>
    );

  return (
    <form onSubmit={keep} className="mt-4 space-y-4">
      <fieldset>
        <legend className="sr-only">Rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              className={cn("text-[2rem] leading-none transition-transform active:scale-90", rating >= n ? "text-ink" : "text-faint")}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="sr-only">Favorite part</span>
        <input
          required
          value={favorite}
          onChange={(e) => setFavorite(e.target.value)}
          placeholder="Favorite part?"
          className="w-full rounded-card bg-card px-4 py-3.5 outline-none ring-1 ring-line placeholder:text-faint focus:ring-ink"
        />
      </label>
      <button type="submit" className={cn(pill, "w-full py-3.5")}>
        Save memory
      </button>
    </form>
  );
}
