# Portfolio Elevation — P6 Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Apply all high-value fixes from the 2026-06-02 whole-codebase audit — real a11y gaps, cleanup/DRY, correctness hardening, and SEO/perf — without changing the design or behavior. Branch `feat/p6-audit-fixes` off `master`. Commit identity: personal gmail. Verify each task with `npm run lint` + `npm run build` (+ `npm test`); dev server is stopped.

**Context:** the site is a Next.js 16 static-export portfolio (P0–P5 complete, deployed). This phase is polish/hardening only.

---

## Task 1 — Accessibility

**Files:** `package.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/Navbar.tsx`, `src/app/page.tsx`, `src/app/writing/page.tsx`, `src/components/instruments/{TerminalBlock,StatusDot,TickerRail}.tsx`.

- [ ] **Typography plugin** (blog posts currently render unstyled): `npm install -D @tailwindcss/typography`, then add `@plugin "@tailwindcss/typography";` near the top of `globals.css` (after `@import "tailwindcss";`). Verify `/writing/finance-meets-engineering` body now has prose styling.
- [ ] **Global `:focus-visible`** — add to `globals.css`:
```css
:focus-visible {
  outline: 2px solid var(--color-tertiary);
  outline-offset: 3px;
  border-radius: 2px;
}
```
- [ ] **Skip link** — in `layout.tsx`, make the first child of `<body>` a skip link, and add `id="main-content"` to `<main>`:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-sm font-mono text-sm">Skip to content</a>
```
- [ ] **`<time dateTime>`** — add `dateTime={post.date}` to the `<time>` in `src/app/page.tsx` (latest-writing) and `src/app/writing/page.tsx` (post list).
- [ ] **`aria-hidden` on decorative** — `TerminalBlock.tsx` the 3 traffic-light dots; `StatusDot.tsx` the colored dot; `writing/page.tsx` the `⊕` glyph; `TickerRail.tsx` mark the duplicated marquee so the ticker data isn't announced twice (simplest: `aria-hidden` the inner `.ticker-marquee` container and rely on the outer `div`'s existing `aria-label`).
- [ ] **Mobile menu Escape** — in `Navbar.tsx`, when the mobile menu is open, close it on `Escape` (an `onKeyDown` on the nav, or a keydown effect), and return focus to the toggle button.
- [ ] **Contrast** — bump the muted token in `globals.css`: `--color-outline: #9aa0a1;` (from `#8e9192`) so 10–11px captions clear WCAG AA on the `#0c0e0f` canvas. (One token change; affects all `text-outline` captions.)

- [ ] Verify: `npm run lint && npm run build` green; the skip link appears on Tab; blog post is styled. Commit: `git commit -m "a11y: typography plugin, focus-visible, skip link, time/aria, mobile-esc, contrast"`

---

## Task 2 — Cleanup & DRY

**Files:** `package.json`, `src/app/globals.css`, `src/lib/smoke.test.ts` (delete), `README.md`, new `src/lib/site.ts`, `src/components/StatsSection.tsx`, `src/app/page.tsx`, `src/app/about/page.tsx`, `src/components/Navbar.tsx`, `src/app/opengraph-image.tsx`, `src/lib/types.ts`.

- [ ] **Remove dead dep:** `npm uninstall next-mdx-remote` (never imported).
- [ ] **Remove dead CSS:** delete the `.kinetic-gradient`, `.velocity-grid`, and `.glass-effect` rules from `globals.css` (0 usages). Keep `.ticker-marquee` + `.sparkline-draw`.
- [ ] **Delete `src/lib/smoke.test.ts`** (no-value placeholder; real coverage is `format.test.ts` + `parse-feeds.test.mjs`).
- [ ] **Update `README.md`:** fix the structure table — `content/writing/` (not blog), real routes (home, work, writing, interests, about, now, uses), real data files; drop "Library"/"nuggets".
- [ ] **Create `src/lib/site.ts`** with shared constants + helper:
```ts
import stats from "@/data/stats.json";

export const SITE_URL = "https://jayrajadeja.github.io";
export const RESUME_URL =
  "https://drive.google.com/file/d/1tleUFEbGJ4Se847v0RVS3qQ_4kZL-dS0/view?usp=sharing";

export function statValue(label: string): number {
  return stats.headline.find((h) => h.label === label)?.value ?? 0;
}
```
  Then replace the tripled `metric()`/`metricVal()` local helpers in `page.tsx`, `about/page.tsx`, `StatsSection.tsx` with `statValue` from `@/lib/site`; replace the hardcoded résumé URL in `Navbar.tsx` + `about/page.tsx` with `RESUME_URL`.
- [ ] **OG image from data:** in `opengraph-image.tsx`, import `statValue` and render `statValue("issues delivered")` / `statValue("pull requests")` instead of the hardcoded `788`/`626`.
- [ ] **Remove `unit: undefined`** entries from `HEADLINE_METRICS` in `about/page.tsx` (keep `unit` only where it has a value, e.g. median cycle time).
- [ ] **Add `StatsJson` interface** to `types.ts` documenting `stats.json` (`tenureYears: string`, `headline: { label: string; value: number; pct?: number }[]`, `cadence: { issuesPerYear: number; prsPerMonth: number }`, `issuesByYear`, `prsByYear`, `issuesByType`, `source`, `domain`, `asOf`). (Leave the other `as Type[]` JSON casts as-is — `satisfies` fights JSON literal-union inference, e.g. `AnimeEntry.kind`; not worth the churn.)

