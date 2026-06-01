# Portfolio Elevation — P2 Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Render the real P1 data across all routes in the "living data system" design — an editorial **broadsheet** body (Newsreader serif, generous columns) opened by a **terminal** hero (mono `whoami` console + instruments), per the approved concepts. Replace every remaining legacy/fictional page section.

**Design references (implementers MUST read for visual fidelity):**
- Concept mockups: `.superpowers/brainstorm/91921-1780255820/content/concepts.html` (the A=terminal + C=broadsheet target) and `designsystem.html` (instrument kit + type/color usage).
- Design system: `src/app/globals.css` `@theme` tokens; fonts `font-headline` (Space Grotesk), `font-body` (Newsreader), `font-mono` (JetBrains Mono); market colors `text-up`/`text-down`.
- Instrument kit (reuse, don't reinvent): `src/components/instruments/{TickerChip,TickerRail,TerminalBlock,Metric,StatusDot,Sparkline}.tsx`.
- Copy/voice + facts: `docs/knowledge/profile.md`. Honesty/disclosure rules apply (aggregate metrics only; no internal codenames/keys/repos/vendors).

**Data (all real, from P1):** `work.json`, `experience.json`, `systems.json`, `books.json`, `papers.json`, `anime.json`, `interests.json`, `fieldnotes.json`, `now.json`, `uses.json`, `stats.json`. Types in `src/lib/types.ts`. Posts via `src/lib/blog.ts` (`content/writing`).

**Tech:** Next.js 16 static export; pages are Server Components (no client islands needed in P2 — animation/live data is P3/P4); `pt-32` page-offset convention for the fixed header; `params` awaited in dynamic routes.

**Branch:** `feat/portfolio-elevation`. Commit identity: personal gmail (configured).

**Testing:** `npm run lint` + `npm run build` per task (TS strict + static export gate). Each implementer reads the design refs and builds idiomatic JSX with the kit; reviewed against the per-page spec below.

---

## Conventions for every page
- Wrapper: `<div className="pt-32 pb-24 px-8 max-w-{5xl|7xl} mx-auto">`.
- Section eyebrow: mono, `text-tertiary`, `tracking-[0.3em] uppercase text-xs` (e.g. `/work`, `02 / archive`).
- Headlines: `font-headline` (display) or `font-body italic` (editorial), per the concept look.
- Body copy: `font-body` (Newsreader), `text-on-surface-variant`, generous `leading-relaxed`.
- Data/labels/metrics: `font-mono`.
- Add `export const metadata` (title + description) to every page.
- Strictly real content from the data files / profile.md. No stock imagery, no invented copy, no dead buttons.

---

## Task 1: Home (`/`) — terminal hero + broadsheet

**File:** rewrite `src/app/page.tsx`. Keep using the already-real `StatsSection`. Stop importing `HeroSection` and `BentoGrid` (removed in Task 7).

Sections, in order:
1. **Terminal hero** — a `TerminalBlock` titled `jayraj@safe:~$` containing real `whoami`-style output:
   - `> whoami` → `Jayraj Jadeja — Software Engineer II @ SAFE Security · Bengaluru`
   - `> cat focus.txt` → `backend · distributed systems · event-driven · go / typescript`
   - `> ./status` → a `StatusDot` "open to roles" + tenure
   - Beside/below it, a tight row of `Metric` instruments sourced from `stats.json` (issues delivered, PRs merged, lines changed) — the honest delivery telemetry. (Static; no fake live counters.)
   - A serif lead line under the hero: the spine — *"I take systems apart to see how they tick."* + one editorial sentence.
2. **Selected work** — heading + 3 `work.json` entries as compact "case file" cards (mono index `[01]`, title, summary, stack chips). Link to `/work`.
3. **Latest writing** — pull `getAllPosts()` (currently 1) → title + excerpt + date, link to `/writing/{slug}`; plus a link out to the Substack (`https://substack.com/@jayrajadeja`).
4. **Currently** — a strip from `now.json` (building / reading / open-to-roles), mono labels.
5. **`<StatsSection/>`** — the existing real verified-metrics band (already correct).
6. **CTA** — keep a slim "get in touch" (mailto `jayrajsinh.jadeja399@gmail.com`) + GitHub link. (Can reuse the fixed `CTASection`, or inline a leaner one — implementer's call; no dead buttons.)

**Acceptance:** `/` renders the terminal hero + real work/writing/now/stats; no stock images, no "Download Portfolio" button, no BentoGrid. Build + lint green.

---

## Task 2: `/work` — selected systems + experience

**File:** rewrite `src/app/work/page.tsx`.

Sections:
1. Eyebrow `/work` + headline ("Selected Systems").
2. **Case files** — map `work.json` (`WorkCaseFile[]`): each as a generous broadsheet entry — title (`font-headline`), summary (serif), stack as mono chips, tags. Number them `[01]…`.
3. **Experience timeline** — map `experience.json` (`ExperienceEntry[]`): org, title, period (`start`–`end ?? "present"`), location, summary. Vertical timeline with a mono date rail.
4. **Stack & specialties** — a mono tag cloud derived from the union of `work[].stack` (or a short curated list: Go, TypeScript, Temporal, MySQL, event-driven, distributed systems).

**Acceptance:** all `work.json` + `experience.json` rendered; generic descriptions only (no internal identifiers); build green.

---

## Task 3: `/writing` hub + `/writing/[slug]` post

**Files:** rewrite `src/app/writing/page.tsx`; create `src/app/writing/[slug]/page.tsx`.

**`/writing` (hub):**
1. Eyebrow + headline ("The Desk").
2. **Substack callout** — finance × engineering; link to `https://substack.com/@jayrajadeja`.
3. **Long-form** — `getAllPosts()` → list of post cards (title, date, tags, excerpt) linking to `/writing/{slug}`.
4. **Field notes** — map `fieldnotes.json` (`FieldNote[]`) as a grid of short mono/editorial cards (number, title, quote, tag). (This is the evolution of the old "velocity nuggets".)

**`/writing/[slug]` (post):** port the old blog-post renderer to this route:
- `generateStaticParams()` from `getAllSlugs()`.
- `generateMetadata` from the post.
- `await params`; `getPostBySlug`; `notFound()` if missing; render MDX via `remark().use(html)`; `prose prose-invert` styling (as the old `/blog/[slug]` did); a "← Back to the desk" link to `/writing`.

**Acceptance:** `/writing` lists the real post + field notes + Substack link; `/writing/finance-meets-engineering` renders; `generateStaticParams` pre-builds it; build green.

---

## Task 4: `/interests` — F1, markets, anime, sport, library, systems studied

**File:** rewrite `src/app/interests/page.tsx`. Stop importing `PhotoGrid`, `F1Section`, `FinanceSection` (removed in Task 7).

Sections (each an instrumented broadsheet block, no stock photos):
1. Eyebrow + headline ("Curated Interests").
2. **Formula 1** — from `interests.json.f1`: favorite **team** (Mercedes) + favorite **drivers** (Hamilton, Verstappen) clearly labeled as favorites (NOT a roster), + the note.
3. **Markets** — `interests.json.markets`: note + `focus` chips (NASDAQ, fundamentals, crypto). A `TickerChip` row or `Sparkline` accent is on-brand.
4. **Anime & manga** — map `anime.json` (`AnimeEntry[]`): title + `kind` badge.
5. **Sport** — `interests.json.sport` note (table tennis, badminton).
6. **The shelf (Library)** — `books.json` (`Book[]`) + `papers.json` (`ResearchPaper[]`): books (title/author/category/note), papers (title/authors/venue/why/link). Papers link out.
7. **Systems I've studied** — map `systems.json` (`StudiedSystem[]`): flagship ones (YouTube video processing, financial data-store solutioning) featured larger; others compact. Each = system + note. Framed as study notes.

**Acceptance:** real interests/library/systems rendered; no photography section, no invented F1/finance copy; build green.

---

## Task 5: `/about` — bio, education, metrics, contact

**File:** rewrite `src/app/about/page.tsx`.

Sections:
1. Eyebrow + headline ("About").
2. **Bio** — serif, in his voice (from profile.md): backend/distributed-systems engineer at SAFE; takes systems apart; finance×engineering on Substack; the "OP" register is fine.
3. **By the numbers** — render `stats.json` richer than the home band: headline metrics + `issuesByYear`/`prsByYear` as small `Sparkline`/bar visuals + `issuesByType` breakdown. Caption: "Verified across Jira + GitHub · 2021–2026". (Aggregate only.)
4. **Education** — Jaypee Institute of Information Technology (B.Tech CS, 8.1 CGPA); DPS Vindhyanagar.
5. **Résumé + contact** — résumé button → the Drive link; contact = `mailto:jayrajsinh.jadeja399@gmail.com`; GitHub + LinkedIn + Substack.

**Acceptance:** real bio/education/metrics/contact; résumé link works; build green.

---

## Task 6: `/now` + `/uses`

**Files:** rewrite `src/app/now/page.tsx`, `src/app/uses/page.tsx`.

- **`/now`** — render `now.json` (`NowData`): `updated` stamp, building / reading (list) / watching / exploring. Editorial, dated-snapshot feel.
- **`/uses`** — render `uses.json` (`UsesData`): editor / terminal / languages / datastores. **Show the honest `note`** ("setup to be personalized") as a small caption so it's clearly provisional, OR render plainly — but do not present guesses as gospel.

**Acceptance:** both render their data; `/uses` provisional note preserved; build green.

---

## Task 7: Remove legacy components + final P2 review

**Files:** remove now-unused `src/components/{HeroSection,BentoGrid,F1Section,FinanceSection,PhotoGrid}.tsx`.

- [ ] Grep to confirm nothing imports them after Tasks 1–6:
```bash
grep -rn "HeroSection\|BentoGrid\|F1Section\|FinanceSection\|PhotoGrid" src/ || echo "no references — safe to remove"
```
- [ ] `git rm` the five unused components.
- [ ] `npm run lint && npm run build` — green; 9 routes: `/`, `/work`, `/writing`, `/writing/[slug]`, `/interests`, `/about`, `/now`, `/uses`, `/_not-found`.
- [ ] Fabrication/stock-image sweep: `grep -rniE "aida-public|lh3.googleusercontent|download portfolio|jayraj\.dev|1\.2M|kinetic energy" src/ && echo "!!! FOUND" || echo "clean"` — expect clean (no Google-stock images, no dead buttons, no fabrications).
- [ ] Final holistic P2 review (subagent): coherence with the design system, real data only, disclosure-safe, accessibility basics, build green, ready for P3.
- [ ] Commit.

**P2 complete when:** every route renders real data in the C+A design, no legacy/fictional UI or stock imagery remains, and the build is green.

---

## Self-Review (against spec §6/§5)
- §6 IA pages all built to render real data: ✅ Tasks 1–6.
- C+A direction (terminal hero + broadsheet) applied: ✅ Task 1 + consistent conventions.
- Instrument kit reused (not reinvented): enforced via per-page specs + review.
- Honesty/disclosure: aggregate-only `/work` + `/about` metrics; favorites-not-roster F1; no stock imagery/dead buttons (Task 7 sweep). ✅
- Deferred to later phases: live crypto/market data + animation (P3); OG images, sitemap/robots, deeper a11y + perf, mobile nav (P4); AGENTS/CLAUDE/knowledge/llms.txt (P5).
