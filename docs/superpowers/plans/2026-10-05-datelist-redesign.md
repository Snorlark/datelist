# datelist Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the app to datelist and rebuild the UI as a Notion-style page (sidebar + wide page) with a scrapbook layer: polaroids with tape and date notes, cats, scalloped cat dividers, and a cursor-following 3D chrome title.

**Architecture:** App frame in `app/layout.tsx` renders a `Sidebar` (lg+) or `TabBar` (<lg) around the page. Pure layout math (polaroid arc, pointer → rotation) lives in dependency-free `lib/scrapbook.ts` and `lib/tilt.ts` with `node --test` unit tests. The 3D title is a lazily loaded client component (`next/dynamic`, `ssr:false`) over a CSS chrome fallback. Data layer (`lib/repository.ts` etc.) is unchanged.

**Tech Stack:** Next.js 15, React 19, Tailwind v4, framer-motion 12, three + @react-three/fiber + @react-three/drei, Fontsource (STIX Two Text, Inter, Courier Prime).

**Spec:** `docs/superpowers/specs/2026-10-05-datelist-redesign-design.md`

## Global Constraints

- Name is `datelist` everywhere (package.json `name`, metadata title, wordmark, CLAUDE.md, README). Folder on disk is not renamed.
- Colors: page #FBFBF9, card #FFFFFF, sage #F3F4EE, ink #1C1C1A, muted #8E8E86, faint #BDBDB5, line #EBEBE5, matcha #CFE3A3, coral #E06A5F, lime #DCF26B, lark #2FB86E, sophia #E84FC6, violet #8A7CF2.
- Fonts: STIX Two Text (headings/key lines), Inter (UI), Courier Prime (captions/date notes only). Instrument Serif and Hanken Grotesk removed.
- Sidebar 248px at `lg` (1024px) and up; bottom TabBar below `lg`. Main content max-width 1100px, horizontal padding 56–72px on lg+, 20px on phones.
- three.js code only loads on `/`, client-side, after paint. Flat CSS chrome fallback on reduced motion / no WebGL / while loading.
- All motion respects `prefers-reduced-motion`. No GSAP.
- No horizontal page scroll at 390px or 1440px.
- Copy: sentence case, no all-caps labels, no `→` on buttons.

## Review Focus

- Pointer far outside the title (or leaving the window) → the title springs back to rest instead of sticking at max tilt. Pinned by `tilt` clamp test in Task 4.
- Zero upcoming plans → dashboard shows the empty line and no empty arc/table. Pinned by `arcLayout(0)` returning `[]` in Task 3 and the empty branch in Task 5.
- One or many (7+) polaroids in an arc → stays within width, no overlap explosion. Pinned by `arcLayout` bounds test in Task 3.
- Reduced motion → no cursor rotation, no pop-ups; fallback wordmark shown. Checked in Task 8 by emulating `prefers-reduced-motion`.
- Detail sheet on desktop → centred modal with Escape/outside click to close; focus returns. Checked in Task 6 screenshot.

---

### Task 1: Rename, fonts and tokens

**Files:**
- Modify: `package.json` (name, deps)
- Modify: `app/layout.tsx` (font imports, metadata)
- Modify: `app/globals.css` (tokens, utilities)

**Interfaces:**
- Produces Tailwind tokens: `bg-page bg-card bg-sage text-ink text-muted text-faint border-line bg-matcha text-coral bg-lime bg-lark bg-sophia`, fonts `font-serif font-sans font-type`, utilities `content` (page container), `chrome`, `highlight` (lime marker behind text), `no-scrollbar`.

