import type { DateIdea, FreeWindow, Preference, Suggestion } from "@/types";
import { duration, toMinutes } from "@/lib/utils/format";

const TRAVEL_BUFFER = 20;

function partOfDay(startMinutes: number): DateIdea["bestTime"] {
  if (startMinutes < 12 * 60) return "morning";
  if (startMinutes < 17 * 60) return "afternoon";
  return "evening";
}

/** Small, explainable taste score. No black box — Lark and Sophia should see why. */
export function tasteScore(idea: DateIdea, prefs: Preference[]) {
  let score = 0;
  for (const p of prefs) {
    if (!p.tags.some((t) => idea.tags.includes(t))) continue;
    const weight = p.who === "both" ? 2 : 1;
    score += p.sentiment === "love" ? weight : -weight * 3;
  }
  return score;
}

/**
 * For a free window, pick one or two saved ideas that fit in time, suit the
 * time of day, and lean toward things they both love.
 */
export function suggestForWindow(
  window: FreeWindow,
  ideas: DateIdea[],
  prefs: Preference[],
): Suggestion | null {
  const open = ideas.filter((i) => i.status === "saved");
  const startPart = partOfDay(toMinutes(window.start));
  const ranked = open
    .filter((i) => i.durationMinutes + TRAVEL_BUFFER <= window.minutes)
    .map((i) => ({
      idea: i,
      score:
        tasteScore(i, prefs) +
        (i.bestTime === startPart || i.bestTime === "any" ? 2 : 0) +
        (i.rating ?? 4) / 2,
    }))
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) return null;
  const first = ranked[0].idea;

  // try to pair an activity with food, the way people actually plan dates
  const pairable = ranked.find(
    (r) =>
      r.idea.id !== first.id &&
      (r.idea.category === "food" || r.idea.category === "cafe") !==
        (first.category === "food" || first.category === "cafe") &&
      first.durationMinutes + r.idea.durationMinutes + TRAVEL_BUFFER * 2 <= window.minutes,
  );

  const picks = pairable ? [first, pairable.idea] : [first];
  const minutes = picks.reduce((a, i) => a + i.durationMinutes, 0) + TRAVEL_BUFFER * picks.length;
  const loved = prefs.find((p) => p.who === "both" && p.sentiment === "love" && p.tags.some((t) => picks.some((i) => i.tags.includes(t))));
  return {
    window,
    ideas: picks,
    minutes,
    reason: loved
      ? `${loved.label.toLowerCase()} — you both love that. Fits in ${duration(window.minutes)}.`
      : `fits in ${duration(window.minutes)}.`,
  };
}
