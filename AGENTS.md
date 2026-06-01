# Agent Instructions

`jayrajadeja.github.io` — Jayraj Jadeja's personal portfolio. A real, **aggregate** engineering portfolio styled as a "living data system": an editorial broadsheet body opened by a terminal hero, statically exported to GitHub Pages.

> **Read `docs/knowledge/profile.md` first.** It is the single source of truth for every fact and the honesty rules below. If content and that file disagree, that file wins.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `output: "export"` — fully static)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 — theme tokens live in `src/app/globals.css` under `@theme`. **There is no `tailwind.config.ts`** (do not create one).
- **Fonts** (via `next/font/google`): **Space Grotesk** → `font-headline` (display/UI), **Newsreader** → `font-body` (serif/editorial), **JetBrains Mono** → `font-mono` (data/terminal). Material Symbols via CDN.
- **Content:** MDX in `content/writing/` (parsed with `gray-matter` + `remark`/`remark-html`); typed JSON in `src/data/`.
- **Tests:** Vitest — **logic only** (`src/lib/`, `scripts/`). UI is verified with `npm run build` + visual check, not unit tests.

## Project Structure

```
src/
  app/
    layout.tsx          # fonts, metadata (SEO/OG/Twitter), fixed header (Navbar + TickerRail), Footer
    page.tsx            # Home — terminal hero + broadsheet (selected work, latest writing, currently, stats)
    work/page.tsx       # /work — case files + experience timeline + stack
    writing/page.tsx    # /writing — Substack hub + posts + field notes
    writing/[slug]/page.tsx  # MDX post renderer (generateStaticParams)
    interests/page.tsx  # /interests — F1, markets, anime/manga, sport, the shelf, systems studied
    about/page.tsx      # /about — bio, verified metrics, education, résumé + contact
    now/page.tsx        # /now — dated snapshot
    uses/page.tsx       # /uses — setup (provisional)
    sitemap.ts robots.ts icon.svg opengraph-image.tsx  # SEO + brand assets (each: export const dynamic = "force-static")
    globals.css         # Tailwind v4 @theme tokens + utilities (grid bg, ticker marquee, sparkline draw)
  components/
    Navbar.tsx          # CLIENT — nav + accessible mobile menu
    Footer.tsx  StatsSection.tsx  Eyebrow.tsx  SectionHeader.tsx
    instruments/        # the "instrument kit"
      TerminalBlock.tsx TickerChip.tsx TickerRail.tsx(CLIENT) Metric.tsx StatusDot.tsx Sparkline.tsx CountUp.tsx(CLIENT)
  lib/
    blog.ts             # MDX parsing — reads content/writing
    types.ts  format.ts  format.test.ts
  data/                 # work, experience, systems, books, papers, anime, interests,
                        # fieldnotes, now, uses, stats (curated metrics), markets (seed→built), f1 (seed→built)
content/writing/        # MDX posts — frontmatter: title, date, tags[], excerpt
scripts/
  parse-feeds.mjs  parse-feeds.test.mjs  fetch-data.mjs   # build-time live-data fetch (stocks + F1)
docs/
  superpowers/          # specs + phase plans (the build history)
  knowledge/            # profile.md + content-model.md + design-system.md + data-pipeline.md + voice.md
public/                 # static assets served at root (e.g. llms.txt; resume.pdf if added)
.github/workflows/deploy.yml  # build + deploy to Pages; daily fetch-data step (STOCK_API_KEY secret, non-fatal)
```

## Routes (the IA)

`/` · `/work` · `/writing` (+ `/writing/[slug]`) · `/interests` · `/about` · `/now` · `/uses`.
(There is **no** `/blog` or `/library` — they were removed; writing lives at `/writing`, the library is a section of `/interests`.)

## Key Conventions

