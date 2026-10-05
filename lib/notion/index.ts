import "server-only";
import type { DateIdea, Memory, NotionPage } from "@/types";
import { notion, notionDatabases } from "./client";
import { ideaToProperties, pageToIdea, pageToMemory } from "./mappers";

export { isNotionConfigured } from "./client";

async function queryAll(databaseId: string, sorts?: unknown[]): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion().databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sorts: sorts as any,
    });
    pages.push(...(res.results as unknown as NotionPage[]));
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
  } while (cursor);
  return pages;
}

export async function getNotionIdeas(): Promise<DateIdea[]> {
  const pages = await queryAll(notionDatabases.ideas!, [{ property: "Saved at", direction: "descending" }]);
  return pages.map(pageToIdea);
}

export async function createNotionIdea(idea: Omit<DateIdea, "id">): Promise<DateIdea> {
  const page = await notion().pages.create({
    parent: { database_id: notionDatabases.ideas! },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: ideaToProperties(idea) as any,
  });
  return { ...idea, id: page.id };
}

export async function getNotionMemories(): Promise<Memory[]> {
  const pages = await queryAll(notionDatabases.memories!, [{ property: "Date", direction: "descending" }]);
  return pages.map(pageToMemory);
}
