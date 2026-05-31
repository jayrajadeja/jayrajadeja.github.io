# Portfolio Elevation — P1 Content & Data Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace every remaining fictional artifact with real, disclosure-safe content: a typed data model (`src/lib/types.ts`), real JSON for work / experience / systems / books / papers / anime / interests / field-notes / now / uses, the MDX migration (`content/blog` → `content/writing`), and removal of the orphaned `/blog` and `/library` routes.

**Architecture:** All content is static JSON + MDX consumed at build time. P1 establishes the data; **P2 builds the pages that render it** (so after P1, the new data exists but `/work`,`/writing`,`/interests`,`/about`,`/now`,`/uses` are still stubs and the home hero/bento are still legacy — that's expected and addressed in P2).

**Tech Stack:** Next.js 16 static export, TypeScript strict, MDX (`gray-matter` + `remark`), Vitest (logic only).

**Sources of truth:** `docs/knowledge/profile.md` (canonical facts + honesty/disclosure rules) and spec `docs/superpowers/specs/2026-06-01-portfolio-elevation-design.md` (§4, §7).

**Branch:** `feat/portfolio-elevation`. Commit identity is the personal gmail (already configured). **Disclosure: aggregate metrics + one-line domain only; NO internal codenames, Jira keys, repo names, or vendor/customer names. `/work` = generic case files.**

**Testing strategy:** data has no runtime behavior → verify with `npm run lint` + `npm run build` (TS strict catches type mismatches) + JSON validity. No new unit tests required.

---

## File Structure

**Create/Modify:**
- `src/lib/types.ts` — add interfaces: `WorkCaseFile`, `ExperienceEntry`, `StudiedSystem`, `AnimeEntry`, `FieldNote`, `NowData`, `UsesData`, `InterestsData`; revise `Book`, `ResearchPaper`; keep `BlogPost`. Remove unused `VelocityNugget` (replaced by `FieldNote`).
- `src/data/work.json`, `experience.json`, `systems.json`, `anime.json`, `interests.json`, `fieldnotes.json`, `now.json`, `uses.json` — new.
- `src/data/books.json`, `papers.json` — rewrite with real content.
- `src/data/nuggets.json` — delete (superseded by `fieldnotes.json`).
- `content/writing/` — new dir; migrate from `content/blog/`; remove fictional posts; add one real intro post.
- `content/blog/` — delete after migration.
- `src/lib/blog.ts` — point `BLOG_DIR` at `content/writing`.
- **Remove:** `src/app/blog/`, `src/app/library/`, and the components used only by them (`BlogArticle`, `BookCard`, `PaperCard`, `VelocityNugget`).

> Components kept for P2 reuse/redesign: `HeroSection`, `BentoGrid`, `StatsSection`, `CTASection`, `F1Section`, `FinanceSection`, `PhotoGrid` still exist and build; P2 redesigns or removes them. Do NOT touch them in P1.

---

## Task 1: Content types

**Files:** Modify `src/lib/types.ts`

- [ ] **Step 1:** Replace `src/lib/types.ts` with:
```ts
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export interface WorkCaseFile {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  tags: string[];
}

export interface ExperienceEntry {
  id: string;
  org: string;
  title: string;
  start: string;
  end: string | null;
  location: string;
  summary: string;
}

export interface StudiedSystem {
  id: string;
  system: string;
  flagship?: boolean;
  note: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  note: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  venue: string;
  why: string;
  link: string;
}

export interface AnimeEntry {
  id: string;
  title: string;
  kind: "anime" | "manga";
}

export interface FieldNote {
  id: string;
  number: string;
  title: string;
  quote: string;
  tag: string;
}

export interface InterestsData {
  f1: { team: string; drivers: string[]; note: string };
  markets: { note: string; focus: string[] };
  sport: { note: string };
}

export interface NowData {
  updated: string;
  building: string;
  reading: string[];
  watching: string;
  exploring: string;
}

export interface UsesData {
  editor: string;
  terminal: string;
  languages: string[];
  datastores: string[];
  note: string;
}
```

- [ ] **Step 2:** `npm run build` — passes (no consumers reference removed `VelocityNugget` yet except `nuggets.json`/components removed in Task 6; if build fails on a dangling import, that's expected to be resolved by Task 6 — but since Task 1 only changes types, build should still pass because the old components still import the old `VelocityNugget` type name. If it fails, STOP and note it; the controller will resequence.)

> NOTE to executor: `VelocityNugget` is currently imported by `src/components/VelocityNugget.tsx` and `src/app/blog/page.tsx`. Those are removed in Task 6. To keep Task 1 green, **keep** the `VelocityNugget` interface in types.ts for now and remove it in Task 6. Revise Step 1: do NOT delete `VelocityNugget`; add the new interfaces alongside it. Remove it in Task 6.

- [ ] **Step 3:** Commit: `git add src/lib/types.ts && git commit -m "feat: add real content types"`

---

## Task 2: Work + experience data

**Files:** Create `src/data/work.json`, `src/data/experience.json`

- [ ] **Step 1:** `src/data/work.json`:
```json
[
  {
    "id": "ciso-digest",
    "title": "CISO Digest — AI threat-intel agent",
    "summary": "An AI agent that ingests security threat feeds and quantifies their business impact into prioritized, executive-ready insights.",
    "stack": ["AI / LLM", "Go", "event-driven"],
    "tags": ["AI", "security", "automation"]
  },
  {
    "id": "workflow-as-a-service",
    "title": "Workflow-as-a-Service on Temporal",
    "summary": "Durable, event-driven workflow orchestration on Temporal — composable flows with retries, timers, and human-in-the-loop steps at platform scale.",
    "stack": ["Go", "Temporal", "event-driven"],
    "tags": ["distributed-systems", "workflows"]
  },
  {
    "id": "multi-region-data",
    "title": "Multi-region, cross-stack data movement",
    "summary": "Moving data reliably across regions and heterogeneous stacks — consistency, backpressure, and failure handling under real throughput.",
    "stack": ["Go", "MySQL", "messaging"],
    "tags": ["distributed-systems", "data"]
  },
  {
    "id": "event-driven-scaling",
    "title": "Scaling with event-driven architecture",
    "summary": "Re-architecting hot paths around events to raise throughput and decouple services — with database and query optimization underneath.",
    "stack": ["Go", "MySQL", "events"],
    "tags": ["performance", "databases"]
  }
]
```

- [ ] **Step 2:** `src/data/experience.json`:
```json
[
  {
    "id": "safe",
    "org": "SAFE Security",
    "title": "Software Engineer II",
    "start": "2021",
    "end": null,
    "location": "Bengaluru",
    "summary": "Full-stack engineering on an enterprise cyber-risk-quantification platform — Go backend services and a React/TypeScript frontend."
  },
  {
    "id": "mudraksh",
    "org": "Mudraksh & McShaw LLP",
    "title": "Software Engineering Intern",
    "start": "2019-05",
    "end": "2019-07",
    "location": "",
    "summary": "Early engineering internship."
  }
]
```

- [ ] **Step 3:** Validate both JSON (`node -e "JSON.parse(require('fs').readFileSync('src/data/work.json','utf8')); JSON.parse(require('fs').readFileSync('src/data/experience.json','utf8')); console.log('ok')"`). Commit: `git add src/data/work.json src/data/experience.json && git commit -m "feat: add real work + experience data"`

---

## Task 3: Systems studied + library (books + papers)

**Files:** Create `src/data/systems.json`; rewrite `src/data/books.json`, `src/data/papers.json`

- [ ] **Step 1:** `src/data/systems.json`:
```json
[
  { "id": "youtube", "system": "YouTube video processing", "flagship": true, "note": "How a raw upload fans out into a transcode pipeline — chunking, parallel encoding, adaptive-bitrate ladders, and storage." },
  { "id": "financial-data-store", "system": "Financial data-store solutioning", "flagship": true, "note": "Storage design for market/financial data — time-series layout, hot/cold tiers, and query patterns under heavy read load." },
  { "id": "s3", "system": "Amazon S3", "note": "The durability math and the metadata/index layer behind object storage at scale." },
  { "id": "uber", "system": "Uber dispatch", "note": "Geospatial sharding and real-time supply/demand matching." },
  { "id": "dropbox", "system": "Dropbox / Drive sync", "note": "Block-level sync, dedup, and conflict resolution." },
  { "id": "instagram", "system": "Instagram feed", "note": "Fan-out-on-write vs read, and the cost of celebrity accounts." }
]
```

- [ ] **Step 2:** Rewrite `src/data/books.json`:
```json
[
  { "id": "ddia", "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann", "category": "Distributed Systems", "note": "Maps cleanly onto everything I build — storage, replication, consensus, and the trade-offs underneath." },
  { "id": "ai-engineering", "title": "AI Engineering", "author": "Chip Huyen", "category": "AI Systems", "note": "Building real systems around models, not demos." },
  { "id": "dark-matter", "title": "Dark Matter", "author": "Blake Crouch", "category": "Fiction", "note": "Identity and the multiverse, as a thriller." },
  { "id": "the-trial", "title": "The Trial", "author": "Franz Kafka", "category": "Fiction", "note": "Bureaucracy as quiet horror." }
]
```

- [ ] **Step 3:** Rewrite `src/data/papers.json`:
```json
[
  { "id": "gfs", "title": "The Google File System", "authors": "Ghemawat, Gobioff & Leung", "venue": "SOSP 2003", "why": "Reliable storage on unreliable commodity hardware — design for failure as the common case.", "link": "https://research.google/pubs/the-google-file-system/" },
  { "id": "dynamo", "title": "Dynamo: Amazon's Highly Available Key-value Store", "authors": "DeCandia et al.", "venue": "SOSP 2007", "why": "Eventual consistency, quorums, and the engineering of always-on availability.", "link": "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" }
]
```

- [ ] **Step 4:** Validate the three JSON files; `npm run build` (note `/library` still imports books/papers — the new shape drops `coverImage`/`link`/`icon` on Book and changes Paper fields, which WILL break `BookCard`/`PaperCard`/`/library`; that's fine because Task 6 removes them — but to keep THIS task green, do Task 6's removals are sequenced AFTER. **Resequencing note:** if build breaks here on `/library` type errors, proceed to Task 6 immediately, then re-run build. The controller may merge Tasks 3 and 6.) Commit: `git add src/data/systems.json src/data/books.json src/data/papers.json && git commit -m "feat: add studied-systems + real books/papers data"`

---

## Task 4: Interests, anime, field-notes, now, uses

**Files:** Create `src/data/interests.json`, `anime.json`, `fieldnotes.json`, `now.json`, `uses.json`

- [ ] **Step 1:** `src/data/interests.json`:
```json
{
  "f1": { "team": "Mercedes", "drivers": ["Lewis Hamilton", "Max Verstappen"], "note": "Extreme engineering, data-driven decisions, and human limit-testing — performance optimization as a spectator sport." },
  "markets": { "note": "NASDAQ names and market fundamentals — reading the mechanics underneath the price.", "focus": ["NASDAQ", "fundamentals", "crypto"] },
  "sport": { "note": "Table tennis and badminton — fast hands, faster decisions." }
}
```

- [ ] **Step 2:** `src/data/anime.json`:
```json
[
  { "id": "naruto", "title": "Naruto", "kind": "anime" },
  { "id": "one-piece", "title": "One Piece", "kind": "manga" },
  { "id": "haikyuu", "title": "Haikyuu!!", "kind": "anime" },
  { "id": "jjk", "title": "Jujutsu Kaisen", "kind": "anime" }
]
```

- [ ] **Step 3:** `src/data/fieldnotes.json`:
```json
[
  { "id": "fn-001", "number": "001", "title": "Most slow queries are a missing composite index, not a slow database.", "quote": "Read the EXPLAIN before you blame the engine.", "tag": "MySQL" },
  { "id": "fn-002", "number": "002", "title": "MySQL's null-safe equality (<=>) quietly saves you from NULL-comparison bugs.", "quote": "= lies about NULL; <=> tells the truth.", "tag": "MySQL" },
  { "id": "fn-003", "number": "003", "title": "Durable workflows turn 'retry logic' from app code into a platform guarantee.", "quote": "Let the workflow engine remember, so your services don't have to.", "tag": "Temporal" }
]
```

- [ ] **Step 4:** `src/data/now.json`:
```json
{
  "updated": "2026-06",
  "building": "Launching a Substack at the intersection of finance and engineering; rebuilding this site as a living data system.",
  "reading": ["Designing Data-Intensive Applications", "AI Engineering"],
  "watching": "Working through Jujutsu Kaisen.",
  "exploring": "Open to new opportunities in backend & distributed systems."
}
```

- [ ] **Step 5:** `src/data/uses.json` (illustrative — Jayraj to confirm/adjust):
```json
{
  "editor": "VS Code",
  "terminal": "zsh",
  "languages": ["Go", "TypeScript"],
  "datastores": ["MySQL"],
  "note": "Placeholder setup — to be personalized by Jayraj."
}
```

- [ ] **Step 6:** Validate all five JSON files; commit: `git add src/data/interests.json src/data/anime.json src/data/fieldnotes.json src/data/now.json src/data/uses.json && git commit -m "feat: add interests, anime, field-notes, now, uses data"`

---

## Task 5: MDX migration (blog → writing)

**Files:** Create `content/writing/`; delete `content/blog/`; modify `src/lib/blog.ts`

- [ ] **Step 1:** Create `content/writing/finance-meets-engineering.mdx` (one real intro post / clearly-marked first entry):
```mdx
---
title: "Where finance meets engineering"
date: "2026-06-01"
tags: ["FINANCE", "ENGINEERING"]
excerpt: "Why I read order books and consensus papers with the same curiosity — and what this new Substack will dig into."
---

I build backend and distributed systems for a living, and I read the markets for fun. This Substack sits in the overlap: the engineering behind financial systems, and the financial mechanics behind the systems we build.

## The thesis

A matching engine and a consensus protocol are solving cousins of the same problem: agreeing on an ordered truth under contention, fast. Once you see it, you can't unsee it.

## What's coming

Short, technical pieces — storage for market data, the cost of latency, how big systems actually work — written the way I'd explain them to a sharp colleague.
```

- [ ] **Step 2:** Delete the three fictional posts and the old dir: `git rm content/blog/edge-compute-wasm.mdx content/blog/memory-safety-rust.mdx content/blog/obsidian-notebook.mdx`

- [ ] **Step 3:** Update `src/lib/blog.ts` — change the directory constant:
```ts
const BLOG_DIR = path.join(process.cwd(), "content", "writing");
```
(Leave the rest of `blog.ts` unchanged.)

- [ ] **Step 4:** `npm run build` — note `/blog` and `/blog/[slug]` still exist and now read from `content/writing` (one post). Build passes. Lint passes.

- [ ] **Step 5:** Commit: `git add -A content src/lib/blog.ts && git commit -m "feat: migrate content/blog to content/writing with a real first post"`

---

## Task 6: Purge orphaned fictional routes + components

**Files:** Remove `src/app/blog/`, `src/app/library/`, `src/components/{BlogArticle,BookCard,PaperCard,VelocityNugget}.tsx`, `src/data/nuggets.json`; finalize `types.ts`.

- [ ] **Step 1:** Confirm nothing else imports these. Run:
```bash
grep -rn "BlogArticle\|BookCard\|PaperCard\|VelocityNugget\|nuggets.json" src/ || echo "no references outside the files being removed"
```
Expected references only within `src/app/blog/*`, `src/app/library/*`, and the components themselves.

- [ ] **Step 2:** Remove the routes and components:
```bash
git rm -r src/app/blog src/app/library
git rm src/components/BlogArticle.tsx src/components/BookCard.tsx src/components/PaperCard.tsx src/components/VelocityNugget.tsx src/data/nuggets.json
```

- [ ] **Step 3:** Remove the now-unused `VelocityNugget` interface from `src/lib/types.ts` (added back in Task 1's note). Confirm no remaining import of it: `grep -rn "VelocityNugget" src/ || echo "clean"`.

- [ ] **Step 4:** `npm run lint && npm run build` — must pass. The route list should no longer include `/blog`, `/blog/[slug]`, or `/library`; it should include `/`, `/work`, `/writing`, `/interests`, `/about`, `/now`, `/uses`, `/_not-found`. (`/writing/[slug]` arrives in P2.)

- [ ] **Step 5:** Commit: `git add -A && git commit -m "chore: purge orphaned /blog and /library routes + fictional components"`

---

## Task 7: P1 verification gate

- [ ] **Step 1:** `npm run lint` — clean.
- [ ] **Step 2:** `npm test` — 5/5 still pass.
- [ ] **Step 3:** `npm run build` — exports `/`, `/work`, `/writing`, `/interests`, `/about`, `/now`, `/uses` (+ `/_not-found`); NO `/blog` or `/library`.
- [ ] **Step 4:** `grep -rn "jayraj.dev\|1.2M\|Kinetic Energy\|Production Releases\|Lines of Logic" src/ content/ || echo "no fabricated artifacts remain"` — expect the clean message.

**P1 is complete when:** real typed data exists for every section, the MDX desk has a real post, the orphaned fictional routes/components are gone, and the build is green with only the new-IA routes.

---

## Self-Review (against spec §4/§7 + profile.md)
- **§7 data files** — work, experience, systems, books, papers, anime, interests, fieldnotes, now, uses all created/real: ✅ Tasks 2–4. `stats.json` already shipped in P0.
- **MDX migration + purge** — ✅ Tasks 5–6.
- **Disclosure** — `/work` is generic case files; no codenames/Jira keys/repo names/vendor names introduced (verify in review). ✅
- **Honesty** — books/papers/anime/interests are the real lists from profile.md; `uses.json` is flagged illustrative (user to confirm) rather than fabricated as fact. ✅
- **Placeholders** — every file has complete content; `uses.json`'s note is an honest "to personalize," not a code placeholder.
- **Deferred to P2 (not P1 gaps):** rendering all this on real pages; redesigning the home hero/bento and `/interests`; `/writing/[slug]`; removing `HeroSection`/`BentoGrid`/`F1Section`/`FinanceSection`/`PhotoGrid` if unused after the page rebuilds.
