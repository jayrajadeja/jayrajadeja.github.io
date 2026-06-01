# Portfolio Elevation — P4 Polish / SEO / A11y Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Make the site shareable, findable, accessible, and consistent — SEO (sitemap/robots/metadata/OG), a real favicon + social card, a working mobile nav, shared-component cleanup, the deferred a11y/consistency nits, and light reduced-motion-safe motion.

**Tech:** Next.js 16 static export (`output: "export"`). Metadata files (`sitemap.ts`, `robots.ts`, `icon.svg`, `opengraph-image.tsx`) are generated at build and emitted into `out/`. Branch `feat/portfolio-elevation` (PR #3 open). Commit identity: personal gmail. Dev server stopped (safe to build).

**Testing:** `npm run lint` + `npm run build` per task; confirm generated SEO assets land in `out/`; Vitest for any logic. Visual/motion confirmed at runtime.

**Carried-over nits from P0–P3 reviews (addressed here):** section-rule weight inconsistency (/now, /uses vs others); duplicated `Eyebrow`/`SectionHeader`; navbar missing `aria-label` + no mobile menu; `/about` h1 ordering + low-contrast caption; `/uses` provisional-note contrast; `formatGrouped` edge tests; `/interests` static "illustrative" market chips now redundant with the live rail; `now.json` freshness.

---

## Task 1: SEO foundation + brand assets

**Files:** create `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/icon.svg`, `src/app/opengraph-image.tsx`; modify `src/app/layout.tsx` (metadataBase + OG/Twitter defaults); add per-page `description` where missing.

- [ ] **Step 1: `src/app/sitemap.ts`**
```ts
import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";

const BASE = "https://jayrajadeja.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/writing", "/interests", "/about", "/now", "/uses"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const posts = getAllSlugs().map((slug) => ({
    url: `${BASE}/writing/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
```

- [ ] **Step 2: `src/app/robots.ts`**
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://jayrajadeja.github.io/sitemap.xml",
  };
}
```

- [ ] **Step 3: `src/app/layout.tsx` — add `metadataBase` + `openGraph` + `twitter`** to the existing `metadata` object (keep title/template/description as-is):
```ts
  metadataBase: new URL("https://jayrajadeja.github.io"),
  openGraph: {
    title: "Jayraj Jadeja — Software Engineer",
    description: "Backend & distributed systems engineer. I take systems apart to see how they tick.",
    url: "https://jayrajadeja.github.io",
    siteName: "Jayraj Jadeja",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayraj Jadeja — Software Engineer",
    description: "Backend & distributed systems engineer. I take systems apart to see how they tick.",
  },
```

- [ ] **Step 4: `src/app/icon.svg`** (favicon — on-brand terminal mark):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0c0e0f"/>
  <text x="6" y="22" font-family="ui-monospace, monospace" font-size="16" font-weight="700" fill="#4cd6ff">&#8250;</text>
  <rect x="18" y="18" width="8" height="3" rx="1" fill="#ffb4a8"/>
</svg>
```

- [ ] **Step 5: `src/app/opengraph-image.tsx`** (1200×630 social card via `next/og`):
```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Jayraj Jadeja — Software Engineer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: 80, background: "#0c0e0f", color: "#e9eaea",
        }}
      >
        <div style={{ color: "#4cd6ff", fontSize: 30, letterSpacing: 6 }}>jayraj@engineering:~$ whoami</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 20, letterSpacing: -2 }}>Jayraj Jadeja</div>
        <div style={{ fontSize: 38, color: "#8b9095", marginTop: 14 }}>I take systems apart to see how they tick.</div>
        <div style={{ display: "flex", gap: 36, marginTop: 44, fontSize: 26 }}>
          <span style={{ color: "#8b9095" }}><span style={{ color: "#4cd6ff" }}>788</span> issues</span>
          <span style={{ color: "#8b9095" }}><span style={{ color: "#4cd6ff" }}>626</span> PRs</span>
          <span style={{ color: "#ffb4a8" }}>backend · distributed systems</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 6: per-page descriptions** — ensure `/work`, `/writing`, `/interests`, `/about`, `/now`, `/uses` each export a `description` in their `metadata` (add a one-line description where only `title` exists). Home inherits the layout default (correct).

