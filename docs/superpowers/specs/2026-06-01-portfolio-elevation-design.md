# Portfolio Elevation — Design Spec

- **Date:** 2026-06-01
- **Author:** Jayraj Jadeja (facilitated with Claude)
- **Status:** Approved for planning
- **Repo:** `jayrajadeja.github.io` (Next.js 16 static export → GitHub Pages)

---

## 1. Context

The site is currently a beautifully built but **entirely fictional** Next.js 16 portfolio generated from HTML mockups by a small AI agent. The visual craft is good; the content is invented (high-frequency-trading Rust, "1.2M lines of logic", stock photography, fabricated books/papers). Dead links exist (`/resume.pdf`, "Download Portfolio", "Load Older Records").

This project does two things:

1. **Elevate the experience** — turn it into a distinctive, high-craft "living data system."
2. **Make it true** — replace all fictional content with Jayraj's real story, work, and writing.

A third deliverable, requested for the end: **make the repo AI-ready** (knowledge base, `AGENTS.md`, `CLAUDE.md`).

## 2. Goals & Non-Goals

**Goals**
- A portfolio that feels like an artifact of its owner: a "living data system" — terminal hero, market ticker rail, telemetry instruments, on an editorial reading spine.
- 100% real, **interview-defensible** content. No fabricated claims, ever.
- Repo is AI-ready: an agent can read `AGENTS.md` + `docs/knowledge/` and confidently extend the site without re-introducing fiction.
- Stays a fast, accessible, static export deployable to GitHub Pages.

**Non-Goals**
- ⌘K command palette (deferred to a future "v2 easter egg").
- Custom domain (stays `jayrajadeja.github.io`).
- CMS, comments, analytics, light/dark toggle (the site is dark by design), i18n.
- Server-side features (incompatible with static export).

## 3. Purpose & Audience

**Primary:** a *creative playground* — optimized for taste, craft, and delight; opinionated and personal.

**Secondary (both/and):** Jayraj is **actively job-hunting**, so real technical credibility (distributed systems, Temporal, the CISO Digest agent, databases) must be **legible to a sharp technical recruiter within ~15 seconds**, and every claim must be one he can walk through confidently in an interview.

## 4. The Person — Canonical Facts (single source of truth)

This section seeds `docs/knowledge/profile.md`. **It is authoritative.** When content and this section disagree, this section wins.

**Identity**
- Jayraj Jadeja — **Software Engineer II at SAFE Security** (Feb 2021 – present, 5+ years).
- Based in **Bengaluru**. **Open to new opportunities.**
- Domain: **backend & distributed systems**. Languages: **Go, TypeScript**. Strong **database** work — MySQL query/index optimization, null-safe equality (`<=>`).

**Real work (interview-defensible — goes in `/work`)**
- **Workflow-as-a-Service** built on **Temporal**.
- **Multi-region / cross-stack data transfer.**
- **Scaling systems with event-driven architecture.**
- **CISO Digest** — an AI agent that analyzes threat feeds and quantifies their impact into actionable insights for executives. *(Confirmed built; Jayraj is confident discussing it.)*
- Earlier: **software engineering internship at Mudraksh & McShaw LLP** (May–July 2019).

**Verified contribution metrics (Jira + GitHub, 2021–2026 — aggregate only, safe to publish)**
- ~5 years on SAFE's enterprise cyber-risk-quantification platform; full-stack (Go backend + React/TypeScript frontend).
- **788** issues delivered (**695** resolved, **88%**); median cycle time **9 days**.
- **626** pull requests (**582** merged, **93%**); ~**26** PRs/month.
- **214,956** lines changed (+185,782 / -29,174); **2,682** commits; **4,298** files; **18** repositories.
- **6,719** review submissions received; **1,444** discussion comments.
- Source: `~/portfolio-export/` (Jira API + GitHub GraphQL, cross-checked). Curated safe subset stored in `src/data/stats.json`.

**"Systems I've studied" (curiosity, not employment — clearly framed as study)**
- Flagship favorites: **YouTube video processing** and **financial data store solutioning**.
- Others studied: S3, Instagram, Dropbox, Google Drive, Google Docs, Uber.
- Papers: **Google File System**, **Amazon Dynamo**. Book: **Designing Data-Intensive Applications**.

