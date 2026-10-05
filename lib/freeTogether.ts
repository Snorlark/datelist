import "server-only";
import { getEvents } from "@/lib/calendar";
import { buildLanes } from "@/lib/calendar/lanes";
import { suggestForWindow } from "@/lib/recommend";
import { getDates, getIdeas, getPreferences, today } from "@/lib/repository";
import { addDays } from "@/lib/utils/format";
import type { Suggestion } from "@/types";

/** Everything the Free Together section needs, assembled on the server. */
export async function getFreeTogether(days = 14, minMinutes = 240) {
  const from = today();
  const [events, dates, ideas, prefs] = await Promise.all([getEvents(from, addDays(from, days)), getDates(), getIdeas(), getPreferences()]);
  const lanes = buildLanes(events, dates, from, days, 120);
  // vary the suggestions: an idea that leads one window steps back for the next
  const used = new Set<string>();
  const suggestions: Suggestion[] = [];
  for (const w of lanes.flatMap((l) => l.free.filter((f) => f.minutes >= minMinutes)).slice(0, 4)) {
    const fresh = ideas.filter((i) => !used.has(i.id));
    const s = suggestForWindow(w, fresh, prefs) ?? suggestForWindow(w, ideas, prefs);
    if (!s) continue;
    s.ideas.forEach((i) => used.add(i.id));
    suggestions.push(s);
  }
  return { lanes, suggestions };
}