- [ ] Step 1: `npm i @fontsource/stix-two-text @fontsource/inter @fontsource/courier-prime three @react-three/fiber @react-three/drei && npm i -D @types/three opentype.js && npm uninstall @fontsource/instrument-serif @fontsource/hanken-grotesk`; set `"name": "datelist"`.
- [ ] Step 2: In `app/layout.tsx` import `@fontsource/stix-two-text/latin-{400,400-italic,600}.css`, `@fontsource/inter/latin-{400,500,600}.css`, `@fontsource/courier-prime/latin-400.css`; metadata `title: { default: "datelist", template: "%s · datelist" }`.
- [ ] Step 3: Rewrite `@theme` with the Global Constraints colors and:
```css
--font-serif: "STIX Two Text", "Times New Roman", serif;
--font-sans: "Inter", -apple-system, system-ui, sans-serif;
--font-type: "Courier Prime", "Courier New", monospace;
```
Add utilities:
```css
@utility content { width: 100%; max-width: 1100px; margin-inline: auto; padding-inline: 1.25rem;
  @media (min-width: 64rem) { padding-inline: clamp(3.5rem, 5vw, 4.5rem); } }
@utility highlight { background: var(--color-lime); box-decoration-break: clone; -webkit-box-decoration-break: clone; padding: 0 .15em; }
```
- [ ] Step 4: `npx tsc --noEmit` → passes (pages may still reference old `column` utility; keep `column` until Task 5 replaces it).

### Task 2: App frame — Sidebar, TabBar, cats

**Files:**
- Create: `components/illustrations/Cats.tsx` (restored from `~/Downloads/someday-backup-before-redesign.tar.gz`, INK → `#1C1C1A`)
- Create: `components/shell/Sidebar.tsx` (server) and `components/shell/SidebarCats.tsx` (client, hover wave)
- Create: `components/shell/NavLinks.tsx` (client, active state via `usePathname`)
- Modify: `components/ui/TabBar.tsx` (`lg:hidden`)
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `getFreeTogether()` from `lib/freeTogether.ts` → `{ suggestions: Suggestion[] }`.
- Produces: `<Cat who pose size flip />` (`who: "lark"|"sophia"`, `pose: "stand"|"sit"|"wave"|"camera"`); layout renders `<Sidebar />` as `hidden lg:flex fixed inset-y-0 left-0 w-[248px]` and main as `lg:pl-[248px]`.

- [ ] Step 1: `tar -xzOf ~/Downloads/someday-backup-before-redesign.tar.gz someday/components/illustrations/Cats.tsx > components/illustrations/Cats.tsx`; replace `#40352C` with `#1C1C1A`.
- [ ] Step 2: Sidebar: flat chrome "datelist" (`font-serif italic chrome text-[1.75rem]`), `NavLinks` (Plans `/`, Ideas `/ideas`, Memories `/memories`, Notion-style `rounded-md px-2 py-1.5 hover:bg-black/[.04]`, active `bg-black/[.05] font-medium`), black `+ Plan a date` pill, "Both free" list (first 3 suggestions → `/plans/new?day&start&idea`), `SidebarCats` pinned at bottom.
- [ ] Step 3: `SidebarCats`: two `Cat pose="sit"` side by side; framer `whileHover={{ rotate: [0,-8,6,0] }}` on each; reduced motion → no animation.
- [ ] Step 4: Layout: `<Sidebar/>` + `<main className="pb-28 lg:pb-0 lg:pl-[248px]">` + `<TabBar/>` (TabBar gets `lg:hidden`).
- [ ] Step 5: `npm run build` passes.

### Task 3: Scrapbook kit — arc layout, Polaroid, CatDivider

**Files:**
- Create: `lib/scrapbook.ts`, `lib/scrapbook.test.ts`
- Modify: `components/ui/Polaroid.tsx` (tape, note, hover lift via framer)
- Create: `components/scrapbook/CatDivider.tsx`, `components/scrapbook/Scallop.tsx`, `components/scrapbook/Paws.tsx`

**Interfaces:**
- Produces: `arcLayout(n: number, opts?: { spread?: number; lift?: number }): { x: number; y: number; rotate: number }[]` — x in % of container centre (−50..50), y in px drop from the top of the arc, rotate in degrees.
- Produces: `<Polaroid scene src alt caption tilt aspect sizes priority tape? note? hover? className />`; `<CatDivider who="lark"|"sophia" title={string} sub? id />` renders scallop + peeking cat + heading with paws.

