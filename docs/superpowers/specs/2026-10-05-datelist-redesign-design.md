# datelist redesign: scrapbook on a clean Notion page

Date: 2026-10-05 · Status: approved direction, awaiting spec review

## Goal

Rename the app to **datelist** and redesign it so that on desktop it feels like a Notion dashboard (sidebar + wide page, generous white space) with a cute scrapbook layer (Sundays-style polaroids, date annotations, Lark & Sophia cats, scalloped cat dividers, a 3D chrome title that follows the cursor). The page structure stays quiet; the cuteness lives in the "stickers". Phones keep a good mobile layout.

Features do not change: plans first, both-free suggestions, someday ideas (save a link), memories (how was it?). Data layer (`lib/`) is untouched except renames.

## Decisions (from the user)

- Name: **datelist** everywhere (package, metadata, wordmark, CLAUDE.md, README). The folder on disk stays `someday` until the user renames it.
- Layout: **Notion page** — left sidebar + wide main page. Sidebar becomes bottom tabs below `lg`.
- 3D title: **real three.js chrome**, lazy-loaded, cursor-following.
- Motion library: **framer-motion** (already installed). No GSAP.

## Visual system

| token | value | use |
|---|---|---|
| `page` | #FBFBF9 | background |
| `card` | #FFFFFF | blocks, table, cards |
| `sage` | #F3F4EE | sidebar, soft fills, hover rows |
| `ink` | #1C1C1A | text, primary pill |
| `muted` / `faint` / `line` | #8E8E86 / #BDBDB5 / #EBEBE5 | secondary text / placeholders / borders |
| `matcha` | #CFE3A3 | cover band, scalloped dividers |
| `coral` | #E06A5F | paw prints, date stamps |
| `lime` | #DCF26B | highlighter behind one key line per page; countdown chips |
| `lark` / `sophia` / `violet` | #2FB86E / #E84FC6 / #8A7CF2 | cursor tags; focus ring |

Type (all self-hosted via Fontsource, latin only):
- **STIX Two Text** (400, 400 italic, 600) — page titles, section headings, key sentences. Stands in for Sundays' Office Times Sharp.
- **Inter** (400, 500, 600) — all UI.
- **Courier Prime** (400) — polaroid captions and date annotations only.
- Instrument Serif, Hanken Grotesk are removed.

Scrapbook kit:
- `Polaroid`: white border, Courier caption, tilt; optional `tape` (translucent washi strip) and `note` (date annotation, e.g. `sat · oct 17 ♡`, Courier, slightly rotated, beside or under the print).
- `SavedBy` cursor tags (kept).
- `Cat` (restored from backup `components/illustrations/Cats.tsx`, Lark brown + green scarf, Sophia cream + yellow bow), ink colour updated to `ink`.
- `CatDivider`: full-width scalloped matcha edge (SVG), a cat peeking over it, paw-print trail around the next section heading.

## Layout

App frame (`app/layout.tsx`):
- `lg+`: fixed sidebar 248px on `sage`; main column scrolls, content max-width ~1100px, side padding 56–72px.
- `< lg`: no sidebar; floating bottom tab bar (current one, restyled); content padding 20px.

Sidebar (`components/shell/Sidebar.tsx`): small flat chrome "datelist" wordmark; nav Plans / Ideas / Memories with icons and Notion-style hover; black "+ Plan a date"; "Both free" mini list (next 3 windows linking to `/plans/new?...`); the two cats sitting at the bottom (blink loop, wave on hover).

Plans dashboard (`/`):
1. Cover: matcha scalloped band, cat peeking over the edge.
2. Hero: 3D chrome **datelist** (three.js) + lime-highlighted line "3 plans coming up. The next one is in 6 days." + black "Plan a date" pill (kept on all sizes; it is the page's primary action).
3. Coming up: polaroid arc of upcoming plans (Sundays image 2), each with tape + date note, link to plan. Below it a Notion-style table: Date · Plan · Place · Time · Status chip; rows link to the plan.
4. CatDivider → When you're both free: 3 cards in a row (stacked on phone), each with "Plan it".
5. CatDivider → Someday list: gallery, 4 cols desktop / 2 cols phone, with cursor tags; "All ideas" link.
6. CatDivider → Lately: one centred serif line ("4 dates we actually went on") with memory polaroids curving in from the corners (Sundays image 3); phone: simple fan.

Other pages share the frame: small cover strip + page title.
- Ideas: filter chips + gallery (4/3/2 cols) + detail sheet (centred modal on desktop, bottom sheet on phone) + Save a link.
- Memories: grouped by month, polaroid scrapbook grid with date stamps; "How was it?" block when `?from=`.
- Plan detail: Notion properties list (Date, Time, Place, Weather, Budget) + links + schedule + checklist + "Save as a memory".
- Plan a date: same form, two-column on desktop (form left, live polaroid preview right).

## Motion (framer-motion, all respect `prefers-reduced-motion`)

- 3D title: `@react-three/fiber` + `drei` `Text3D` with a typeface JSON generated from STIX Two Text Bold Italic (committed to `public/fonts/`), heavy bevel for a balloon look, chrome via `MeshPhysicalMaterial` (metalness 1, low roughness) + drei `Environment` preset. Rotation eases toward the pointer (max ~18° yaw, ~10° pitch), springs back on leave. Loaded with `next/dynamic` (`ssr:false`) after first paint; a flat CSS chrome wordmark shows until it loads, on reduced motion, and if WebGL is unavailable. Canvas pauses rendering when off-screen (`frameloop="demand"` + IntersectionObserver).
- CatDivider: on scroll into view, the cat pops up from behind the edge (spring), paw prints stamp in left-to-right (stagger 80ms). Hover: cat ducks and pops back.
- Hover: polaroids lift, straighten to 0°, shadow deepens; table rows tint `sage`; buttons scale 0.97 on press; cursor tags wiggle.
- Load: the Coming up polaroids drop into the arc once (stagger).

## Dependencies

- Re-add `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` (removed in the last pass).
- Add `@fontsource/stix-two-text`, `@fontsource/inter`, `@fontsource/courier-prime`; remove `@fontsource/instrument-serif`, `@fontsource/hanken-grotesk`.
- Dev-only `opentype.js` to generate the typeface JSON once (script in `scripts/`).

## Performance

- three.js only loads on the dashboard, client-side, after paint. Other pages ship no 3D code.
- Fonts: 7 latin woff2 files total.
- Pages remain server components; client components are only the interactive pieces.

## Out of scope

- Real persistence, calendars, photos (unchanged).
- Dark mode.
- Renaming the folder on disk.

## Testing

- `npm run typecheck` and `npm run build` pass.
- Screenshots at 1440×900 and iPhone 13 for `/`, `/ideas`, `/ideas?open=…`, `/memories?from=…`, `/plans/our-saturday`, `/plans/new`; no horizontal scroll at either width.
- Manually check: 3D title rotates with the pointer, fallback shows with reduced motion, dividers animate once on scroll.
