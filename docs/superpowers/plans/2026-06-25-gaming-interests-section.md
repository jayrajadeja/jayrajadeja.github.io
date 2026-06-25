# Gaming Section (+ Travel / Photography stubs) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Gaming section to `/interests` (Counter-Strike lineage card grid), plus visible "More soon." Travel and Photography stub sections.

**Architecture:** Pure data + server-rendered presentation. A new `gaming` key (note + `counterStrike[]`) and `travel`/`photography` `{note}` keys in `interests.json`, typed via `InterestsData`, rendered as new `<section>` blocks in the existing `/interests` page following established patterns (shared `<SectionHeader>`, theme tokens, Anime-style cards).

**Tech Stack:** Next.js 16 (App Router, static export), TypeScript (strict), Tailwind v4 (`@theme` tokens). No new dependencies, no client components.

**Testing note:** Per `AGENTS.md`, Vitest is logic-only; UI is verified with `npm run build` + visual check. There are no new unit tests in this plan — the typecheck/static export is the gate. Do not add UI unit tests.

**Branch:** `content/gaming-interests-section` (already created off master; the design spec commit is already on it).

---

### Task 1: Extend the data + type together

The type and JSON must change in the same commit so `tsc` (run by `npm run build`) stays green.

**Files:**
- Modify: `src/lib/types.ts` (the `InterestsData` interface, ~lines 72–76)
- Modify: `src/data/interests.json`

- [ ] **Step 1: Extend the `InterestsData` interface**

In `src/lib/types.ts`, replace the existing interface:

```ts
export interface InterestsData {
  f1: { favoriteTeam: string; favoriteDrivers: string[]; note: string };
  markets: { note: string; focus: string[] };
  sport: { note: string; play: string[] };
}
```

with:

```ts
export interface InterestsData {
  f1: { favoriteTeam: string; favoriteDrivers: string[]; note: string };
  markets: { note: string; focus: string[] };
  sport: { note: string; play: string[] };
  gaming: {
    note: string;
    counterStrike: { title: string; year: number }[];
  };
  travel: { note: string };
  photography: { note: string };
}
```

- [ ] **Step 2: Add the data to `interests.json`**

Add a trailing comma to the `sport` line and append the three new keys. The full file becomes:

```json
{
  "f1": { "favoriteTeam": "Mercedes", "favoriteDrivers": ["Lewis Hamilton", "Max Verstappen"], "note": "Team I root for: Mercedes. Drivers I rate: Hamilton and Verstappen — extreme engineering, data-driven decisions, and human limit-testing." },
  "markets": { "note": "NASDAQ names and market fundamentals — reading the mechanics underneath the price.", "focus": ["NASDAQ", "fundamentals", "crypto"] },
  "sport": { "note": "Table tennis and badminton — fast hands, faster decisions.", "play": ["Table tennis", "Badminton"] },
  "gaming": {
    "note": "Counter-Strike since 1.6 — every version Valve has shipped. Two decades of the same core loop: economy, map control, and five-on-five coordination.",
    "counterStrike": [
      { "title": "CS 1.6", "year": 2003 },
      { "title": "CS: Source", "year": 2004 },
      { "title": "CS:GO", "year": 2012 },
      { "title": "CS2", "year": 2023 }
    ]
  },
  "travel": { "note": "More soon." },
  "photography": { "note": "More soon." }
}
```

> NOTE: The `f1` line keeps `Lewis Hamilton`/`Max Verstappen` on this branch — the Russell+Verstappen reorder lives in the separate PR #20. Do not change the `f1` line here.

- [ ] **Step 3: Typecheck via build**

