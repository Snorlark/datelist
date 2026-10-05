import "server-only";
import { cache } from "react";
import type { DateIdea, Memory, PlannedDate } from "@/types";
import * as mock from "@/lib/data/mock";
import { createNotionIdea, getNotionIdeas, getNotionMemories, isNotionConfigured } from "@/lib/notion";

/**
 * The one place pages get data from. Notion when configured, mock otherwise —
 * components only ever see typed objects. Without Notion, new ideas and plans
 * live in server memory until the next restart.
 */
export const getIdeas = cache(async (): Promise<DateIdea[]> => {
  if (!isNotionConfigured("ideas")) return mock.ideas;
  try {
    return await getNotionIdeas();
  } catch (err) {
    console.error("[someday] Notion ideas failed, using mock data", err);
    return mock.ideas;
  }
});

export async function saveIdea(idea: Omit<DateIdea, "id">): Promise<DateIdea> {
  if (isNotionConfigured("ideas")) return createNotionIdea(idea);
  const saved = { ...idea, id: `local-${Date.now()}` };
  mock.ideas.unshift(saved);
  return saved;
}

export const getMemories = cache(async (): Promise<Memory[]> => {
  if (!isNotionConfigured("memories")) return [...mock.memories].sort((a, b) => b.date.localeCompare(a.date));
  try {
    return await getNotionMemories();
  } catch (err) {
    console.error("[someday] Notion memories failed, using mock data", err);
    return mock.memories;
  }
});

export const getDates = cache(async (): Promise<PlannedDate[]> => mock.dates);
export const getDate = async (id: string) => (await getDates()).find((d) => d.id === id);

/** Planned dates from today on, soonest first. */
export const getUpcomingDates = cache(async () =>
  (await getDates())
    .filter((d) => d.status === "planned" && d.date >= mock.TODAY)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)),
);

export async function savePlan(input: Pick<PlannedDate, "title" | "date" | "startTime" | "endTime" | "ideaIds" | "agenda" | "notes">): Promise<PlannedDate> {
  const ideas = await getIdeas();
  const first = ideas.find((i) => i.id === input.ideaIds[0]);
  const plan: PlannedDate = {
    ...input,
    id: `plan-${Date.now()}`,
    location: first?.location ?? { name: "Somewhere new", area: mock.couple.homeCity, lat: 14.5547, lng: 121.0244 },
    scene: first?.scene ?? "sunset",
    image: first?.image,
    links: first?.url ? { website: first.url } : {},
    attachments: [],
    reminders: [],
    status: "planned",
  };
  mock.dates.push(plan);
  for (const i of ideas) if (input.ideaIds.includes(i.id)) i.status = "planned";
  return plan;
}

export const getPreferences = async () => mock.preferences;
export const today = () => mock.TODAY;
