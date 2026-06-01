# Design System

Material Design 3 dark theme implemented in Tailwind v4. All tokens live in `src/app/globals.css` under `@theme`. Rule: **theme tokens only — no hardcoded hex in components**.

---

## Color Palette

All tokens are available as Tailwind utility classes (e.g. `bg-surface`, `text-primary`, `border-outline-variant`).

### Surface / Background

| Token | Hex | Role |
|-------|-----|------|
| `surface` / `background` | `#0c0e0f` | Canvas — page background |
| `surface-container-lowest` | `#0e0e0e` | Deepest card background |
| `surface-container-low` | `#1c1b1b` | Elevated card / panel |
| `surface-container` | `#201f1f` | Standard card |
| `surface-container-high` | `#2a2a2a` | Prominent card |
| `surface-container-highest` | `#353534` | Topmost surface |
| `surface-dim` | `#0c0e0f` | Same as canvas |
| `surface-bright` | `#3a3939` | Highlighted surface |
| `surface-variant` | `#353534` | Alternative surface |
| `surface-tint` | `#ffb4a8` | Salmon tint overlay |

### Ink / Text

| Token | Hex | Role |
|-------|-----|------|
| `on-surface` | `#e5e2e1` | Primary body text |
| `on-surface-variant` | `#c4c7c7` | Secondary / dimmed text |
| `on-background` | `#e5e2e1` | Same as on-surface |
| `outline` | `#8e9192` | Muted labels, borders |
| `outline-variant` | `#444748` | Subtle dividers |
| `inverse-surface` | `#e5e2e1` | Light surfaces (chips on dark) |
| `inverse-on-surface` | `#313030` | Text on light surfaces |

### Accent Colors

| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#ffb4a8` | Salmon — main accent, headings, highlights |
| `on-primary` | `#680200` | Text on primary |
| `primary-container` | `#2f0000` | Dark container for primary elements |
| `tertiary` | `#4cd6ff` | Cyan — data, live indicators, links |
| `on-tertiary` | `#003543` | Text on tertiary |
| `tertiary-container` | `#00151c` | Dark container for data elements |
| `secondary` | `#bdc7d9` | Cool grey — secondary UI |

### Semantic Data Colors

| Token | Hex | Role |
|-------|-----|------|
| `up` | `#3ddc84` | Green — positive delta, live status |
| `on-up` | `#00210f` | Text on up |
| `down` | `#ff6b6b` | Red — negative delta |
| `on-down` | `#2b0000` | Text on down |
| `error` | `#ffb4ab` | Error state |
| `error-container` | `#93000a` | Error container |

Full token list: `src/app/globals.css`.

---

## Typography

Three font roles, all configured in `@theme`:

| Tailwind class | CSS var | Typeface | Use |
|----------------|---------|----------|-----|
| `font-headline` | `--font-headline` | Space Grotesk, sans-serif | Headings, nav labels, uppercase tags |
| `font-body` | `--font-body` | Newsreader, serif | Body text, prose, post content |
| `font-label` | `--font-label` | Space Grotesk, sans-serif | Labels, metadata (same face as headline) |
| `font-mono` | `--font-mono` | JetBrains Mono, monospace | Code, metrics, ticker values |

Fonts are loaded via `next/font/google` in the root layout.

---

## Radius Scale

Intentionally tight — the design reads sharp, not rounded.

| Token | Value |
|-------|-------|
| `radius-sm` | `0.125rem` |
| `radius-DEFAULT` | `0.125rem` |
| `radius-md` | `0.25rem` |
| `radius-lg` | `0.25rem` |
| `radius-xl` | `0.5rem` |
| `radius-full` | `0.75rem` |

---

## Custom Utilities

Defined in `src/app/globals.css`:

**`.kinetic-gradient`** — `linear-gradient(135deg, #ffb4a8 0%, #2f0000 100%)`. Salmon-to-dark diagonal, used on hero backgrounds.