- [ ] Step 1: Write failing test `lib/scrapbook.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { arcLayout } from "./scrapbook.ts";

test("no items, no positions", () => assert.deepEqual(arcLayout(0), []));
test("one item sits centred and straight-ish", () => {
  const [p] = arcLayout(1);
  assert.equal(p.x, 0);
  assert.ok(Math.abs(p.rotate) <= 4);
});
test("items stay inside the container and fan symmetrically", () => {
  for (const n of [2, 3, 5, 9]) {
    const ps = arcLayout(n);
    assert.equal(ps.length, n);
    for (const p of ps) assert.ok(p.x >= -42 && p.x <= 42, `x ${p.x}`);
    assert.equal(Math.round(ps[0].x), -Math.round(ps[n - 1].x));
    assert.ok(ps[0].rotate < 0 && ps[n - 1].rotate > 0);
  }
});
```
- [ ] Step 2: `node --test lib/scrapbook.test.ts` → FAIL (module not found).
- [ ] Step 3: Implement:
```ts
/** Positions for prints laid along a gentle arc, like the Sundays strip. */
export function arcLayout(n: number, { spread = 84, lift = 36 }: { spread?: number; lift?: number } = {}) {
  if (n <= 0) return [];
  if (n === 1) return [{ x: 0, y: 0, rotate: -2 }];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1) - 0.5; // -0.5..0.5
    const jitter = i % 2 ? 1.5 : -1.5;
    return { x: t * spread, y: Math.round(lift * 4 * t * t), rotate: Math.round((t * 16 + jitter) * 10) / 10 };
  });
}
```
- [ ] Step 4: `node --test lib/scrapbook.test.ts` → PASS.
- [ ] Step 5: Polaroid: wrap in `motion.figure`; `whileHover={{ rotate: 0, y: -6, boxShadow: "0 24px 40px -18px rgb(0 0 0/.35)" }}` when `hover`; `tape` renders `<span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[#EDE7C9]/70 mix-blend-multiply" />`; `note` renders `<span className="absolute -bottom-7 right-1 rotate-[-3deg] font-type text-[0.8125rem] text-coral">{note}</span>`. Use `useReducedMotion()` to disable hover motion.
- [ ] Step 6: Scallop: full-width SVG `viewBox="0 0 1200 24" preserveAspectRatio="none"` repeating semicircles, filled `matcha`, stroke ink 1.25. CatDivider: `<section>` with Scallop on top; a `Cat` absolutely positioned at `left-[12%]` that animates `y: 40 → 0` via `whileInView` (spring, once) and `whileHover={{ y: 14 }}`; heading `font-serif text-[2rem]` flanked by `<Paws/>` (4 coral paw SVGs, stagger 0.08s fade+scale on view).
- [ ] Step 7: `npx tsc --noEmit` passes.

### Task 4: 3D chrome title

**Files:**
- Create: `scripts/make-typeface.mjs` (one-off; output `public/fonts/stix-bold-italic.typeface.json`)
- Create: `lib/tilt.ts`, `lib/tilt.test.ts`
- Create: `components/hero/ChromeTitle.tsx` (client wrapper: fallback + dynamic import), `components/hero/ChromeScene.tsx` (three)

**Interfaces:**
- Produces: `tiltFromPointer(px: number, py: number, rect: {left:number;top:number;width:number;height:number}, max?: {yaw:number;pitch:number}): { yaw: number; pitch: number }` in radians, clamped.
- Produces: `<ChromeTitle text="datelist" />`.

