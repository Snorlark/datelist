# datelist — notes for Claude

A private date-planning app for Lark + Sophia. Next.js 15 (App Router), React 19, TypeScript, Tailwind v4. Runs on mock data with no env vars (`lib/data/mock.ts`, "today" fixed to 2026-10-05).

```bash
npm run dev        # http://localhost:3000
npm test           # node --test: arc layout, tilt, month grid, date guard
npm run typecheck
npm run build
```

The user usually has `next dev` running on :3000 in this folder. **Never run `next build` here while it runs**: it overwrites `.next` and breaks their dev server. Build a copy elsewhere to verify.

Design spec: `docs/superpowers/specs/2026-10-05-datelist-redesign-design.md`.

## Product rules (keep it simple)

- **Pages:** Plans (`/`, the dashboard), Calendar (`/calendar`), Ideas (`/ideas`), Memories (`/memories`), plus `/plans/new` and `/plans/[id]`. Don't add pages without asking. Nav items live in `TABS` (`components/shell/NavLinks.tsx`), shared by the sidebar and the phone tab bar.
- **Calendar:** month grid (Monday first, `lib/calendar/month.ts`) with lime plan chips, matcha "both free" chips and tiny memory prints. Clicking a day shows Lark/Sophia lanes (`DayLanes`) and "Plan it" for each free window. Free times exist only for the synced range (14 days from today).
- **The dashboard shows plans first:** hero (balloon title + "N plans coming up" + `NextTicket` + Plan a date + jump chips), Coming up (polaroid arc + table), When you're both free, Someday list, Lately. New things go below the plans.
- **One primary action per screen:** a black pill (`pill` in `components/ui/Pill.tsx`). Secondary actions use `softPill`.
- **Flow:** idea → plan → memory. "Plan this" → `/plans/new?idea=`, "Save as a memory" → `/memories?from=`, free windows → `/plans/new?day=&start=&idea=`.
- Copy is plain, sentence case, and says what happens. No all-caps labels, no `→` on buttons.

## Direction: a scrapbook stuck on a clean Notion page

The **structure** is Notion: white page, left sidebar, calm blocks, wide spacing. The **cute** lives in the stickers: polaroids, washi tape, typewriter date notes, the two pets, the balloon title. Keep the page quiet so the stickers can be loud.

### Layout
- `lg` (1024px) and up: fixed 248px `Sidebar` (`components/shell/`) + main column with `lg:pl-[248px]`. Below `lg`: no sidebar, floating `TabBar` at the bottom.
- Content uses the `content` utility: max 1100px, 20px gutters on phones, 56–72px on desktop. Never stretch a phone layout on desktop and never cause horizontal scroll (check 390px and 1440px).
- Every page starts with `PageCover` (breadcrumb + cover band + scalloped edge + a pet sitting on it). Inner pages use `PageHeader`, which includes it.

### Themes
Five themes: Matcha (default), Sakura, Sunday sky, Butter, Night. Each is a `[data-theme="…"]` block in `app/globals.css` that re-points the same tokens; `lib/themes.ts` lists them for `ThemePicker` (sidebar bottom on desktop, cover bar on phones). The pick is stored in `localStorage` (`datelist-theme`) and applied before paint by `THEME_BOOT` in `<head>`.
- **Never hard-code colours** in components: use tokens, or the theme can't follow. Text on `bg-ink` is `text-page`; text on `bg-lime` is `text-onlime`; photo paper is `bg-print`.
- Polaroid captions stay dark (`#2b2b28`) on every theme because prints are always light paper.

### Tokens (`app/globals.css` → `@theme`, Matcha values)

| token | hex | use |
|---|---|---|
| `page` / `card` / `sage` | #FBFBF9 / #FFF / #F3F4EE | background / blocks / sidebar, soft fills, hover rows |
| `ink` / `muted` / `faint` / `line` | #1C1C1A / #8E8E86 / #BDBDB5 / #EBEBE5 | text / secondary / placeholders / borders |
| `matcha` | #CFE3A3 | cover band + scalloped dividers |
| `coral` | #E06A5F | paw prints, date notes, month stamps |
| `lime` | #DCF26B | `highlight` marker (one key line per page), countdown chips |
| `tape` | #ECE5C4 | washi tape |
| `lark` / `sophia` | #2FB86E / #E84FC6 | cursor tags (who saved it) |
| `violet` | #8A7CF2 | focus ring |