**`.velocity-grid`** — Subtle salmon-tinted 40×40px grid overlay (`rgba(255,180,168,0.05)`). Used behind hero sections to suggest data infrastructure.

**`.glass-effect`** — `backdrop-filter: blur(20px)`. Use on fixed/sticky panels over content.

**`.ticker-marquee`** — `animation: ticker-scroll 40s linear infinite`. Drives the TickerRail continuous scroll. Under `prefers-reduced-motion: reduce`, the animation is suppressed (element freezes at start position).

**`.sparkline-draw`** — SVG stroke-dashoffset draw-in animation over 0.9s ease-out. Only active under `prefers-reduced-motion: no-preference`; omitted otherwise (line remains static at full visibility).

**Material Symbols** — Icons via Google Fonts CDN (`material-symbols-outlined`). Weight 300, fill 0, opsz 24.

---

## Motion Principles

- **Ticker**: 40s linear continuous scroll. Freezes (not hidden) under `prefers-reduced-motion`.
- **Sparkline**: 0.9s ease-out draw-in when scrolled into view. Skipped under `prefers-reduced-motion`.
- **CountUp**: 1200ms cubic-ease-out (configurable via `durationMs`). Triggered by IntersectionObserver at 40% visibility. Skipped under `prefers-reduced-motion` — shows final value immediately.
- **Live dot**: `bg-up` = green when data is live (CoinGecko fetch succeeded); `bg-outline/60` = grey when on baked fallback.
- General range: 150–500ms for UI transitions; 900ms–1200ms for data reveals.

---

## Instrument Kit (`src/components/instruments/`)

Components for displaying live/baked data. Import from `@/components/instruments/`.

### `TerminalBlock`
**Purpose:** macOS-style terminal frame with title bar and traffic-light dots. Wraps monospace content.
**Props:** `title?: string` (default: `"jayraj@engineering — zsh"`), `children: ReactNode`.
**When to use:** Code output, `$ command` blocks, annotated shell sessions.

### `TickerChip`
**Purpose:** Single market ticker cell — symbol + color-coded delta.
**Props:** `symbol: string`, `changePct: number`.
**Colors:** `text-up` (green) for positive, `text-down` (red) for negative, `text-on-surface-variant` for flat.
**When to use:** Inside `TickerRail`; can be used standalone for inline market quotes.

### `TickerRail`
**Purpose:** Site-wide scrolling market ticker bar. Shows stocks (from build-time `markets.json`) + crypto (live CoinGecko fetch with baked fallback). Label reads `"markets · as of YYYY-MM-DD"` when any data is real, `"markets · illustrative"` when all data is seed.
**Props:** None — data-driven from `markets.json` + CoinGecko API.
**When to use:** Rendered once in layout/footer. Do not instantiate multiple times.

### `Metric`
**Purpose:** Single KPI display — muted label over large monospace value.
**Props:** `label: string`, `value: string`, `unit?: string`, `accent?: "primary" | "tertiary" | "up"` (default: `"primary"`).
**When to use:** Career stats, system metrics, any prominent numeric display.

### `StatusDot`
**Purpose:** Colored dot + inline label. Signals live/active states.
**Props:** `children: ReactNode`, `color?: "up" | "primary" | "tertiary"` (default: `"up"`).
**When to use:** "Currently open to opportunities", live data indicators, status tags.

### `Sparkline`
**Purpose:** Minimal inline SVG line chart with draw-in animation.
**Props:** `points: number[]` (min 2), `className?: string`.
**When to use:** Issue/PR trend charts, any time-series visualization. Pair with `text-primary` or `text-tertiary` for color.

### `CountUp`
**Purpose:** Animated number that counts from 0 to `end` on scroll-into-view.
**Props:** `end: number`, `durationMs?: number` (default 1200), `format?: (n: number) => string`, `className?: string`.
**SSR:** Renders the real final number immediately (no hydration flash). Animation starts only client-side when the element enters the viewport.
**When to use:** Career stats headline numbers, any prominent count metric.