- [ ] **Step 7: Verify + commit.** `npm run lint && npm run build`. Confirm `out/sitemap.xml`, `out/robots.txt`, the favicon, and an `opengraph-image` PNG are emitted: `ls out | grep -iE "sitemap|robots|icon|opengraph"` and `find out -iname "*opengraph*"`.
  **If `opengraph-image.tsx` fails the static export build** (some `next/og` + `output:export` combinations error), report it — fallback: delete `opengraph-image.tsx` and instead set `openGraph.images`/`twitter.images` to a committed static asset later; keep the rest of Task 1. Do NOT let it block sitemap/robots/favicon.
```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/icon.svg src/app/opengraph-image.tsx src/app/layout.tsx src/app/work/page.tsx src/app/writing/page.tsx src/app/interests/page.tsx src/app/about/page.tsx src/app/now/page.tsx src/app/uses/page.tsx
git commit -m "feat: SEO foundation — sitemap, robots, OG/Twitter metadata, favicon, social card"
```

---

## Task 2: Shared components + mobile nav + a11y/consistency

**Files:** create `src/components/Eyebrow.tsx`, `src/components/SectionHeader.tsx`; modify all page files to import them; modify `src/components/Navbar.tsx`; fix `/about` + `/uses` nits.

- [ ] **Step 1: Create `src/components/Eyebrow.tsx`** (the canonical version used across pages):
```tsx
export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create `src/components/SectionHeader.tsx`** (used by /work, /about, /interests — reconcile to ONE divider weight):
```tsx
import Eyebrow from "./Eyebrow";

