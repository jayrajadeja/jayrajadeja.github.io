# Portfolio Elevation — P7 Audit Fixes (Round 2) Implementation Plan

> **For agentic workers:** applied inline (subagent dispatch optional). Steps are checkbox-tracked.

**Goal:** Apply the "high-value + polish" findings from the round-2 multi-lens audit. No design changes. Stacked on `feat/p6-audit-fixes` (extends PR #6). Verify each group with `npm run lint` + `npm test` + `npm run build`.

**Context:** The round-2 audit (7 parallel lenses) returned **no criticals**; honesty, security, and contrast came back clean and the P6 fixes hold. The items below are genuine improvements + low-risk polish. Pure nits were explicitly de-scoped by the user.

---

## Task 1 — Correctness & data accuracy
- `scripts/parse-feeds.mjs` `parseJolpicaStandingsLeader`: finite-guard `points`/`wins` — return `null` when non-finite (mirrors `parseFinnhubQuote`), so a malformed Jolpica row can't serialize `NaN`→`null` and render literal "null pts / null wins" on `/interests`. Add a `parse-feeds.test.mjs` case.
- `src/components/instruments/TickerRail.tsx`: make the visible label + `aria-label` reflect the actual data source — when only crypto is live (stocks still seed), don't stamp the stale `as of <markets.asOf>`; drop the hardcoded "stocks/F1 as of last build" and the F1 mention (F1 isn't in this rail).

Commit: `fix: guard F1 numeric parse, accurate ticker source labels`

## Task 2 — Type-safety & tests
- `src/lib/site.ts`: `export const stats: StatsJson = statsData;` (single typed import of `stats.json`); `statValue` uses it. Switch `page.tsx`, `StatsSection.tsx`, `about/page.tsx` to import `{ stats }` from `@/lib/site` (realizes `StatsJson` so a `stats.json` drift fails the build).
- `src/lib/blog.ts`: extract pure `sortByDateDesc(posts)`; `getAllPosts` uses it.
- Add `src/lib/site.test.ts` (statValue: known label → its value; missing → 0) and `src/lib/blog.test.ts` (sortByDateDesc: descending order; malformed/empty date sorts last, stable).

Commit: `chore: apply StatsJson type + add blog/stat tests`

## Task 3 — Performance
- `src/app/layout.tsx`: Material Symbols `&display=swap` → `&display=block` (removes the icon ligature-word flash before glyphs load). `next/font` text fonts stay `swap`.
- `src/components/instruments/TickerRail.tsx`: `sessionStorage` TTL (~90s) cache around the CoinGecko fetch (avoids per-navigation keyless rate-limit throttling).

Commit: `perf: icon-font display=block + sessionStorage cache for ticker`

## Task 4 — Accessibility polish
- `src/components/StatsSection.tsx`: label the region (`sr-only` `<h2 id>` + `aria-labelledby`); convert the metric grid to a `<dl>` (`<dd>` value, `<dt>` label) for programmatic value/label association.
- `src/app/about/page.tsx`: metric grid → `<dl>` (`<dt>` label, `<dd>` value).
- `src/app/page.tsx` + `src/app/writing/page.tsx`: wrap the post lists in `<ul>`/`<li>` (consistent with field-notes/work lists).

Commit: `a11y: label stats region, dl association, list semantics`

## Task 5 — SEO completeness
- `src/app/writing/[slug]/page.tsx` `generateMetadata`: add `openGraph.images` (site OG image) + `openGraph.publishedTime` + a `twitter` card (`summary_large_image`, post title/excerpt/image) so posts unfurl with an image and the correct per-post text. BlogPosting JSON-LD: add `image`, `dateModified`, `mainEntityOfPage`. (Use the actual built OG-image URL — confirm from `out/` first.)
- `src/app/sitemap.ts`: add `lastModified` (build date for static pages, post `date` for posts; switch to `getAllPosts`).

Commit: `feat: post OG/Twitter cards + article metadata, sitemap lastmod`

## Task 6 — Verify + push
- `npm run lint` + `npm test` + `npm run build` green; confirm in `out/`: post `og:image` + `twitter:image` present, sitemap `<lastmod>` present, icons still render.
- Push (updates PR #6); refresh the PR body to cover round 2.

---

## De-scoped (nits, per user)
`Math.max([])` empty-guard · drop unused `formatCompact`/`formatGrouped` · `statPct` dedup · `noUncheckedIndexedAccess` · `npm audit fix` (dev-only) · SHA-pin Actions + Dependabot · `og:locale` · web manifest · trim `markets.json`'s non-rendered "P3" note.
