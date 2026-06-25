# Gaming section (+ Travel / Photography stubs) on `/interests` — Design

**Date:** 2026-06-25
**Status:** Approved (pending spec review)

## Goal

Add a new **Gaming** section to `/interests`, led by Counter-Strike, plus two
lightweight **Travel** and **Photography** stub sections that establish the IA
now and get fleshed out in a later pass.

The honest, distinctive angle for Gaming: Jayraj has played **every era of
Counter-Strike** — 1.6 → Source → CS:GO → CS2 — roughly two decades following
one game's evolution. The lineage is the story; no rank, hours, or competitive
stats are claimed (nothing to fabricate or defend).

## Placement

Three new `<section>` blocks inserted into `src/app/interests/page.tsx` **after
Sport (section 5), before The Shelf** — keeping leisure interests grouped and
the intellectual sections (shelf, systems) at the end. Order: Gaming → Travel →
Photography.

## Components & rendering

Server-rendered only (no new client islands). Reuse existing primitives and
theme tokens — **no hardcoded hex**.

- **Section headers:** shared `<SectionHeader eyebrow=… id=…>`.
- **Gaming:** a short note (`font-body`, `text-on-surface-variant`), then a
  responsive card grid — `grid-cols-1 md:grid-cols-2 gap-…`, cards styled like
  the Anime section (`bg-surface-container-low rounded-lg border
  border-outline-variant/…`). One card per CS version, in release order:

  | Card | Year |
  |------|------|
  | CS 1.6 | 2003 |
  | CS: Source | 2004 |
  | CS:GO | 2012 |
  | CS2 | 2023 |

  Each card: title in `font-headline` (`text-on-surface`), year in `font-mono`
  `text-tertiary` (the "data" color). Years are real public release dates.

  Approved note copy:
  > "Counter-Strike since 1.6 — every version Valve has shipped. Two decades of
  > the same core loop: economy, map control, and five-on-five coordination."

- **Travel & Photography:** each is a `<SectionHeader>` + a one-line note
  flagged provisional (same spirit as `/uses`), e.g. "More soon." Visible in the
  IA, making no empty claim.

## Data model

Extend `src/data/interests.json`:

```jsonc
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
```

Extend `InterestsData` in `src/lib/types.ts` to match:

```ts
gaming: {
  note: string;
  counterStrike: { title: string; year: number }[];
};
travel: { note: string };
photography: { note: string };
```

## Copy / metadata

- Update the page `metadata.description` and the intro line to mention gaming
  alongside the existing interests.

## Honesty review (per `profile.md` / AGENTS.md)

- All content real and interview-defensible: CS lineage is true; release years
  are public facts; no rank/stats claimed.
- Travel/Photography labeled provisional ("More soon."), not presented as
  finished.
- Company-agnostic; no fabricated claims.

## Verification

- `npm run build` — static export for `/interests` must succeed.
- Visual check (desktop + mobile card grid).
- Re-read section against the honesty rules before commit.

## Out of scope (later pass)

- Real Travel and Photography content.
- Other games beyond Counter-Strike (none named yet).
