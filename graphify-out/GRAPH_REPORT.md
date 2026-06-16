# Graph Report - .  (2026-06-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 242 nodes · 363 edges · 17 communities (13 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3809ceb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Eyebrow()` - 10 edges
3. `getAllPosts()` - 8 edges
4. `scripts` - 7 edges
5. `getPostBySlug()` - 7 edges
6. `statValue()` - 7 edges
7. `fetchF1()` - 5 edges
8. `SectionHeader()` - 5 edges
9. `getAllSlugs()` - 5 edges
10. `fetchStocks()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Page()` --calls--> `NotFound()`  [INFERRED]
  src/app/writing/[slug]/page.tsx → src/app/not-found.tsx
- `OpengraphImage()` --calls--> `statValue()`  [EXTRACTED]
  src/app/opengraph-image.tsx → src/lib/site.ts
- `HomePage()` --calls--> `getAllPosts()`  [EXTRACTED]
  src/app/page.tsx → src/lib/blog.ts
- `sitemap()` --calls--> `getAllPosts()`  [EXTRACTED]
  src/app/sitemap.ts → src/lib/blog.ts
- `generateStaticParams()` --calls--> `getAllSlugs()`  [EXTRACTED]
  src/app/writing/[slug]/opengraph-image.tsx → src/lib/blog.ts

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (36): metadata, NotFound(), Eyebrow(), SectionHeader(), anime, books, compact, f1 (+28 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (17): TerminalBlock(), Block, CHIPS, TONE_CLASS, CAT_FILES, Command, CommandResult, COMMANDS (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (15): jetbrainsMono, metadata, newsreader, spaceGrotesk, NAV_LINKS, TickerChip(), CRYPTO_IDS, markets (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (13): HEADLINE_METRICS, maxCreated, maxMerged, maxTypeCount, metadata, VARIANTS, Footer(), PAGE_LINKS (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (16): HomePage(), sitemap(), BLOG_DIR, buildPost(), getAllPosts(), getAllSlugs(), getPostBySlug(), sortByDateDesc() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (11): OpengraphImage(), size, CaseFiles, HERO_METRICS, Now, STATS, StatsSection(), Metric() (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (17): dependencies, gray-matter, next, react, react-dom, remark, remark-html, name (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.36
Nodes (9): DATA, fetchF1(), fetchStocks(), getJson(), main(), STOCK_SYMBOLS, parseFinnhubQuote(), parseJolpicaLastRace() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @tailwindcss/typography, @types/node, @types/react (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): building, exploring, reading, updated, watching

## Knowledge Gaps
- **111 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Eyebrow()` connect `Community 0` to `Community 3`, `Community 6`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `statValue()` connect `Community 6` to `Community 3`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `getAllPosts()` connect `Community 4` to `Community 0`, `Community 6`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0636734693877551 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11333333333333333 - nodes in this community are weakly interconnected._