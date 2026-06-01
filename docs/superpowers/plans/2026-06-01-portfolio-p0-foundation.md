# Portfolio Elevation — P0 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the "living data system" foundation — design tokens, the third (mono) font, the global chrome (ticker rail, command nav, telemetry footer), the core instrument-kit primitives, the full route skeleton, and the canonical `profile.md` — so the site builds clean and the new information architecture is real and navigable.

**Architecture:** Evolve the existing Material Design 3 dark theme in-place (Tailwind v4 `@theme`). Add JetBrains Mono as `--font-mono` via `next/font`. Presentational instrument components consume static seed data (`src/data/markets.json`) — live fetching arrives in P3. Most UI is server-rendered; only `Navbar` is a client component (unchanged). All seven routes exist as themed pages (stubs where content lands later).

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), React 19, Tailwind v4, TypeScript (strict), Vitest (logic tests only).

**Spec:** `docs/superpowers/specs/2026-06-01-portfolio-elevation-design.md` (§4 profile, §8 design system, §10 architecture, §11 profile.md, §12 P0).

**Branch:** `feat/portfolio-elevation` (already checked out).

**Testing strategy:**
- **Logic** (`src/lib/*`): Vitest, true TDD (test → fail → implement → pass).
- **UI** (components, pages): `npm run lint` + `npm run build` (static export of every route must succeed) + a visual check in `npm run dev`. No unit tests for presentational components.
- **Build gate:** `npm run build` must pass at the end of every task that touches app code.

---

## File Structure (what P0 creates / modifies)

**Create:**
- `vitest.config.ts` — Vitest config with `@/` alias.
- `src/lib/format.ts` — pure formatters (delta, compact, grouped) used by all instruments.
- `src/lib/format.test.ts` — unit tests for the formatters.
- `src/components/instruments/TerminalBlock.tsx` — terminal window chrome wrapper.
- `src/components/instruments/TickerChip.tsx` — one `SYMBOL ▲x.xx%` chip.
- `src/components/instruments/TickerRail.tsx` — the global marquee rail (CSS-animated, server component).
- `src/components/instruments/Metric.tsx` — labelled mono metric.
- `src/components/instruments/StatusDot.tsx` — status indicator with dot.
- `src/components/instruments/Sparkline.tsx` — inline SVG sparkline.
- `src/data/markets.json` — seed market data (placeholder baseline; replaced by real data in P3).
- `src/app/work/page.tsx`, `src/app/writing/page.tsx`, `src/app/about/page.tsx`, `src/app/now/page.tsx`, `src/app/uses/page.tsx` — themed route stubs.
- `docs/knowledge/profile.md` — canonical profile (single source of truth).

**Modify:**
- `package.json` — add Vitest dev dep + `test` scripts.
- `src/app/globals.css` — add `--font-mono`, `--color-up`, `--color-down`, deepen canvas, add `.ticker-marquee` CSS.
- `src/app/layout.tsx` — load JetBrains Mono; wire `TickerRail`; update metadata to the real spine.
- `src/components/Navbar.tsx` — new 7-route IA, command styling, real résumé link.
- `src/components/Footer.tsx` — honest telemetry footer with real social links.

**Left untouched in P0 (migrated/removed in P1–P2):** `src/app/blog/*`, `src/app/library/*`, `content/blog/*`, and the existing fictional section components. They still build; they are simply not linked from the new nav.

---