- [ ] Step 1: Failing test `lib/tilt.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { tiltFromPointer } from "./tilt.ts";
const r = { left: 0, top: 0, width: 200, height: 100 };
test("centre is rest", () => assert.deepEqual(tiltFromPointer(100, 50, r), { yaw: 0, pitch: 0 }));
test("right edge turns right, top edge tips up", () => {
  const t = tiltFromPointer(200, 0, r);
  assert.ok(t.yaw > 0 && t.pitch < 0);
});
test("far outside is clamped to max", () => {
  const t = tiltFromPointer(99999, -99999, r, { yaw: 0.3, pitch: 0.2 });
  assert.equal(t.yaw, 0.3);
  assert.equal(t.pitch, -0.2);
});
```
- [ ] Step 2: Run → FAIL. Step 3: implement:
```ts
const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
export function tiltFromPointer(px: number, py: number, rect: { left: number; top: number; width: number; height: number }, max = { yaw: 0.32, pitch: 0.18 }) {
  const nx = (px - rect.left - rect.width / 2) / (rect.width / 2);
  const ny = (py - rect.top - rect.height / 2) / (rect.height / 2);
  return { yaw: clamp(nx * max.yaw, max.yaw) || 0, pitch: clamp(ny * max.pitch, max.pitch) || 0 };
}
```
Step 4: Run → PASS.
- [ ] Step 5: `scripts/make-typeface.mjs` reads `node_modules/@fontsource/stix-two-text/files/stix-two-text-latin-700-italic.woff` with opentype.js and writes three.js typeface JSON (glyphs for `a-z`, commands converted to `m/l/q/b` strings scaled to `resolution: 1000`). Run `node scripts/make-typeface.mjs`.
- [ ] Step 6: ChromeScene: `<Canvas dpr={[1,2]} camera={{ position:[0,0,9], fov: 32 }} gl={{ antialias:true, alpha:true }}>`; `<Environment preset="studio" />`; `<Center><Text3D font="/fonts/stix-bold-italic.typeface.json" size={1.6} height={0.45} bevelEnabled bevelSize={0.06} bevelThickness={0.12} bevelSegments={8} curveSegments={10}>datelist<meshPhysicalMaterial color="#e9e9e6" metalness={1} roughness={0.12} clearcoat={1} /></Text3D></Center>`; a group whose rotation lerps toward `tiltFromPointer(...)` each frame (window pointermove; on pointerleave target 0); `frameloop` paused when off-screen via IntersectionObserver.
- [ ] Step 7: ChromeTitle: renders `<h1 className="sr-only">datelist</h1>` + flat CSS chrome wordmark (`aria-hidden`) as placeholder; if not reduced motion and WebGL available, `dynamic(() => import("./ChromeScene"), { ssr: false })` mounts over it and fades in.
- [ ] Step 8: `npm run build` passes; `/` first-load JS unchanged except a lazy chunk.

### Task 5: Plans dashboard

**Files:**
- Modify: `app/page.tsx`
- Create: `components/plans/PlanArc.tsx` (client, polaroids on `arcLayout`), `components/plans/PlansTable.tsx`, `components/plans/FreeCards.tsx`, `components/memories/LatelyCurve.tsx`
- Delete use of: `components/plans/PlanRow.tsx` (keep file; reused on phone list)

**Interfaces:**
- Consumes: `getUpcomingDates()`, `getIdeas()`, `getMemories()`, `getFreeTogether()`, `arcLayout`, `Polaroid`, `CatDivider`, `ChromeTitle`.

