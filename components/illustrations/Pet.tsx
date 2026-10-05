import Image from "next/image";
import type { PersonId } from "@/types";
import { cn } from "@/lib/utils/format";

/**
 * Lark is the dog, Sophia is the cat (Animoji stickers in /public/pets).
 * Pick the face that fits the moment:
 *   happy — default, cover bands, dividers, sidebar
 *   love  — something got saved or planned
 *   oops  — errors and empty states
 *   sad   — 404, nothing here
 */
export type Mood = "happy" | "love" | "oops" | "sad";

const FILE: Record<PersonId, Record<Mood, string>> = {
  lark: { happy: "dog", love: "dog-love", oops: "dog-sad", sad: "dog-sad" },
  sophia: { happy: "cat", love: "cat-love", oops: "cat-oops", sad: "cat-sad" },
};

// natural aspect ratios (w / h) so layout never jumps while images load
const RATIO: Record<string, number> = {
  dog: 344 / 260,
  "dog-love": 347 / 247,
  "dog-sad": 339 / 260,
  cat: 267 / 291,
  "cat-love": 126 / 142,
  "cat-oops": 263 / 307,
  "cat-sad": 123 / 140,
};

export const PET_NAME: Record<PersonId, string> = { lark: "Lark's dog", sophia: "Sophia's cat" };

export function Pet({ who, mood = "happy", size = 56, className, priority, label }: { who: PersonId; mood?: Mood; size?: number; className?: string; priority?: boolean; label?: string }) {
  const file = FILE[who][mood];
  const ratio = RATIO[file];
  // size is the height; width follows the sticker
  const h = size;
  const w = Math.round(size * ratio);
  return (
    <Image
      src={`/pets/${file}.webp`}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      width={w}
      height={h}
      priority={priority}
      draggable={false}
      unoptimized // already small, hand-optimised webp
      className={cn("pointer-events-none select-none drop-shadow-[0_6px_8px_rgb(0_0_0/0.12)]", className)}
      style={{ width: w, height: h }}
    />
  );
}
