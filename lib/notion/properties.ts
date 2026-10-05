/**
 * Tiny readers/writers for Notion property values. Keeps the SDK's verbose
 * shapes out of the mappers. Expected database schemas live in README.md.
 */
type Prop = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const read = {
  title: (p?: Prop) => (p?.title ?? []).map((t: Prop) => t.plain_text).join(""),
  text: (p?: Prop) => (p?.rich_text ?? []).map((t: Prop) => t.plain_text).join("") || undefined,
  number: (p?: Prop) => (typeof p?.number === "number" ? (p.number as number) : undefined),
  select: (p?: Prop) => (p?.select?.name as string | undefined) ?? undefined,
  multi: (p?: Prop) => ((p?.multi_select ?? []) as Prop[]).map((o) => o.name as string),
  url: (p?: Prop) => (p?.url as string | undefined) ?? undefined,
  date: (p?: Prop) => (p?.date?.start as string | undefined)?.slice(0, 10),
  files: (p?: Prop) =>
    ((p?.files ?? []) as Prop[]).map((f) => (f.type === "external" ? f.external.url : f.file.url) as string),
};

export const write = {
  title: (s: string) => ({ title: [{ text: { content: s } }] }),
  text: (s?: string) => ({ rich_text: s ? [{ text: { content: s } }] : [] }),
  number: (n?: number) => ({ number: n ?? null }),
  select: (s?: string) => ({ select: s ? { name: s } : null }),
  multi: (s: string[]) => ({ multi_select: s.map((name) => ({ name })) }),
  url: (s?: string) => ({ url: s ?? null }),
  date: (s?: string) => ({ date: s ? { start: s } : null }),
};