export default function SectionHeader({
  eyebrow,
  id,
  children,
}: {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 border-b border-outline-variant/30 pb-4 mb-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
        {children}
      </h2>
    </div>
  );
}
```

- [ ] **Step 3: Replace inline copies.** In every page (`src/app/page.tsx`, `work`, `writing`, `interests`, `about`, `now`, `uses`) and anywhere else, remove the locally-defined `Eyebrow`/`SectionHeader` functions and `import Eyebrow from "@/components/Eyebrow"` / `SectionHeader from "@/components/SectionHeader"` instead. Normalize any ad-hoc `border-b-2 border-on-surface` section rules to the shared `SectionHeader` (or `border-b border-outline-variant/30`) so ALL pages — including `/now` and `/uses` — use the same divider weight. Verify with: `grep -rn "function Eyebrow\|function SectionHeader\|border-b-2 border-on-surface" src/app` → should be empty afterward.

- [ ] **Step 4: Navbar a11y + mobile menu** (`src/components/Navbar.tsx`, already `"use client"`):
  - Add `aria-label="Main navigation"` to the `<nav>`.
  - Add a mobile menu: a hamburger `<button>` (visible `md:hidden`, `aria-expanded`, `aria-controls`, `aria-label="Toggle menu"`) that toggles a `useState` boolean; when open, render the `NAV_LINKS` as a vertical list below the bar (mono style, same active logic). Keep the desktop `hidden md:flex` list as-is. Close the menu on link click.

- [ ] **Step 5: `/about` nits** (`src/app/about/page.tsx`):
  - Bump the low-contrast caption(s) from `text-outline/70` → `text-outline` (or `text-on-surface-variant`).
  - Ensure the hero `<section aria-labelledby="...">` references a heading that is an early child (move the `<h1>`/visually-hidden heading before the terminal block, or point `aria-labelledby` at a present early element).

- [ ] **Step 6: `/uses` note** (`src/app/uses/page.tsx`): bump the provisional note contrast (`text-on-surface-variant/60` → `text-on-surface-variant`) so it's clearly legible.

- [ ] **Step 7: Verify + commit.** `npm run lint && npm run build` green; click-test mobile menu in `npm run dev` if possible.
```bash
git add src/components/Eyebrow.tsx src/components/SectionHeader.tsx src/components/Navbar.tsx src/app
git commit -m "refactor: shared Eyebrow/SectionHeader, mobile nav, a11y + divider consistency"
```

---

## Task 3: Light, reduced-motion-safe motion

**Files:** create `src/lib/useCountUp.ts` (client hook) + `src/components/instruments/CountUp.tsx`; apply to the hero/about metric values; add a scroll-in draw to `Sparkline`.

- [ ] **Step 1: `src/components/instruments/CountUp.tsx`** (client; counts up to a target when scrolled into view; respects reduced motion):
```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function CountUp({
  end,
  durationMs = 1200,
  format = (n: number) => n.toLocaleString("en-US"),
  className,
}: {
  end: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setValue(end); return; }
    const el = ref.current;
    if (!el) { setValue(end); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(end * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, durationMs]);

  return <span ref={ref} className={className}>{format(value)}</span>;
}
```

- [ ] **Step 2: Apply `CountUp`** in `StatsSection` (home band) and `/about` "by the numbers" headline grid — wrap the numeric metric values (issues, PRs, lines, etc.) in `<CountUp end={…} />`. Keep non-numeric values (e.g. `5+`, percentages-with-suffix) as plain text. The initial server render shows `0`→ animates client-side; under reduced-motion it jumps straight to the value (no flash of wrong data is acceptable since these are decorative counts, but prefer rendering the final value server-side and only animating after mount if you can do it without hydration mismatch — simplest compliant approach: render `0` initially and let the effect set the value; reduced-motion sets it immediately on mount).

- [ ] **Step 3: `Sparkline` scroll-in draw** (`src/components/instruments/Sparkline.tsx`): add a CSS stroke-dash draw-in animation (animate `stroke-dashoffset` from full to 0) gated behind `@media (prefers-reduced-motion: no-preference)`; under reduced-motion the line is simply shown. Add the keyframes to `globals.css` (e.g. `.sparkline-draw`) and apply the class on the `<polyline>`. (Pure CSS — no JS needed; the line draws on first paint.)

- [ ] **Step 4: Verify + commit.** `npm run lint && npm run build`. Confirm reduced-motion path (no animation) is the fallback.
```bash
git add src/components/instruments/CountUp.tsx src/components/StatsSection.tsx src/app/about/page.tsx src/components/instruments/Sparkline.tsx src/app/globals.css
git commit -m "feat: reduced-motion-safe count-up metrics + sparkline draw-in"
```

---

## Task 4: Nits, dead-link sweep, verify + final review

- [ ] **Step 1: `/interests` decorative market chips** — the static `AAPL/QQQ/NVDA` `TickerChip` row + sparkline (labeled "illustrative") is now redundant with the live sitewide ticker rail. **Remove** that decorative block from the Markets section (keep the `interests.markets.note` + focus chips). Confirms one source of market truth (the live rail).
- [ ] **Step 2: `formatGrouped` edge tests** (`src/lib/format.test.ts`) — add `expect(formatGrouped(0)).toBe("0")` and `expect(formatGrouped(42)).toBe("42")`.
- [ ] **Step 3: `now.json` freshness** — the rendered `updated` is fine; no change needed unless stale. (Leave as-is; the field exists for future updates.)
- [ ] **Step 4: Dead-link / asset sweep** — `grep -rniE "href=\"#\"|jayraj\.dev|aida-public|googleusercontent|download portfolio" src/` → expect none. Confirm résumé (Drive), email, GitHub/LinkedIn/Substack links resolve.
- [ ] **Step 5: Full gate** — `npm run lint`, `npm test`, `npm run build`; confirm `out/` has `sitemap.xml`, `robots.txt`, favicon, opengraph image (or the documented fallback).
- [ ] **Step 6: Final P4 review (subagent)** — SEO assets present + valid; static-export safe; reduced-motion respected; a11y (nav landmark + mobile menu + contrast); consistency (one Eyebrow/SectionHeader, uniform dividers); no dead links/fabrication. Commit any fixes.
```bash
git add -A && git commit -m "chore: remove redundant /interests market chips; formatGrouped tests; P4 sweep"
```

**P4 complete when:** sitemap/robots/OG/favicon ship in `out/`, the mobile nav works, components are deduplicated and dividers consistent, motion is tasteful + reduced-motion-safe, and lint/test/build are green with no dead links.

---

## Self-Review (against spec §8/§10/§12 + carried nits)
- SEO (sitemap, robots, metadata, OG) + favicon: ✅ Task 1.
- Shared components + divider consistency + nav a11y/mobile + contrast nits: ✅ Task 2.
- Motion + reduced-motion (spec §8): ✅ Task 3.
- Redundant chips, formatGrouped tests, dead-link sweep: ✅ Task 4.
- Deferred to P5: AGENTS.md, CLAUDE.md, knowledge base, llms.txt.
- Risk: `next/og` + `output:export` — Task 1 Step 7 documents the graceful fallback if image generation can't export.