Run: `npm run build`
Expected: build succeeds; `/interests` listed in the prerendered routes. (At this point the new data is unused by the render — that's fine; TypeScript only verifies the JSON satisfies the type when consumed, which Task 2 adds. The build must still pass.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/data/interests.json
git commit -m "feat(interests): add gaming/travel/photography data + types"
```

---

### Task 2: Render the three sections + update copy

**Files:**
- Modify: `src/app/interests/page.tsx`

- [ ] **Step 1: Update the metadata description**

Replace the `description` in the `metadata` export (~lines 23–24):

```ts
  description:
    "Formula 1, markets, anime, sport, the shelf, and systems I've studied — the obsessions that run alongside the work.",
```

with:

```ts
  description:
    "Formula 1, markets, anime, gaming, sport, the shelf, and systems I've studied — the obsessions that run alongside the work.",
```

- [ ] **Step 2: Update the intro paragraph**

Replace the intro `<p>` text (~lines 50–51):

```tsx
          The obsessions that run alongside the work — paddock strategy, market
          mechanics, systems architecture, and the shelf.
```

with:

```tsx
          The obsessions that run alongside the work — paddock strategy, market
          mechanics, Counter-Strike, systems architecture, and the shelf.
```

- [ ] **Step 3: Insert the Gaming + Travel + Photography sections**

Insert the following **after the Sport section's closing `</section>`** (after `~line 264`) and **before** the `{/* ── 6. The shelf ... */}` comment:

```tsx
      {/* ── 5b. Gaming ───────────────────────────────────────────── */}
      <section aria-labelledby="gaming-heading" className="mb-24">
        <SectionHeader eyebrow="gaming" id="gaming-heading">
          Gaming
        </SectionHeader>

        <p className="max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant mb-8">
          {interests.gaming.note}
        </p>

        <ul
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-label="Counter-Strike versions I've played"
        >
          {interests.gaming.counterStrike.map((g) => (
            <li
              key={g.title}
              className="flex items-baseline justify-between gap-4 bg-surface-container-low rounded-lg px-6 py-5 border border-outline-variant/30 hover:border-outline-variant/70 transition-colors"
            >
              <span className="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                {g.title}
              </span>
              <span className="font-mono text-sm text-tertiary tabular-nums">
                {g.year}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 5c. Travel (provisional) ─────────────────────────────── */}
      <section aria-labelledby="travel-heading" className="mb-24">
        <SectionHeader eyebrow="travel" id="travel-heading">
          Travel
        </SectionHeader>
        <p className="font-mono text-sm uppercase tracking-[0.15em] text-outline">
          {interests.travel.note}
        </p>
      </section>

      {/* ── 5d. Photography (provisional) ────────────────────────── */}
      <section aria-labelledby="photography-heading" className="mb-24">
        <SectionHeader eyebrow="photography" id="photography-heading">
          Photography
        </SectionHeader>
        <p className="font-mono text-sm uppercase tracking-[0.15em] text-outline">
          {interests.photography.note}
        </p>
      </section>
```

- [ ] **Step 4: Build to verify static export + typecheck**

Run: `npm run build`
Expected: build succeeds; `/interests` prerenders without error.

- [ ] **Step 5: Visual + honesty check**

Run `npm run dev`, open `http://localhost:3000/interests`. Confirm: Gaming cards (CS 1.6/Source/CS:GO/CS2 with years) render in a 2-col grid below Sport; Travel and Photography show "More soon." Re-read against `docs/knowledge/profile.md` honesty rules — no fabricated claims, provisional content honestly labeled.

- [ ] **Step 6: Commit**

```bash
git add src/app/interests/page.tsx
git commit -m "feat(interests): render gaming section + travel/photography stubs"
```

---

## Self-Review

**Spec coverage:**
- Gaming section, CS card grid, years → Task 2 Step 3. ✔
- Approved note copy → Task 1 Step 2 (`gaming.note`). ✔
- Travel/Photography visible "More soon." stubs → Task 2 Step 3. ✔
- Placement after Sport, before The Shelf → Task 2 Step 3. ✔
- Data + `InterestsData` type → Task 1. ✔
- metadata.description + intro mention gaming → Task 2 Steps 1–2. ✔
- Honesty review → Task 2 Step 5. ✔

**Placeholder scan:** "More soon." is intentional product copy, not a plan placeholder. No TBDs/TODOs in steps.

**Type consistency:** `gaming.counterStrike[]` items use `{ title, year }` in the type (Task 1 Step 1), the JSON (Task 1 Step 2), and the render `g.title`/`g.year` (Task 2 Step 3). `travel`/`photography` use `{ note }` consistently. ✔

---

## Done criteria

- `npm run build` passes; `/interests` prerenders.
- Gaming section renders the four CS cards; Travel/Photography show provisional notes.
- New PR opened from `content/gaming-interests-section`.