- [ ] Verify: `npm run lint && npm test && npm run build` green. Commit: `git commit -m "chore: remove dead dep/CSS/test, fix README, extract site constants + stat helper, type stats.json"`

---

## Task 3 — Correctness hardening

**Files:** `src/lib/blog.ts`, `scripts/fetch-data.mjs`, `src/components/instruments/CountUp.tsx`, `package.json`.

- [ ] **Date-sort guard** (`blog.ts`): handle empty/invalid dates so they sort last instead of NaN-anywhere:
```ts
return posts.sort((a, b) => {
  const ta = a.date ? new Date(a.date).getTime() : 0;
  const tb = b.date ? new Date(b.date).getTime() : 0;
  return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
});
```
- [ ] **Guard `markets.json` parse** (`fetch-data.mjs`): wrap the `JSON.parse(readFileSync(marketsPath))` in try/catch; on failure, log and `return` (skip the stocks write) so a corrupt snapshot can't propagate / break the build.
- [ ] **CountUp unmount cancel** (`CountUp.tsx`): add a `cancelled` flag (ref or closure) so the `requestAnimationFrame` tick stops on unmount (check it at the top of `tick`; set it in the effect cleanup alongside `io.disconnect()`).
- [ ] **Next patch bump:** `npm install next@^16.2.6 eslint-config-next@^16.2.6` (clears the `npm audit` advisories; static export is unaffected by the server-only CVEs, but it's clean hygiene). Confirm the build still passes on the new patch.

- [ ] Verify: `npm run lint && npm test && npm run build` green; `npm audit` shows fewer/zero prod advisories. Commit: `git commit -m "fix: guard blog date sort + markets.json parse, cancel CountUp on unmount, bump next"`

---

## Task 4 — SEO & performance

**Files:** `src/app/layout.tsx`, `src/app/writing/[slug]/page.tsx`, each page's `metadata` (canonical), `src/app/layout.tsx` (Material Symbols link).

- [ ] **Canonical URLs:** add `alternates: { canonical: "/" }` to the root `metadata` in `layout.tsx`; add `alternates: { canonical: "/<route>" }` to each page's `metadata` (`work`, `writing`, `interests`, `about`, `now`, `uses`); and `alternates: { canonical: \`/writing/${slug}\` }` in the `[slug]` `generateMetadata`.
- [ ] **Per-post OG url:** in `[slug]/generateMetadata`, add `openGraph: { url: \`${SITE_URL}/writing/${slug}\`, title: post.title, description: post.excerpt, type: "article" }` (import `SITE_URL` from `@/lib/site`).
- [ ] **JSON-LD:** in `layout.tsx`, render a `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }} />` in `<body>` with a `Person` (name, url, sameAs: [GitHub, LinkedIn, Substack], jobTitle) + `WebSite` graph. In `[slug]/page.tsx`, render a `BlogPosting` JSON-LD script (headline, datePublished, author, url). Keep the JSON minimal + accurate (no fabricated fields).
- [ ] **Material Symbols subset:** in `layout.tsx`, (a) add `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />`, and (b) change the Material Symbols `<link>` to request ONLY the icons actually used — grep `material-symbols-outlined` usages to get the exact set (expected: `code, description, edit_note, mail, north_east, work`) and append `&icon_names=code,description,edit_note,mail,north_east,work` to the font URL (and pin a single `wght@300`). Verify the icons still render on `/about` + `/interests`.

- [ ] Verify: `npm run build`; confirm `out/` HTML contains `<link rel="canonical">`, the JSON-LD `<script>`, and per-post OG url; icons still render. Commit: `git commit -m "feat: JSON-LD + canonical + per-post OG, subset Material Symbols"`

---

## Task 5 — Verify + final review

- [ ] `npm run lint` clean · `npm test` green · `npm run build` green (all routes + SEO assets).
- [ ] Sweep: no dead CSS/dep left (`grep -rn "next-mdx-remote\|kinetic-gradient\|velocity-grid\|glass-effect" src package.json`), README accurate, `:focus-visible` present, typography plugin active, JSON-LD + canonical in `out/`.
- [ ] Final review (subagent): confirm each audit item is addressed, nothing regressed, build green, no fabrication. Commit any fixes.
- [ ] Push branch + open PR (base `master`).

**P6 complete when:** all four fix groups are applied, verified green, and the audit's high-value items are resolved.

---

## Self-Review (against the audit)
- 🔴 a11y (typography, focus-visible, skip-link, time/aria, mobile-esc, contrast): Task 1.
- 🧹 cleanup/DRY (dead dep/CSS/test, README, metric helper, RESUME_URL, OG-from-data, unit noise, StatsJson): Task 2.
- 🛡️ correctness (date guard, markets parse guard, CountUp cancel, next bump): Task 3.
- 📈 SEO/perf (JSON-LD, canonical, per-post OG, Material Symbols subset): Task 4.
- Deliberately NOT doing: broad `satisfies` migration (fights JSON inference), HTTP security headers (impossible on GitHub Pages), SHA-pinning first-party Actions (acceptable as-is) — documented as non-actionable in the audit.