- **Server Components by default.** The only client islands are `Navbar`, `TickerRail`, and `CountUp` (`"use client"`). Don't add client components unless genuinely needed.
- **Page offset:** every page wraps content in `pt-32 …` to clear the fixed header (Navbar + ticker rail).
- **Section headers:** use the shared `<Eyebrow>` and `<SectionHeader>` (`src/components/`). Don't redefine them inline.
- **Font roles:** `font-headline` (Space Grotesk) for display/labels, `font-body` (Newsreader) for prose, `font-mono` (JetBrains Mono) for data/metrics/terminal.
- **Theme tokens only** — use semantic classes (`text-primary`, `text-tertiary`, `text-up`, `text-on-surface-variant`, `border-outline-variant`, …). **No hardcoded hex** in components (the only exceptions live inside the kit, e.g. the terminal traffic-light dots).
- **Static-export rules:** no server APIs (`cookies()`/`headers()`/server actions/ISR); `await params` in dynamic routes; `generateStaticParams()` for `[slug]`; metadata routes (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`) need `export const dynamic = "force-static"`; all images `unoptimized`.
- **Motion:** subtle, data-driven, 150–500ms; everything respects `prefers-reduced-motion` (count-ups freeze to the final value, marquee/sparkline animations disable). See `design-system.md`.

## Content Model

Full schemas in **`docs/knowledge/content-model.md`**. In short, each `src/data/*.json` is a typed array/object (types in `src/lib/types.ts`); MDX posts use the frontmatter above. `stats.json` holds curated **aggregate** contribution metrics; `markets.json`/`f1.json` are seed snapshots replaced at build by the live-data pipeline.

## Live-Data Pipeline

Full details in **`docs/knowledge/data-pipeline.md`**. Hybrid + graceful (never breaks the build, never misrepresents):
- **Crypto** — fetched live client-side (`TickerRail`, CoinGecko, keyless) with fallback to the baked snapshot.
- **Stocks** — baked at build by `scripts/fetch-data.mjs` (Finnhub, requires the `STOCK_API_KEY` repo secret); without the key it keeps the committed snapshot.
- **F1** — baked at build (Jolpica, keyless) → `f1.json`, surfaced on `/interests`.
- The deploy workflow runs the fetch (daily cron + on push) as a `continue-on-error` step; the ticker label is **data-driven** (`illustrative` for seed, `as of <date>` once real/live). Crypto + F1 work with no setup; only live stocks need the secret.

## Adding / Editing Content

- **Writing post:** add `content/writing/<slug>.mdx` with frontmatter (`title`, `date`, `tags`, `excerpt`). It auto-lists on `/writing` and renders at `/writing/<slug>`.
- **Work case file:** append to `src/data/work.json` (`WorkCaseFile`).
- **Studied system:** append to `src/data/systems.json` (`StudiedSystem`; set `flagship: true` to feature).
- **Book / paper / anime / field note:** append to `books.json` / `papers.json` / `anime.json` / `fieldnotes.json`.
- **`/now` or `/uses`:** edit `now.json` / `uses.json`.
- Always run `npm run build` afterward to confirm static generation succeeds.

## Build, Test & Deploy

```bash
npm run dev      # local dev (http://localhost:3000)
npm run build    # static export → out/   (run after EVERY change to verify)
npm run lint     # eslint
npm test         # vitest (logic)
```
Deployed to GitHub Pages by `.github/workflows/deploy.yml` (push to `master`, daily cron, or manual). For live stock data, add a `STOCK_API_KEY` repo secret (free Finnhub key).

## ⚠️ Honesty & Disclosure Rules (hard constraints)

These are non-negotiable. **Do not fabricate, embellish, or guess.** Source every fact from `docs/knowledge/profile.md`.

- **All content must be real and interview-defensible.** No invented projects, metrics, or claims.
- **Employer (SAFE Security) disclosure:** publish only **aggregate** personal metrics + a one-line domain description. **Never** publish internal codenames, Jira issue keys, repository names, or vendor/customer names. SAFE is named **only** in `src/data/experience.json` (the work-history entry); keep the rest of the UI company-agnostic (the terminal prompt is `jayraj@engineering`, the tenure stat is "Years Engineering").
- **No market-data-platform claim.** Jayraj studies market/data-store systems as an interest; he has not shipped one. Never present it as his work.
- **Live/animated numbers must be labeled honestly** (`illustrative` for seed/placeholder, `as of <date>` for real). Never claim "live" for static data.
- **Never commit** the raw exports under `~/portfolio-export/` (they contain internal detail).

## Knowledge Base (`docs/knowledge/`)

- `profile.md` — canonical facts + honesty rules (source of truth).
- `content-model.md` — data file + MDX schemas.
- `design-system.md` — tokens, type, motion, the instrument kit.
- `data-pipeline.md` — the hybrid live-data pipeline.
- `voice.md` — Jayraj's writing voice, for drafting copy/posts.
