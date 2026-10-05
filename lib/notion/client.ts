import "server-only";
import { Client } from "@notionhq/client";

/**
 * Single Notion client for the server. Secrets come from env and never reach
 * the browser — every import of this file is server-only.
 */
let client: Client | null = null;

export const notionDatabases = {
  ideas: process.env.NOTION_IDEAS_DB,
  dates: process.env.NOTION_DATES_DB,
  memories: process.env.NOTION_MEMORIES_DB,
};

export function isNotionConfigured(db: keyof typeof notionDatabases = "ideas") {
  return Boolean(process.env.NOTION_TOKEN && notionDatabases[db]);
}

export function notion() {
  if (!process.env.NOTION_TOKEN) throw new Error("NOTION_TOKEN is not set");
  client ??= new Client({ auth: process.env.NOTION_TOKEN });
  return client;
}
