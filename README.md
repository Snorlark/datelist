# datelist ♡

A private little world for Lark + Sophia — the things we keep saying we'll do, when we're both free, the dates we plan, and what we remember afterwards.

```
IDEA → SAVED → PLANNED → DATE → MEMORY
```

## Run it

```bash
npm install
cp .env.example .env.local   # optional — runs on mock data without it
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` for production. `npm run typecheck` for types, `npm test` for the layout math.

Everything works with no environment variables: mock data for ideas, dates, memories, both calendars and places, with "today" fixed to **Oct 5, 2026** (`lib/data/mock.ts → TODAY`) so the prototype tells a coherent story. Change `TODAY` (or swap it for the real date) once calendars are live.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · framer-motion · three.js (React Three Fiber + drei, lazy-loaded for the title only) · Notion SDK · Lucide. Fonts are self-hosted via Fontsource (STIX Two Text, Inter, Courier Prime).

## Where things live

```
app/                    / (Plans dashboard)  ideas  memories  plans/new  plans/[id]
app/api/                extract (link → idea), ideas, dates, availability
components/
  shell/                Sidebar, NavLinks, PageCover (Notion-style frame)
  hero/                 ChromeTitle + ChromeScene (3D chrome title)
  scrapbook/            Scallop, Paws, CatDivider
  ui/                   Polaroid, SavedBy, Sheet, PageHeader, TabBar, Pill
  plans/ ideas/ memories/
  illustrations/        cats + painted photo placeholders
scripts/make-typeface.mjs  font → three.js typeface JSON
lib/
  repository.ts         THE data entry point for pages (Notion if configured, else mock)
  scrapbook.ts tilt.ts  pure layout math, unit tested
  notion/ calendar/ weather/ recommend.ts freeTogether.ts extract.ts
types/index.ts          domain model
```

## Design system

See `CLAUDE.md`: a scrapbook stuck on a clean Notion page. Sidebar + wide page on desktop, tabs on phones; matcha scalloped dividers with peeking cats; polaroids with tape and typewriter date notes; a 3D chrome title that follows the cursor.

## Connecting Notion

Create an integration at notion.so/my-integrations, share the databases with it, and set `NOTION_TOKEN` plus the database IDs. Property names the mappers expect (`lib/notion/mappers.ts`):

**Ideas** (`NOTION_IDEAS_DB`): `Name` (title), `Description` (text), `Image` (files), `Scene` (select: dinner, beach, pottery, cinema, cafe, sunset, market, park), `Area` (text), `Lat` / `Lng` (number), `Category` (select: food, cafe, trip, activity, movie, event, place), `Cuisine` (text), `Rating` (number), `Price` (number 1–4), `URL` (url), `Source` (select: instagram, tiktok, maps, website, friend), `Notes` (text), `Duration (min)` (number), `Best time` (select: morning, afternoon, evening, any), `Tags` (multi-select), `Saved by` (select: lark, sophia), `Saved at` (date), `Status` (select: saved, planned, done), `Saying` (text).

**Memories** (`NOTION_MEMORIES_DB`): `Name` (title), `Date` (date), `Date ID` (text), `Place` / `Area` (text), `Photos` (files), `Scene` (select), `Rating` (number), `Favorite moment` (text), `Notes` (text).

If Notion errors, pages log it and fall back to mock data rather than breaking. Dates are still mock-backed (`getDates` in `lib/repository.ts`); a `NOTION_DATES_DB` slot is ready for the same treatment.

## Not real yet

- **Calendars** — `lib/calendar/index.ts` returns mock events. Google/Apple OAuth goes here; private events are already masked to "Busy".
- **Link extraction** — `lib/extract.ts` recognises the source and returns believable details. Swap in an unfurl/Places lookup; keep the `ExtractedLink` shape.
- **Saving** — `/api/ideas` writes to Notion when configured; otherwise new ideas and plans live in server memory until restart. "How was it?" doesn't persist yet.
- **Photos** — every image slot accepts a real `src` (next/image; Unsplash and Notion file hosts are allow-listed). Until then the painted plates in `components/illustrations/PhotoPlate.tsx` stand in.