**⚠️ Honesty rules (hard constraints)**
- Jayraj has **NOT** worked on a market-data platform and has **not** shipped a "1M+ ticks/second" production system. That was AI embellishment and is **removed**. Market data is a *studied interest*, never presented as his work.
- The "throughput counter" must **never** claim to be his production system's metric. Live/animated numbers are framed as **markets he follows** or **representative/illustrative**, never as fabricated work output.
- "Systems I've studied" uses **real, public, citable figures**, labeled as study notes — not as systems he operates.
- **Disclosure (SAFE work):** publish aggregate personal metrics + a one-line domain description ONLY. Do NOT publish internal codenames, Jira issue keys, repository names, vendor/customer names, or specific feature/PR titles. Never commit the raw exports from `~/portfolio-export/`.

**Interests**
- **Formula 1** — team **Mercedes**; drivers **Lewis Hamilton** and **Max Verstappen**.
- **Markets / finance** — NASDAQ stocks, market fundamentals, crypto.
- **Anime / manga** — Naruto, One Piece, Haikyuu, Jujutsu Kaisen.
- **Sport** — table tennis, badminton.

**Library**
- Books: *Designing Data-Intensive Applications*, *AI Engineering* (Chip Huyen), *Dark Matter* (Blake Crouch), *The Trial* (Kafka).
- Papers: *Google File System*, *Amazon Dynamo*.

**Writing / voice**
- **Substack** (`substack.com/@jayrajadeja`, live) — the intersection of **finance and engineering**.
- Voice: deeply technical, analytical, pragmatic about performance; blends rigorous engineering terms with modern shorthand (e.g. calls great tech **"OP"**).

**Education**
- B.Tech, Computer Science — **Jaypee Institute of Information Technology** (8.1 CGPA).
- Schooling — Delhi Public School, Vindhyanagar.

**Coordinates**
- GitHub: `github.com/jayrajadeja`
- LinkedIn: `https://www.linkedin.com/in/jayrajadeja/`
- Email (public): `jayrajsinh.jadeja399@gmail.com`
- Substack: `substack.com/@jayrajadeja`
- X/Twitter: none.
- Résumé: `https://drive.google.com/file/d/1tleUFEbGJ4Se847v0RVS3qQ_4kZL-dS0/view?usp=sharing` (may later be replaced by `public/resume.pdf`).
- Site URL: `https://jayrajadeja.github.io`.

## 5. Experience Direction

**Concept: "Living data system."** The site behaves like a high-throughput system; form mirrors what Jayraj builds.

**Visual blend: C + A.**
- **A — Terminal:** the hero is a live console (`whoami`, market ticker, instruments). Monospace, command-style nav.
- **C — Broadsheet:** everything below reads like a finance/engineering broadsheet — serif reading spine, data marginalia, a live ticker rail.

Rule of thumb: **editorial to read, instrumented to feel alive.**

## 6. Information Architecture

8 routes (7 pages + 1 dynamic). Global chrome: a live **ticker rail**, **command-style nav**, and a **live telemetry footer** (ticker / markets — never a fabricated system metric).

| Route | Page | Contents |
|---|---|---|
| `/` | **Home** | Terminal hero (`whoami`, live ticker, instruments) → lead dispatch (the spine, serif) → selected work (3 case files) → latest writing (Substack) → "currently" status strip → a real-stats band (true figures only — e.g. years, systems studied, papers read). |
| `/work` | **Work** | Real case files: Temporal Workflow-as-a-Service, multi-region/cross-stack transfer, event-driven scaling, CISO Digest AI agent. Experience timeline (SAFE 2021→, Mudraksh internship 2019). Stack & specialties. |
| `/writing` | **Writing** | Substack hub (finance × engineering) + "field notes" (short technical takes; replaces "velocity nuggets") + long-form MDX index. |
| `/writing/[slug]` | **Post** | Rendered MDX long-form post. `generateStaticParams()` for all slugs. |
| `/interests` | **Interests** | Instrumented panels: Formula 1, Markets, Anime/Manga, Sport. Plus the **Library** shelf (books + papers) and **"Systems I've studied"** (flagship: YouTube video processing, financial data store solutioning). |
| `/about` | **About** | Bio in his voice, education, résumé (Drive link), real contact links. |
| `/now` | **Now** | A dated snapshot of what he's building / reading / watching. |
| `/uses` | **Uses** | Editor, terminal, hardware, stack — the setup behind the work. |

> Placement note: "Systems I've studied" and the Library live on `/interests` by default; either may be promoted to its own section during implementation if it grows. This is a layout decision, not a content one.

## 7. Content Model

All content is static JSON or MDX (no DB). Types live in `src/lib/types.ts`. Proposed data files in `src/data/`:

- `work.json` — case files: `{ id, title, role, org, period, summary, problem, approach, impact, stack[], tags[], confidential? }`.
- `experience.json` — timeline: `{ id, org, title, start, end|null, location, highlights[] }`.
- `systems.json` — systems studied: `{ id, system, area, flagship?: boolean, note, publicStats: [{ label, value, source }], refs[] }`.
- `books.json` — `{ id, title, author, category, note, link? }` (rewritten to the real list).
- `papers.json` — `{ id, title, authors, venue, why, link }` (rewritten: GFS, Dynamo, …).
- `anime.json` — `{ id, title, kind: "anime"|"manga", note? }`.
- `interests.json` — F1 (team, drivers), markets, sport copy blocks.
- `fieldnotes.json` — `{ id, number, title, quote, tag, icon }` (evolves `nuggets.json`).
- `now.json`, `uses.json` — structured entries for those pages.
- **Generated** (by the data pipeline): `markets.json` (stocks, `asOf`), `f1.json` (standings / last / next race, `asOf`). Committed baked snapshots provide fallback.

`content/blog/` is **renamed to `content/writing/`** for coherence with the route, and `src/lib/blog.ts` is updated to match. **All fictional posts are removed**; seeded with at least one real long-form post (a clearly-marked draft is acceptable).

## 8. Design System

Evolves the existing Material Design 3 dark theme in `src/app/globals.css` (`@theme`). **Additions/changes, not a rewrite:**

**Palette**
- Canvas `#0c0e0f` (deepened from `#131313`), panels `#131516` / `#181b1c`, hairlines `rgba(255,255,255,.09)`.
- Ink `#e9eaea`, dim `#8b9095`, faint `#5b6166`.
- **Cyan `#4cd6ff`** = data/tech (existing tertiary). **Salmon `#ffb4a8`** = warm accent/headline (existing primary).
- **New market colors:** up/green `#3ddc84`, down/red `#ff6b6b`.
- Existing MD3 semantic tokens are retained for compatibility.

**Typography (three voices, each with a job)**
- **Newsreader** (serif) — reading body, leads, mastheads. *(existing)*
- **Space Grotesk** — display headings, labels, UI. *(existing)*
- **JetBrains Mono** — all data, tickers, metrics, terminal, code. *(NEW — add via `next/font/google` as `--font-mono`.)*

**Motion**
- Data ticks and breathes (counters increment, tickers flicker, sparklines draw on scroll-in).
- Transitions quick and springy: **150–500ms**, never theatrical.
- **`prefers-reduced-motion`:** all motion freezes to last value; no information is motion-only.

**Instrument kit (reusable components)**
`MarketTicker` (client), `TickerChip`, `SystemStat` (rotating real public figures), `Sparkline` (scroll-in draw), `StatusDot`, `CaseFile`, `TerminalBlock`/`Prompt`, `FieldNote`, `SystemStudiedCard`. Each is small, single-purpose, and documented.

## 9. Data Pipeline (Hybrid)

**Build time** (extends `.github/workflows/deploy.yml`):
- Triggers: `push` to `master`, **daily `schedule` cron**, and `workflow_dispatch`.
- New pre-build step runs `scripts/fetch-data.mjs`:
  - **Stocks** — a free stock API (provider chosen in P3; generous free tier, e.g. Finnhub), key from a **GitHub Actions secret** (`STOCK_API_KEY`). Symbols include NVDA, AAPL, TSLA, MSFT. Writes `src/data/markets.json` with an `asOf` timestamp.
  - **F1** — **Jolpica** (`api.jolpi.ca`, Ergast-compatible, keyless): latest standings, last race, next race. Writes `src/data/f1.json`.
  - **Failure is non-fatal:** on fetch error or missing secret, the last committed snapshot is used so the build never breaks.
- Then `next build` → static `out/` → deploy to Pages.

**Runtime** (browser):
- A small **client island** fetches **live crypto** from a keyless, CORS-friendly endpoint (Coinbase/Binance public) on mount.
- **Fallback:** on error / rate-limit / reduced-data, it renders the baked snapshot from `markets.json`.

**Honesty by construction:** "Systems I've studied" figures are real, public, and labeled with sources; market/crypto numbers are framed as *markets Jayraj follows*; no number is presented as his production-system output.

## 10. Technical Architecture