- [ ] Step 1: Cover: `<div className="relative h-28 bg-matcha lg:h-36"><Scallop flip className="absolute -bottom-px" /><Cat who="sophia" pose="sit" className="absolute bottom-0 right-[14%]" /></div>`.
- [ ] Step 2: Hero (`content`, centred): `ChromeTitle`, line in `font-serif text-[1.5rem] lg:text-[1.75rem]` with `<span className="highlight">3 plans coming up.</span>` + next-in-days, black pill "Plan a date".
- [ ] Step 3: "Coming up": `PlanArc` (lg: absolute positions from `arcLayout(plans.length)` inside a `h-[22rem]` relative box; <lg: horizontal snap scroller) with `tape` on the first, `note={`${weekdayShort} · ${shortDate}`.toLowerCase() + " ♡"}`, each linking to `/plans/[id]`, drop-in stagger once. Then `PlansTable` (Notion table: header row `text-muted text-[0.8125rem]`, rows `hover:bg-sage`, columns Date/Plan/Place/Time/Status with lime chip "In N days"); on <md it renders `PlanRow`s instead.
- [ ] Step 4: `CatDivider title="When you're both free"` → `FreeCards` (`grid gap-4 md:grid-cols-3`).
- [ ] Step 5: `CatDivider title="Someday list"` → gallery `grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4` of hoverable Polaroids with `SavedBy`, "All ideas" link.
- [ ] Step 6: `CatDivider title="Lately"` → `LatelyCurve`: centred serif line `<em>{n}</em> dates we actually went on.` with up to 3 polaroids curving from the left corner and up to 3 from the right (lg absolute, rotations −18..−4 / 4..18); phone: overlapping fan.
- [ ] Step 7: Empty state: no plans → hero line "Nothing planned yet. Pick something from your ideas." and arc/table omitted.
- [ ] Step 8: `npm run build`; screenshot 1440 and iPhone; no horizontal scroll.

### Task 6: Ideas page + responsive Sheet

**Files:**
- Modify: `components/ui/Sheet.tsx` (centred modal `lg:items-center lg:max-w-[40rem] lg:rounded-[1.75rem]`)
- Modify: `components/ideas/IdeasBoard.tsx`, `components/ideas/SaveLink.tsx`, `components/ui/PageHeader.tsx`

- [ ] Step 1: PageHeader → Notion page header: small matcha cover strip with scallop (h-20), title `font-serif text-[2.75rem] lg:text-[3.25rem]`, sub, action; uses `content`.
- [ ] Step 2: IdeasBoard grid `grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10`, Polaroid `hover`, notes as `note` (date saved). Fonts/tokens updated.
- [ ] Step 3: Screenshot `/ideas` and `/ideas?open=tinycafe` at 1440 + iPhone.

### Task 7: Memories, plan detail, plan form

**Files:**
- Modify: `app/memories/page.tsx`, `components/memories/MemoryCard.tsx`, `components/memories/HowWasIt.tsx`
- Modify: `app/plans/[id]/page.tsx`, `app/plans/new/page.tsx`, `components/plans/PlanForm.tsx`

- [ ] Step 1: Memories: month heading with coral date stamp, grid `grid-cols-2 md:grid-cols-3 xl:grid-cols-4`, MemoryCard polaroid with `note={stampDate}`; HowWasIt block in `bg-sage rounded-2xl` max-w-xl.
- [ ] Step 2: Plan detail: `content` two columns on lg (`grid lg:grid-cols-[1fr_20rem] gap-12`): left = Notion property list (Date, Time, Place, Weather, Budget, Getting there as `grid-cols-[8rem_1fr]` rows with icons), links, schedule, checklist; right = taped polaroid with date note + "Save as a memory".
- [ ] Step 3: PlanForm: lg two columns, form left, sticky live preview right (taped Polaroid of first chosen idea, `note` = chosen day, title in serif); replace `column` with `content`.
- [ ] Step 4: `npm run build`; screenshots.

### Task 8: Docs and final verification

**Files:**
- Modify: `CLAUDE.md`, `README.md`

- [ ] Step 1: Rewrite CLAUDE.md design system for datelist (tokens, fonts, frame, scrapbook kit, motion rules, 3D title notes); README name + structure.
- [ ] Step 2: `node --test lib/*.test.ts && npx tsc --noEmit && npm run build` all pass.
- [ ] Step 3: Screenshots at 1440×900 and iPhone 13 for `/`, `/ideas`, `/ideas?open=tinycafe`, `/memories?from=clay-sunday`, `/plans/our-saturday`, `/plans/new`; `scrollWidth === innerWidth` on each; one run with `reducedMotion: "reduce"` showing the fallback wordmark.
