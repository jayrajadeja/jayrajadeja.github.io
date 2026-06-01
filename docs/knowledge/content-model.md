# Content Model

Schema reference for all site data. When adding or editing content, use these shapes exactly.

---

## JSON Data Files (`src/data/`)

### `work.json` — `WorkCaseFile[]`
Case files for the `/work` page. Each entry is an interview-defensible project.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | kebab-case slug |
| `title` | `string` | Project display name |
| `summary` | `string` | One-paragraph plain-text description |
| `stack` | `string[]` | Tech tags (e.g. `["Go", "Temporal", "event-driven"]`) |
| `tags` | `string[]` | Thematic tags (e.g. `["distributed-systems", "workflows"]`) |

Example entry:
```json
{
  "id": "workflow-as-a-service",
  "title": "Workflow-as-a-Service on Temporal",
  "summary": "Durable, event-driven workflow orchestration...",
  "stack": ["Go", "Temporal", "event-driven"],
  "tags": ["distributed-systems", "workflows"]
}
```

Page consumer: `/work`

---

### `experience.json` — `ExperienceEntry[]`
Professional timeline for the about/experience section.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | kebab-case slug |
| `org` | `string` | Employer name |
| `title` | `string` | Role title |
| `start` | `string` | `"YYYY"` or `"YYYY-MM"` |
| `end` | `string \| null` | `null` = current role |
| `location` | `string` | City or empty string |
| `summary` | `string` | One-sentence description |

Page consumer: `/work` (experience timeline).

---

### `systems.json` — `StudiedSystem[]`
Systems Jayraj has studied (curiosity, NOT employment — label accordingly).

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | kebab-case |
| `system` | `string` | System name |
| `flagship` | `boolean?` | Omit or `false` for non-featured; `true` for 2–3 highlighted entries |
| `note` | `string` | One-sentence study note |

Page consumer: `/interests` or systems section.

---

### `books.json` — `Book[]`
Reading list for the shelf section of `/interests`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | kebab-case |
| `title` | `string` | Full title |
| `author` | `string` | Author name(s) |
| `category` | `string` | e.g. `"Distributed Systems"`, `"Fiction"` |
| `note` | `string` | Personal take — 1–2 sentences |

Page consumer: `/interests` (the shelf section)

---

### `papers.json` — `ResearchPaper[]`
Research papers for the shelf section of `/interests`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | kebab-case |
| `title` | `string` | Paper title |
| `authors` | `string` | Author string (plain text) |
| `venue` | `string` | Conference + year (e.g. `"SOSP 2003"`) |
| `why` | `string` | Why it matters — 1 sentence |
| `link` | `string` | Canonical URL to PDF/abstract |

Page consumer: `/interests` (the shelf section)

---

### `anime.json` — `AnimeEntry[]`
Anime/manga watchlist for the interests page.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | kebab-case |
| `title` | `string` | Series title |
| `kind` | `"anime" \| "manga"` | Media type |

Page consumer: `/interests`

---

### `interests.json` — `InterestsData` (singleton object)
Structured personal interests. A single JSON object, not an array.

| Field | Shape | Notes |
|-------|-------|-------|
| `f1.favoriteTeam` | `string` | e.g. `"Mercedes"` |
| `f1.favoriteDrivers` | `string[]` | |
| `f1.note` | `string` | Display copy |
| `markets.note` | `string` | Display copy |
| `markets.focus` | `string[]` | e.g. `["NASDAQ", "fundamentals", "crypto"]` |
| `sport.note` | `string` | Display copy |

Page consumer: `/interests`

---

### `fieldnotes.json` — `FieldNote[]`
Short technical observations (the "Field Notes" section).

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | `"fn-NNN"` |
| `number` | `string` | Zero-padded display number e.g. `"001"` |
| `title` | `string` | The observation/finding (1 sentence) |
| `quote` | `string` | Pithy takeaway — shown as a pull quote |
| `tag` | `string` | Technology tag e.g. `"MySQL"`, `"Temporal"` |

Page consumer: Writing / home / dedicated section.

---

### `now.json` — `NowData` (singleton object)
"What I'm doing now" — update manually every few weeks.

| Field | Type | Notes |
|-------|------|-------|
| `updated` | `string` | `"YYYY-MM"` |
| `building` | `string` | Current project(s) |
| `reading` | `string[]` | Active reading list |
| `watching` | `string` | Current show / anime |
| `exploring` | `string` | Open-ended note (opportunities, topics) |

Page consumer: `/now` or home "now" widget.

---

### `uses.json` — `UsesData` (singleton object)
Dev setup for the `/uses` page.

| Field | Type | Notes |
|-------|------|-------|
| `editor` | `string` | e.g. `"VS Code"` |
| `terminal` | `string` | e.g. `"zsh"` |
| `languages` | `string[]` | Primary languages |
| `datastores` | `string[]` | Primary databases |
| `note` | `string` | Free-form additional notes |

Page consumer: `/uses`

---

### `stats.json` — (no exported interface; used directly)
Verified contribution metrics from Jira + GitHub. Source of truth for the career stats section. Contains `domain` (one-line role description), `tenureYears` (e.g. `"5+"`), `headline[]` (label/value/pct tuples), `cadence`, `issuesByYear[]`, `prsByYear[]`, and `issuesByType[]`. Do not edit without re-running the portfolio export — these numbers are real and auditable.

Page consumer: About / career stats display.

---

### `markets.json` — (no exported interface; consumed by `TickerRail`)
Build-time stock snapshot + live crypto fallback data. Shape:

```json
{
  "asOf": "YYYY-MM-DD",
  "source": "seed | build",
  "stocks": [{ "symbol": "NVDA", "price": 0, "changePct": 2.41 }],
  "crypto": [{ "symbol": "BTC", "price": 0, "changePct": 3.1 }]
}
```

`source: "build"` means fetched via Finnhub at build time. `source: "seed"` means committed fallback. Page consumer: `TickerRail` (site-wide footer ticker). Do not edit manually; managed by `scripts/fetch-data.mjs`.

---

### `f1.json` — `F1Data` (singleton object)
Latest F1 race result and championship leader. Built by `scripts/fetch-data.mjs`.

| Field | Type | Notes |
|-------|------|-------|
| `asOf` | `string` | `"YYYY-MM-DD"` — date of last fetch |
| `source` | `string` | `"build"` |
| `lastRace` | object or `null` | `{ round, season, name, date, winner \| null }` |
| `leader` | object or `null` | `{ driver, points, wins, constructor \| null }` |

Page consumer: `/interests` F1 section. Do not edit manually.

---

## MDX Frontmatter (`content/writing/*.mdx`)

All blog posts live in `content/writing/` as `.mdx` files. The slug is the filename without `.mdx`.

Required frontmatter fields (parsed by `gray-matter` in `src/lib/blog.ts`):

| Field | Type | Notes |
|-------|------|-------|
| `title` | `string` | Post title — displayed as heading and in list |
| `date` | `string` | `"YYYY-MM-DD"` — used for sort order (descending) |
| `tags` | `string[]` | Display tags, e.g. `["FINANCE", "ENGINEERING"]` |
| `excerpt` | `string` | One-sentence teaser shown in post list |

`content` (the MDX body) is passed through `remark` + `remark-html` for rendering.

Example frontmatter:
```mdx
---
title: "Where finance meets engineering"
date: "2026-06-01"
tags: ["FINANCE", "ENGINEERING"]
excerpt: "Why I read order books and consensus papers with the same curiosity."
---
```

MDX body is standard Markdown. No special components are required, but keep the voice consistent — see `docs/knowledge/voice.md`.