- **Stack retained:** Next.js 16 (App Router, `output: "export"`), React 19, Tailwind v4 (CSS `@theme`), MDX (`gray-matter` + `remark`).
- **Static-first:** every page pre-renders; dynamic blog slugs via `generateStaticParams()`; `params` awaited (Next 16). **Client islands only** for the live ticker, counters, and scroll-in sparklines.
- **Components:** reorganize `src/components/` into `instruments/` (the kit) and `sections/` (page sections). `Navbar` stays the lone always-client component plus the new islands.
- **Performance / SEO / a11y:** fast by default (target Lighthouse ~100); real **OG image(s)**, `sitemap.xml`, `robots.txt`, per-page metadata; semantic, keyboard-accessible HTML; reduced-motion safe.
- **Fix all dead links:** résumé → Drive link; real socials; remove/activate the "Download Portfolio" and "Load Older Records" buttons.
- **Build gate:** `npm run build` must succeed (static export of all routes) at the end of every phase.

## 11. AI-Readiness Deliverables

- **`AGENTS.md`** — rewritten as the canonical agent guide: stack, structure, conventions, content model, data pipeline, how to add a post / case file / studied-system, build & deploy, and a pointer to the knowledge base. Includes the **honesty rules**.
- **`CLAUDE.md`** — stays a thin pointer (`@AGENTS.md`) plus Claude-specific notes (existing pattern preserved).
- **`docs/knowledge/`** — the knowledge base:
  - `profile.md` — canonical bio & facts (from §4), incl. real-vs-studied honesty rules. Single source of truth for content.
  - `content-model.md` — every data file and MDX schema, with examples.
  - `design-system.md` — tokens, type, motion, and instrument-kit usage.
  - `data-pipeline.md` — the Action, the secret, the endpoints, the fallback contract.
  - `voice.md` — Jayraj's writing voice, for drafting posts/field notes.
- **`public/llms.txt`** — an AI-readable summary of the site (served at `/llms.txt`), on-brand for an "AI-ready" personal site.

## 12. Build Order (phasing)

Each phase ends green (`npm run build` passes) and is independently reviewable.

- **P0 — Foundation.** Evolve `globals.css` tokens (deepened canvas, market colors, `--font-mono`); add JetBrains Mono via `next/font`; rebuild layout/nav/footer for the new IA (command nav, ticker rail, telemetry footer); scaffold the instrument-kit primitives; draft `docs/knowledge/profile.md`.
- **P1 — Real content & schemas.** Update `types.ts`; create/populate all `src/data/*.json` with real content; migrate MDX; **purge every fictional artifact** (Rust HFT post, fake stats, stock-photo interests, fake books/papers).
- **P2 — Pages.** Implement all 8 routes with real content and the C+A treatment.
- **P3 — Live data.** `scripts/fetch-data.mjs`; committed baked snapshots; extend `deploy.yml` (cron + secret + fetch step + non-fatal failure); client crypto island + fallback.
- **P4 — Polish.** Motion + reduced-motion; OG image(s); `sitemap`/`robots`; per-page metadata; perf pass; fix all dead links; favicon/branding.
- **P5 — AI-readiness.** `AGENTS.md`, `CLAUDE.md`, `docs/knowledge/*`, `public/llms.txt`.

## 13. Success Criteria

- No fabricated claims anywhere; everything is interview-defensible (honesty rules hold).
- The "living data system" feel lands: terminal hero, live ticker rail, working instruments, on an editorial body.
- Static export builds clean; site is fast, accessible, and reduced-motion safe.
- All real links/résumé/Substack wired; no dead links remain.
- An agent can follow `AGENTS.md` + `docs/knowledge/` to add a post or case file **without** re-introducing fiction.

## 14. Risks & Mitigations

- **Stock API limits / keys** → daily cron (not per-request), committed fallback snapshot, generous-free-tier provider.
- **Data staleness** → `asOf` labels; daily refresh.
- **Crypto API CORS / rate limits** → keyless CORS-friendly endpoints + baked fallback.
- **Honesty drift (agents re-adding fiction)** → `profile.md` honesty rules + explicit "do not fabricate" in `AGENTS.md` + this spec as the contract.
- **Scope (7 pages + pipeline)** → strict phasing; `/now` & `/uses` kept minimal; ⌘K out of scope.

## 15. Decided Defaults (not open questions)

- Stock API provider is finalized in **P3** (default: a generous free tier such as Finnhub); not blocking earlier phases.
- Résumé uses the **Drive link** now; `public/resume.pdf` is an optional later swap.
- "Systems I've studied" and Library start on **`/interests`**; promotion to a dedicated section is an implementation-time layout call.
