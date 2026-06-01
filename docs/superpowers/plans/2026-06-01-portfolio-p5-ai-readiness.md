# Portfolio Elevation — P5 AI-Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Make the repo AI-ready — a canonical `AGENTS.md`, a thin `CLAUDE.md` pointer, an expanded `docs/knowledge/` base, and a root `llms.txt` — all **accurate to the repo as it exists after P0–P4** so any agent can extend the site correctly without re-introducing fiction or breaking the honesty rules.

**Critical principle:** the current `AGENTS.md` and `CLAUDE.md` describe the OLD fictional structure (content/blog, books/papers/nuggets, Home/Blog/Library/Interests IA) and are now WRONG. Implementers MUST read the actual repo (src/, scripts/, deploy.yml, package.json, docs/knowledge/profile.md) and document reality — not the old files or the spec's intent.

**Tech to document:** Next.js 16 (App Router, `output: "export"`), React 19, TS strict, Tailwind v4 (`@theme` in globals.css, NO tailwind.config), MDX (gray-matter + remark), Vitest (logic only). Fonts: Space Grotesk (`font-headline`), Newsreader (`font-body`), JetBrains Mono (`font-mono`) via `next/font`.

**Branch:** `feat/portfolio-elevation` (PR #3). Commit identity: personal gmail. Docs don't affect the build except `public/llms.txt` (copied to `out/`).

**Testing:** `npm run build` still green; `out/llms.txt` served; docs internally consistent + accurate (final review cross-checks against the repo).

---

## Ground-truth reference (verify against the repo; correct anything that drifted)

- **IA / routes:** `/`, `/work`, `/writing`, `/writing/[slug]`, `/interests`, `/about`, `/now`, `/uses` (NO `/blog`, `/library`).
- **Components:** `src/components/` → `Navbar` (client, mobile menu), `Footer`, `StatsSection`, `Eyebrow`, `SectionHeader`; `instruments/` → `TerminalBlock`, `TickerChip`, `TickerRail` (client, live crypto), `Metric`, `StatusDot`, `Sparkline`, `CountUp` (client).
- **Lib:** `blog.ts` (reads `content/writing`), `types.ts`, `format.ts` (+ `format.test.ts`).
- **Data (`src/data/`):** `work`, `experience`, `systems`, `books`, `papers`, `anime`, `interests`, `fieldnotes`, `now`, `uses`, `stats` (curated aggregate metrics), `markets` (seed → built), `f1` (seed → built).
- **Content:** `content/writing/*.mdx` (frontmatter: title, date, tags, excerpt).
- **Live data:** `scripts/parse-feeds.mjs` (+test), `scripts/fetch-data.mjs`; `.github/workflows/deploy.yml` runs fetch (STOCK_API_KEY secret, `continue-on-error`) before build, on push + daily cron + dispatch. Crypto live client-side (CoinGecko) with baked fallback; stocks/F1 baked at build; ticker label data-driven.
- **Client islands ONLY:** `Navbar`, `TickerRail`, `CountUp`. Everything else is a Server Component.
- **Conventions:** `pt-32` page offset (fixed header); `Eyebrow`/`SectionHeader` for section heads; `font-headline`/`font-body`/`font-mono` roles; theme tokens only (no hardcoded hex); `aria-labelledby` on sections; `await params` + `generateStaticParams` in `[slug]`.
- **Honesty / disclosure (HARD RULES — must be prominent):** all content real + interview-defensible; SAFE work shows aggregate metrics + one-line domain ONLY (no internal codenames/Jira keys/repo names/vendor names; SAFE named only in `experience.json`); NO market-data-platform claim (studied interest only); aggregate-portfolio framing (`jayraj@engineering`, "Years Engineering"); live/animated numbers labeled honestly (illustrative / as-of), never a false "live" claim; never commit raw `~/portfolio-export/`.

---

## Task 1: Rewrite `AGENTS.md` + `CLAUDE.md`

**Files:** rewrite `AGENTS.md`; rewrite `CLAUDE.md`.

- [ ] **Step 1: Read reality.** Read `AGENTS.md`, `CLAUDE.md` (current — to replace), `package.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css` (token names), `src/lib/{blog,types}.ts`, `.github/workflows/deploy.yml`, `docs/knowledge/profile.md`, and `ls src/app src/components src/components/instruments src/data scripts content/writing`.

- [ ] **Step 2: Rewrite `AGENTS.md`** as the canonical agent guide. Sections (accurate to the repo):
  - **Overview** — what the site is (a real, aggregate engineering portfolio; "living data system" — editorial broadsheet + terminal hero).
  - **Tech stack** — as above.
  - **Project structure** — the real tree (routes, components incl. the instrument kit, lib, data files with one-line purpose each, scripts, content/writing, docs/knowledge).
  - **Key conventions** — Server Components vs the 3 client islands; `pt-32`; Eyebrow/SectionHeader; font roles; theme tokens (no hex); static-export rules (no server APIs, `await params`, `generateStaticParams`, metadata routes need `dynamic="force-static"`); reduced-motion.
  - **Content model** — every `src/data/*.json` shape (point to `docs/knowledge/content-model.md`) + MDX frontmatter.
  - **Live-data pipeline** — crypto (client/CoinGecko + fallback), stocks (build/Finnhub/`STOCK_API_KEY` secret), F1 (Jolpica), the daily Action, graceful degradation, honest labels (point to `docs/knowledge/data-pipeline.md`).
  - **How to add content** — add a writing post (`content/writing/<slug>.mdx` + frontmatter), a work case file (`work.json`), a studied system (`systems.json`), a book/paper/anime/field-note, update `/now` (`now.json`) / `/uses` (`uses.json`). Always `npm run build` to verify.
  - **Build, test & deploy** — `npm run dev|build|lint|test`; static export → `out/`; GitHub Pages via `deploy.yml`; `STOCK_API_KEY` secret for live stocks.
  - **⚠️ Honesty & disclosure rules** — the HARD RULES verbatim (prominent, near the top or its own clearly-marked section). Point to `docs/knowledge/profile.md` as the single source of truth for facts.
  - **Knowledge base** — list `docs/knowledge/*` and what each holds.

- [ ] **Step 3: Rewrite `CLAUDE.md`** — keep it thin: start with `@AGENTS.md` (so it inherits the guide), then Claude-specific notes that remain accurate: Material Design 3 token naming, Tailwind v4 (theme in CSS, no config), static-export constraints, "verify with `npm run build` after changes," Vitest for `src/lib`/`scripts` logic, and a one-line pointer to the honesty rules + `docs/knowledge/`. Remove all stale content (blog/library/nuggets/old IA).

- [ ] **Step 4: Verify + commit.** `npm run build` green (docs don't affect it, but confirm). Re-read both files for accuracy vs the repo.
```bash
git add AGENTS.md CLAUDE.md
git commit -m "docs: rewrite AGENTS.md + CLAUDE.md for the real repo (AI-readiness)"
```

---

## Task 2: Expand `docs/knowledge/`

**Files:** create `docs/knowledge/content-model.md`, `design-system.md`, `data-pipeline.md`, `voice.md`. (`profile.md` already exists — leave it.)

- [ ] **Step 1: `content-model.md`** — read `src/lib/types.ts` + every `src/data/*.json` + `src/lib/blog.ts`. Document each data file: its purpose, its TypeScript type/shape (field-by-field), an example entry, and which page(s) consume it. Document the MDX frontmatter contract for `content/writing`. This is the "how to add/edit content" schema reference.

- [ ] **Step 2: `design-system.md`** — read `src/app/globals.css` + the instrument components. Document: the palette tokens (canvas, ink/dim, cyan=data, salmon=accent, up/down market colors) with hex; the three font roles; the radius/utility tokens; the motion principles (data ticks/breathes, 150–500ms, `prefers-reduced-motion` freezes to last value); and the instrument kit (each component: purpose, props, when to use). Note "theme tokens only, no hardcoded hex."

- [ ] **Step 3: `data-pipeline.md`** — read `scripts/*.mjs` + `deploy.yml` + `TickerRail.tsx`. Document the hybrid pipeline end to end: crypto (client CoinGecko + baked fallback), stocks (build-time Finnhub via `STOCK_API_KEY`), F1 (Jolpica keyless), the parsers, the Action (triggers, the non-fatal fetch step, the secret), the `markets.json`/`f1.json` shapes + `source`/`asOf` semantics, the data-driven honest label, and the graceful-degradation contract (never break the build, never misrepresent). Include the **user setup step** (add `STOCK_API_KEY` repo secret).

- [ ] **Step 4: `voice.md`** — read `profile.md` + `content/writing/*.mdx` + the field notes. Document Jayraj's writing voice for drafting future posts/copy: technical, analytical, pragmatic about performance; blends rigorous terms with modern shorthand ("OP"); the finance×engineering lens; the spine "I take systems apart to see how they tick." Include do/don't examples and the honesty constraints applied to copy.

- [ ] **Step 5: Verify + commit.** Cross-check each doc against the repo for accuracy.
```bash
git add docs/knowledge/
git commit -m "docs: expand knowledge base (content-model, design-system, data-pipeline, voice)"
```

---

## Task 3: `llms.txt` + verify + final review

**Files:** create `public/llms.txt`.

- [ ] **Step 1: `public/llms.txt`** — an AI-readable site summary at the web root (served at `/llms.txt` in static export). Follow the emerging llms.txt convention: an H1 title, a short blockquote summary, then sections with linked resources. Include: who Jayraj is (one line, aggregate framing), the site's routes with one-line descriptions, links to the key knowledge docs (profile, content-model, design-system, data-pipeline, voice — as repo paths or site URLs), the canonical contact/links, and a one-line honesty note (aggregate metrics; no fabrication). Keep it concise and accurate; no SAFE branding beyond what the site shows.

- [ ] **Step 2: Verify.** `npm run build`; confirm `out/llms.txt` exists and is served from root (`ls out/llms.txt`). `npm run lint && npm test` green.

- [ ] **Step 3: Commit.**
```bash
git add public/llms.txt
git commit -m "docs: add llms.txt (AI-readable site summary)"
```

- [ ] **Step 4: Final P5 review (subagent).** Cross-check ALL P5 docs against the actual repo: AGENTS.md/CLAUDE.md accurate (no stale blog/library/nuggets references; correct IA, components, scripts, pipeline); honesty/disclosure rules present + correct; knowledge docs match the real types/tokens/scripts; llms.txt accurate + served; no contradictions between docs. Build green. Commit any fixes.

**P5 complete when:** AGENTS.md + CLAUDE.md accurately describe the real repo with prominent honesty rules, `docs/knowledge/` covers content-model + design-system + data-pipeline + voice, `llms.txt` ships at `out/llms.txt`, and an agent could follow these to extend the site without re-introducing fiction. **This completes the portfolio rework (P0–P5).**

---

## Self-Review (against spec §11)
- AGENTS.md (canonical) + CLAUDE.md (pointer): ✅ Task 1.
- docs/knowledge/ (profile exists; + content-model, design-system, data-pipeline, voice): ✅ Task 2.
- llms.txt: ✅ Task 3.
- Accuracy guard: every doc authored by reading the real repo, not the stale originals or the spec's intent; final review cross-checks.
- After P5: consider a final full-site review + offer to merge PR #3 (deploy) — but that's the user's call, not part of P5.