Type: **STIX Two Text** (`font-serif`) for titles, headings and key lines (stand-in for Sundays' Office Times Sharp). **Inter** (`font-sans`) for UI. **Courier Prime** (`font-type`) only for polaroid captions, date notes and quotes.

### Scrapbook kit
- `components/ui/Polaroid.tsx`: print + typewriter caption + `tilt`; `tape`, `note` (date annotation), `hover` (lift + straighten).
- `components/scrapbook/`: `Scallop` (wavy edge, theme-coloured via CSS masks), `PetDivider` (scallop + a pet that peeks up once, tilts its head, ducks on hover, then the section heading). One `PetDivider` per dashboard section.
- **Pets** (`components/illustrations/Pet.tsx`, stickers in `public/pets/*.webp`): **Lark is the dog, Sophia is the cat** (Animoji cut-outs — fine for this private app, don't ship them publicly). Moods: `happy` (default), `love` (saved/planned/kept — also `PetToast`), `oops` (errors, empty states), `sad` (404). Never draw new cats/dogs; use these.
- `SavedBy` cursor tags, `lib/scrapbook.ts` (`arcLayout`, `arcSpread`, `ARC_MAX` = 5 prints max; the table lists the rest).

### 3D title (balloon letters)
`components/hero/BalloonTitle.tsx` paints puffy CSS lettering first (`balloon-text` utility), then lazy-loads `BalloonScene` (three.js via `next/dynamic`, `ssr:false`) and fades it in. Each letter is its own `Text3D` (Fredoka Bold, `public/fonts/fredoka-bold.typeface.json`, regenerate with `node scripts/make-typeface.mjs`), laid out from the font's advances, with a deep rounded bevel so it looks inflated. Letters bob on their own rhythm, the word leans toward the pointer (`lib/tilt.ts`), and a tapped letter squishes and bounces. Foil colour is the theme's `--color-balloon` and follows theme changes live. It renders at 30fps only while on screen and the tab is visible. Reduced motion, no WebGL, a scene error (`SceneBoundary`) or a lost WebGL context all keep the CSS version.

### Loading and 404
- `components/shell/Splash.tsx`: first-open splash (cats + heart balloon inflating + wordmark, then the sheet lifts away). Pure CSS, server-rendered; `SPLASH_BOOT` in `<head>` shows it once per visit and never with reduced motion.
- `app/loading.tsx`: paw prints walking while a page loads.
- `app/not-found.tsx`: blank "page not found" print with a cat peeking over it.

### Motion (framer-motion; no GSAP)
Two **scroll-linked** signature moments, nothing else animates on scroll:
1. `PlanArc` — plan prints start as a stack and get dealt into the arc as the section scrolls in (scrubbed with `useScroll` + `useSpring`; scroll back and they gather up).
2. `LatelyCurve` — memory prints fan in from the corners.
Plus the pet peek on each divider. Don't add fade-up-on-scroll to sections or cards: that's the generic look we removed.

Hover: polaroids lift/straighten, table rows tint, buttons squish, sidebar pets hop and switch to their love face. Everything checks `useReducedMotion()` or the CSS reduced-motion rule (scroll-linked pieces render in their final position).

## Performance
- Pages are server components. Client components are only the interactive pieces.
- three.js loads only on `/`, lazily, after first paint.
- Fonts are self-hosted via Fontsource (latin only).

## Data
- Pages read data only through `lib/repository.ts` (Notion if configured, mock otherwise).
- Without Notion, new ideas and plans live in server memory until restart. "How was it?" memories are not saved yet.
- Free-together windows: `lib/freeTogether.ts` (mock calendars in `lib/calendar`).
