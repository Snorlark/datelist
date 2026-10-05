import type { Memory } from "@/types";
import { Polaroid } from "@/components/ui/Polaroid";
import { shortDate, stampDate } from "@/lib/utils/format";

/** A memory: the print, where it was, the stars, the favourite part. */
export function MemoryCard({ memory, tilt = 0, tape }: { memory: Memory; tilt?: number; tape?: boolean }) {
  const photo = memory.photos[0];
  return (
    <article>
      <Polaroid scene={photo.scene} src={photo.src} alt={photo.caption ?? memory.title} caption={photo.caption ?? memory.title.toLowerCase()} aspect="aspect-[4/5]" tilt={tilt} tape={tape} hover note={stampDate(memory.date)} sizes="(min-width: 1280px) 14rem, (min-width: 768px) 30vw, 45vw" />
      <div className="mt-9 px-1">
        <h3 className="font-serif text-[1.375rem] leading-tight">{memory.title}</h3>
        <p className="text-[0.75rem] text-muted">
          {shortDate(memory.date)} · <span aria-label={`${memory.rating} out of 5`}>{"★".repeat(memory.rating)}</span>
        </p>
        {memory.favoriteMoment && <p className="mt-2 text-label leading-snug">“{memory.favoriteMoment}”</p>}
      </div>
    </article>
  );
}