## Task 1: Set up Vitest for logic tests

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/smoke.test.ts`

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: adds `vitest` to `devDependencies`, no errors.

- [ ] **Step 2: Add test scripts to `package.json`**

In the `"scripts"` block, add `test` and `test:watch` so it reads:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

- [ ] **Step 4: Create a smoke test**

`src/lib/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("vitest harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run and verify it passes**

Run: `npm test`
Expected: PASS — 1 test passed.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/smoke.test.ts
git commit -m "test: set up Vitest for logic tests"
```

---

## Task 2: Formatter utilities (TDD)

The instrument kit needs consistent number/ticker formatting. Pure functions — ideal for TDD.

**Files:**
- Create: `src/lib/format.test.ts`
- Create: `src/lib/format.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { deltaDirection, formatDelta, formatCompact, formatGrouped } from "@/lib/format";

describe("deltaDirection", () => {
  it("classifies sign", () => {
    expect(deltaDirection(2.41)).toBe("up");
    expect(deltaDirection(-0.62)).toBe("down");
    expect(deltaDirection(0)).toBe("flat");
  });
});

describe("formatDelta", () => {
  it("prefixes an arrow and two decimals", () => {
    expect(formatDelta(2.41)).toBe("▲2.41%");
    expect(formatDelta(-0.62)).toBe("▼0.62%");
    expect(formatDelta(0)).toBe("■0.00%");
  });
});

describe("formatCompact", () => {
  it("scales to K/M/B", () => {
    expect(formatCompact(950)).toBe("950");
    expect(formatCompact(2500)).toBe("2.5K");
    expect(formatCompact(1024873)).toBe("1.02M");
    expect(formatCompact(3200000000)).toBe("3.20B");
  });
});

describe("formatGrouped", () => {
  it("adds thousands separators", () => {
    expect(formatGrouped(1024873)).toBe("1,024,873");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/format` / functions undefined.

- [ ] **Step 3: Implement `src/lib/format.ts`**

```ts
export type Direction = "up" | "down" | "flat";

export function deltaDirection(pct: number): Direction {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "flat";
}

export function formatDelta(pct: number): string {
  const arrow = pct > 0 ? "▲" : pct < 0 ? "▼" : "■";
  return `${arrow}${Math.abs(pct).toFixed(2)}%`;
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatGrouped(n: number): string {
  return n.toLocaleString("en-US");
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS — all formatter tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/format.ts src/lib/format.test.ts
git commit -m "feat: add ticker/number formatters with tests"
```

---

## Task 3: Evolve the design tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Deepen the canvas**

In the `@theme` block, change these three lines from `#131313` to `#0c0e0f`:

```css
  --color-surface: #0c0e0f;
  --color-surface-dim: #0c0e0f;
```
```css
  --color-background: #0c0e0f;
```

- [ ] **Step 2: Add market colors**

In the `@theme` block, immediately after the `--color-error-container` / `--color-on-error-container` lines, add:

```css
  --color-up: #3ddc84;
  --color-on-up: #00210f;
  --color-down: #ff6b6b;
  --color-on-down: #2b0000;
```

- [ ] **Step 3: Add the mono font token**

In the `@theme` block, alongside the existing `--font-*` lines, add:

```css
  --font-mono: "JetBrains Mono", monospace;
```

- [ ] **Step 4: Add the ticker marquee + reduced-motion CSS**

At the end of `globals.css` (after `.glass-effect`), add:

```css
.ticker-marquee {
  animation: ticker-scroll 40s linear infinite;
}

@keyframes ticker-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-marquee {
    animation: none;
  }
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: PASS — compiles and statically exports all existing routes.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "style: deepen canvas, add market colors, mono token, marquee"
```

---

## Task 4: Load JetBrains Mono and update the root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerRail from "@/components/instruments/TickerRail";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JAYRAJ JADEJA | Software Engineer",
    template: "%s | J. JADEJA",
  },
  description:
    "Backend & distributed systems engineer at SAFE Security. I take systems apart to see how they tick — Temporal workflows, multi-region data movement, event-driven scaling, and the markets underneath.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
        <Navbar />
        <TickerRail />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: FAIL — `@/components/instruments/TickerRail` does not exist yet. (Expected; created in Task 6.) Proceed to Task 5–6, then this resolves.

> Note for the executor: Tasks 4, 5, and 6 form one buildable unit. Do not run the final build gate until Task 6 is complete. Commit Task 4 after Task 6's build passes, or commit Tasks 4–6 together as noted in Task 6.

---

## Task 5: Core instrument primitives

**Files:**
- Create: `src/components/instruments/TerminalBlock.tsx`
- Create: `src/components/instruments/TickerChip.tsx`
- Create: `src/components/instruments/Metric.tsx`
- Create: `src/components/instruments/StatusDot.tsx`
- Create: `src/components/instruments/Sparkline.tsx`

- [ ] **Step 1: `TickerChip.tsx`**

```tsx
import { formatDelta, deltaDirection } from "@/lib/format";

export default function TickerChip({
  symbol,
  changePct,
}: {
  symbol: string;
  changePct: number;
}) {
  const dir = deltaDirection(changePct);
  const color =
    dir === "up" ? "text-up" : dir === "down" ? "text-down" : "text-on-surface-variant";
  return (
    <span className="font-mono text-xs whitespace-nowrap">
      <span className="text-on-surface-variant">{symbol}</span>{" "}
      <span className={color}>{formatDelta(changePct)}</span>
    </span>
  );
}
```

- [ ] **Step 2: `TerminalBlock.tsx`**

```tsx
export default function TerminalBlock({
  title = "jayraj@safe — zsh",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-outline-variant/30 bg-surface-container-lowest overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant/30 bg-surface-container">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-outline text-xs">{title}</span>
      </div>
      <div className="p-4 leading-relaxed">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: `Metric.tsx`**

```tsx
export default function Metric({
  label,
  value,
  unit,
  accent = "primary",
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: "primary" | "tertiary" | "up";
}) {
  const color =
    accent === "tertiary" ? "text-tertiary" : accent === "up" ? "text-up" : "text-primary";
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-outline">
        {label}
      </div>
      <div className={`font-mono text-2xl font-bold ${color}`}>
        {value}
        {unit && <span className="text-sm">{unit}</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `StatusDot.tsx`**

```tsx
export default function StatusDot({
  children,
  color = "up",
}: {
  children: React.ReactNode;
  color?: "up" | "primary" | "tertiary";
}) {
  const c = color === "primary" ? "bg-primary" : color === "tertiary" ? "bg-tertiary" : "bg-up";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-sm">
      <span className={`w-2 h-2 rounded-full ${c}`} />
      {children}
    </span>
  );
}
```

- [ ] **Step 5: `Sparkline.tsx`**

```tsx
export default function Sparkline({
  points,
  className = "",
}: {
  points: number[];
  className?: string;
}) {
  if (points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / range) * 30;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className={`w-full h-8 ${className}`}
      aria-hidden="true"
    >
      <polyline points={coords} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
```

---

## Task 6: The global ticker rail + seed data

**Files:**
- Create: `src/data/markets.json`
- Create: `src/components/instruments/TickerRail.tsx`

- [ ] **Step 1: `src/data/markets.json` (seed baseline)**

```json
{
  "asOf": "2026-06-01",
  "source": "seed",
  "note": "Placeholder baseline. Replaced by real fetched data in P3. Only symbol + changePct are displayed in the rail.",
  "stocks": [
    { "symbol": "NVDA", "price": 0, "changePct": 2.41 },
    { "symbol": "AAPL", "price": 0, "changePct": -0.62 },
    { "symbol": "TSLA", "price": 0, "changePct": 1.18 },
    { "symbol": "MSFT", "price": 0, "changePct": 0.34 }
  ],
  "crypto": [
    { "symbol": "BTC", "price": 0, "changePct": 3.1 },
    { "symbol": "ETH", "price": 0, "changePct": 1.72 }
  ]
}
```

- [ ] **Step 2: `TickerRail.tsx`**

```tsx
import markets from "@/data/markets.json";
import TickerChip from "./TickerChip";

export default function TickerRail() {
  const items = [...markets.stocks, ...markets.crypto];
  const group = (prefix: string) =>
    items.map((m) => (
      <TickerChip key={`${prefix}-${m.symbol}`} symbol={m.symbol} changePct={m.changePct} />
    ));
  return (
    <div className="sticky top-0 z-40 border-b border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-md overflow-hidden">
      <div className="ticker-marquee flex gap-8 py-2 px-4 w-max">
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build (resolves Tasks 4–6)**

Run: `npm run build`
Expected: PASS — all routes export; layout renders the ticker rail.

- [ ] **Step 4: Visual check**

Run: `npm run dev`, open http://localhost:3000. Confirm: the mono ticker rail scrolls under the nav; up values are green, down values red; nothing overflows.

- [ ] **Step 5: Commit Tasks 4–6 together**

```bash
git add src/app/layout.tsx src/components/instruments src/data/markets.json
git commit -m "feat: add instrument kit + global ticker rail, load JetBrains Mono"
```

---

## Task 7: Rewrite the navbar for the new IA

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/writing", label: "writing" },
  { href: "/interests", label: "interests" },
  { href: "/about", label: "about" },
  { href: "/now", label: "now" },
  { href: "/uses", label: "uses" },
];

const RESUME_URL =
  "https://drive.google.com/file/d/1tleUFEbGJ4Se847v0RVS3qQ_4kZL-dS0/view?usp=sharing";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-primary uppercase font-headline"
        >
          J. JADEJA
        </Link>

        <div className="hidden md:flex items-center gap-6 font-mono text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                isActive(href)
                  ? "text-tertiary"
                  : "text-on-surface-variant hover:text-on-surface transition-colors"
              }
            >
              <span className="text-outline">/</span>
              {label}
            </Link>
          ))}
        </div>

        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs font-bold uppercase tracking-widest bg-primary text-on-primary px-5 py-2 rounded-sm hover:bg-tertiary transition-all duration-300"
        >
          résumé
        </a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: rewrite navbar for new IA with real résumé link"
```

---

## Task 8: Rewrite the footer as an honest telemetry strip

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import StatusDot from "@/components/instruments/StatusDot";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/jayrajadeja" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jayrajadeja/" },
  { label: "Substack", href: "https://substack.com/@jayrajadeja" },
  { label: "Email", href: "mailto:jayrajsinh.jadeja399@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 bg-surface">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <StatusDot>open to roles · bengaluru</StatusDot>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-tertiary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} Jayraj Jadeja · built with Next.js, statically exported.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: honest telemetry footer with real social links"
```

---

## Task 9: Route stubs for the new pages

Creates themed placeholders so the IA is real and navigable. Content lands in P2.

**Files:**
- Create: `src/app/work/page.tsx`
- Create: `src/app/writing/page.tsx`
- Create: `src/app/about/page.tsx`
- Create: `src/app/now/page.tsx`
- Create: `src/app/uses/page.tsx`

- [ ] **Step 1: Create all five stubs**

Each file follows this exact shape — substitute the `PATH`, `TITLE`, and `BLURB` per the table below.

Template:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "TITLE" };

export default function Page() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
      <span className="font-mono text-tertiary text-xs tracking-[0.3em] uppercase">
        PATH
      </span>
      <h1 className="font-headline text-6xl md:text-7xl font-bold tracking-tighter mt-4">
        TITLE
      </h1>
      <p className="font-body text-xl text-on-surface-variant mt-6 italic max-w-2xl">
        BLURB
      </p>
    </div>
  );
}
```

| File | PATH | TITLE | BLURB |
|---|---|---|---|
| `src/app/work/page.tsx` | `/work` | `Selected Systems` | `Case files — Temporal workflows, multi-region data movement, the CISO Digest agent — land in the next build phase.` |
| `src/app/writing/page.tsx` | `/writing` | `The Desk` | `Finance × engineering essays and field notes. Wiring up in the next build phase.` |
| `src/app/about/page.tsx` | `/about` | `About` | `The full record — bio, education, résumé, and how to reach me. Coming in the next build phase.` |
| `src/app/now/page.tsx` | `/now` | `Now` | `What I'm building, reading, and watching right now. A dated snapshot, coming soon.` |
| `src/app/uses/page.tsx` | `/uses` | `Uses` | `Editor, terminal, hardware, stack — the setup behind the work. Coming soon.` |

- [ ] **Step 2: Verify build exports all routes**

Run: `npm run build`
Expected: PASS — output lists `/work`, `/writing`, `/about`, `/now`, `/uses` (plus existing `/`, `/interests`, and the not-yet-removed `/blog`, `/library`).

- [ ] **Step 3: Visual check of nav**

Run: `npm run dev`. Click every nav link; confirm each route renders its themed stub and the active link shows in cyan.

- [ ] **Step 4: Commit**

```bash
git add src/app/work src/app/writing src/app/about src/app/now src/app/uses
git commit -m "feat: add themed route stubs for new IA"
```

---

## Task 10: Author the canonical profile (knowledge base seed)

The single source of truth for all content. Distilled from spec §4. Agents and future tasks read this before writing copy.

**Files:**
- Create: `docs/knowledge/profile.md`

- [ ] **Step 1: Create `docs/knowledge/profile.md`**

```markdown
# Canonical Profile — Jayraj Jadeja

> Single source of truth for all site content. If content and this file disagree, this file wins.
> **Honesty rules are hard constraints. Do not fabricate. Do not embellish.**

## Identity
- Jayraj Jadeja — Software Engineer II at SAFE Security (Feb 2021 – present, 5+ years).
- Based in Bengaluru. Open to new opportunities.
- Domain: backend & distributed systems. Languages: Go, TypeScript. Strong database work — MySQL query/index optimization, null-safe equality (`<=>`).

## Real work (interview-defensible — `/work`)
- Workflow-as-a-Service built on Temporal.
- Multi-region / cross-stack data transfer.
- Scaling systems with event-driven architecture.
- CISO Digest — an AI agent that analyzes threat feeds and quantifies their impact into actionable insights for executives. (Confirmed built.)
- Earlier: software engineering internship at Mudraksh & McShaw LLP (May–July 2019).

## Systems I've studied (curiosity, NOT employment)
- Flagship: YouTube video processing, financial data store solutioning.
- Others: S3, Instagram, Dropbox, Google Drive, Google Docs, Uber.
- Papers: Google File System, Amazon Dynamo. Book: Designing Data-Intensive Applications.

## ⚠️ Honesty rules (hard constraints)
- Jayraj has NOT worked on a market-data platform and has NOT shipped a "1M+ ticks/second" production system. Market data is a studied interest, never presented as his work.
- No UI element may claim a throughput/latency figure is his production system's metric. Live/animated numbers are framed as markets he follows or as clearly-labeled representative values.
- "Systems I've studied" uses real, public, citable figures, labeled as study notes.

## Interests
- Formula 1 — team Mercedes; drivers Lewis Hamilton and Max Verstappen.
- Markets / finance — NASDAQ stocks, market fundamentals, crypto.
- Anime / manga — Naruto, One Piece, Haikyuu, Jujutsu Kaisen.
- Sport — table tennis, badminton.

## Library
- Books: Designing Data-Intensive Applications; AI Engineering (Chip Huyen); Dark Matter (Blake Crouch); The Trial (Kafka).
- Papers: Google File System; Amazon Dynamo.

## Writing / voice
- Substack (substack.com/@jayrajadeja, live) — the intersection of finance and engineering.
- Voice: deeply technical, analytical, pragmatic about performance; blends rigorous engineering terms with modern shorthand (calls great tech "OP").

## Education
- B.Tech, Computer Science — Jaypee Institute of Information Technology (8.1 CGPA).
- Schooling — Delhi Public School, Vindhyanagar.

## Coordinates
- GitHub: https://github.com/jayrajadeja
- LinkedIn: https://www.linkedin.com/in/jayrajadeja/
- Email (public): jayrajsinh.jadeja399@gmail.com
- Substack: https://substack.com/@jayrajadeja
- X/Twitter: none.
- Résumé: https://drive.google.com/file/d/1tleUFEbGJ4Se847v0RVS3qQ_4kZL-dS0/view?usp=sharing
- Site: https://jayrajadeja.github.io
```

- [ ] **Step 2: Verify against spec**

Confirm every fact matches spec §4 of `docs/superpowers/specs/2026-06-01-portfolio-elevation-design.md`. No additions, no embellishment.

- [ ] **Step 3: Commit**

```bash
git add docs/knowledge/profile.md
git commit -m "docs: add canonical profile (knowledge base source of truth)"
```

---

## Task 11: Final P0 verification gate

**Files:** none (verification only).

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: PASS — no errors.

- [ ] **Step 2: Unit tests**

Run: `npm test`
Expected: PASS — formatter + smoke tests pass.

- [ ] **Step 3: Production build / static export**

Run: `npm run build`
Expected: PASS — `out/` generated; route list includes `/`, `/work`, `/writing`, `/interests`, `/about`, `/now`, `/uses` (and the not-yet-removed `/blog`, `/library`).

- [ ] **Step 4: Visual smoke test**

Run: `npm run dev`. Confirm: dark canvas (`#0c0e0f`), scrolling ticker rail with green/red deltas, all 7 nav links work with cyan active state, résumé opens the Drive link, footer shows "open to roles · bengaluru" and real social links.

- [ ] **Step 5: Confirm reduced-motion**

In the browser/OS, enable "reduce motion"; reload. Expected: ticker rail stops animating (content still visible).

**P0 is complete when all of the above pass.** The site now has its full design-system foundation, global chrome, instrument primitives, route skeleton, and canonical profile — ready for P1 (real content & data model).

---

## Self-Review (against spec)

- **§8 Design system** — tokens (canvas, market colors, mono), three fonts, motion + reduced-motion, instrument primitives: ✅ Tasks 3–6.
- **§10 Architecture (foundation slice)** — layout, nav, footer, route skeleton, static-first, mono via `next/font`: ✅ Tasks 4, 7, 8, 9.
- **§11 `docs/knowledge/profile.md`** — ✅ Task 10. (Other knowledge files + `AGENTS.md`/`CLAUDE.md`/`llms.txt` are P5.)
- **§12 P0 definition** — fully covered. P1–P5 are out of scope for this plan and get their own phase-plans.
- **Honesty rules** — no fabricated metrics introduced; seed market data is labeled `source: "seed"` and only symbol+delta are shown; profile.md encodes the hard constraints. ✅
- **Placeholder scan** — every code step contains complete code; route-stub template is fully specified via the substitution table. ✅
- **Type consistency** — `format.ts` exports (`deltaDirection`, `formatDelta`, `formatCompact`, `formatGrouped`) match their uses in `TickerChip`; `markets.json` shape (`stocks[]`/`crypto[]` with `symbol`,`changePct`) matches `TickerRail`. ✅
