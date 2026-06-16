# Interactive Terminal Hero — Design

**Date:** 2026-06-16
**Status:** Approved (design)
**Branch:** `feat/terminal-hero`

## Context

The home page hero (`src/app/page.tsx:44-79`) is a **static** `TerminalBlock` rendering a faux shell session (`whoami`, `cat focus.txt`, `cat thesis.txt`, `./status`). It looks like a terminal but does nothing. This enhancement turns it into a real interactive terminal — the signature "living data system" moment — while degrading cleanly to the current static content when JS is unavailable or motion is reduced.

This is sub-project **A** of three chosen enhancement directions; it ships as its own PR. (B = living-data + writing, C = technical/SEO, bundled together as a later PR.)

**Honesty rules still apply** (`docs/knowledge/profile.md`, `AGENTS.md`): aggregate-only metrics, no internal/vendor names, company-agnostic prompt (`jayraj@engineering`). The terminal surfaces only already-published content.

## Goals

- Replace the static hero with an interactive terminal: auto-types the intro on load, leaves a live prompt the visitor can type into, and offers clickable command chips for discovery (mobile-friendly).
- Keep command logic pure and unit-tested; keep the React surface thin.
- Degrade gracefully: identical static content with no JS; no animation under reduced-motion; fully usable on mobile and with a screen reader.

## Non-Goals (YAGNI)

- No cross-session command history, no theming, no real filesystem, no data commands (`stats`/`resume`/`email`).
- No third-party terminal library.
- Bounded command set (below) — not a general shell.

## Architecture

Two units with a clean boundary:

### 1. `src/lib/terminal.ts` — pure command engine (tested)

No React, no DOM. Exports:

- `runCommand(input: string, ctx: TerminalContext): CommandResult`
- `INTRO_SEQUENCE: string[]` — the scripted auto-play commands (`whoami`, `cat focus.txt`, `cat thesis.txt`, `./status`).
- `listCommands(): { name: string; help: string }[]` — backs `help`.

Types:

```ts
type Tone = "default" | "accent" | "muted" | "error";
type OutputLine = { text: string; tone?: Tone };          // tone → token in the UI
type Intent =
  | { type: "navigate"; href: string }   // internal route (next/navigation)
  | { type: "external"; href: string }   // mailto / external
  | { type: "clear" };
type CommandResult = { lines: OutputLine[]; intent?: Intent };
type TerminalContext = {
  tenureYears: string;                   // from stats.json
  routes: { name: string; href: string }[];
};
```

Parsing: trim + lowercase the command word; arguments preserved (e.g. `cat focus.txt`, `open writing`). Unknown command → single `error` line `command not found: <x> — type 'help'`.

### 2. `src/components/instruments/TerminalHero.tsx` — client island (`"use client"`)

Renders inside the existing `TerminalBlock` (reuses its chrome). Owns only I/O:

- State: `history: OutputLine[]` (rendered output), `input: string`, `cmdHistory: string[]` (for ↑/↓ recall within the session).
- Renders the intro output as **initial state on the server** (so no-JS sees it), then hydrates to interactive.
- Typing animation for auto-play; blinking cursor (CSS, `aria-hidden`).
- Clickable command **chips** (real `<button>`s) below the prompt: `help`, `ls`, `cat thesis.txt`, `open writing` — clicking runs the command.
- Focus: clicking anywhere in the terminal focuses the hidden/inline input; input is keyboard-reachable.
- Keyboard: Enter submits; ↑/↓ recall `cmdHistory`; Ctrl/⌘+L clears.
- Executes intents: `navigate` → `useRouter().push(href)`; `external` → anchor/`window.open`; `clear` → reset history.

### 3. `src/app/page.tsx`

Swap the static `<TerminalBlock>{…}</TerminalBlock>` hero for `<TerminalHero />`. The metrics row, telemetry caption, serif lead, and CTAs below it are unchanged.

## Commands

| Command | Output / effect |
|---|---|
| `help` | lists available commands (`listCommands()`) |
| `whoami` | `Jayraj Jadeja — Software Engineer II · Bengaluru` |
| `cat focus.txt` | `backend · distributed systems · event-driven · go / typescript` |
| `cat thesis.txt` | `markets & distributed systems — the same problems in different clothes` |
| `ls` | lists navigable pages (work, writing, interests, about, now, uses) |
| `./status` | `open to roles · <tenureYears> yrs` (accent/up tone) |
| `open <page>` / `cd <page>` | `navigate` intent to that route; bad target → error line |
| `clear` | `clear` intent |
| `sudo …` | easter egg: "you already have root here" |
| `uptime` | easter egg referencing tenure |
| _(unknown)_ | `command not found: <x> — type 'help'` |

Content strings (whoami/focus/thesis) and `tenureYears` come from the same source as the current hero — defined once and reused for both the engine output and the SSR fallback (no duplication / drift).

## Auto-play

- On first home view per session (a `sessionStorage` flag, e.g. `terminal-hero-played`), auto-type `INTRO_SEQUENCE` line by line; subsequent views render it instantly.
- Under `prefers-reduced-motion: reduce`, always render instantly (no typing) — mirrors `CountUp`.

## Accessibility & degradation (load-bearing)

- **No-JS:** the component SSR-renders the full intro output inside `TerminalBlock`, identical to today's static hero. Chips + input render only after hydration.
- **Reduced-motion:** no typing animation; full output immediately.
- **Screen readers:** output region is `aria-live="polite"`; the input has an `aria-label` (e.g. "Terminal command input"); chips are labelled `<button>`s; prompt glyph + cursor are `aria-hidden`; no focus trapping (Tab/Esc behave normally).
- **Mobile:** chips provide complete functionality without a keyboard; typing still works with the on-screen keyboard.

## Static-export compliance

Client island only (no server APIs, no `cookies()`/`headers()`); no network calls; navigation via `next/navigation`. Adds one client component alongside the existing three (Navbar, TickerRail, CountUp) — justified by the interactivity.

## Testing & verification

- **Vitest (`src/lib/terminal.test.ts`)** — pure logic: each command returns the expected `lines`/`intent`; `cat <file>` and `open <page>` argument parsing; unknown command → error; `help` lists every command; input trimming + case-insensitivity; bad `open` target → error.
- **UI** — verified by `npm run build` + visual check (per the project's logic-only-tests convention; no component unit tests).
- **Manual checks** — no-JS fallback (view source shows intro lines), reduced-motion (no typing), mobile chips, keyboard nav, `npm run lint` + `npm test` + `npm run build` all green.

## Files touched

- `src/lib/terminal.ts` (new) + `src/lib/terminal.test.ts` (new)
- `src/components/instruments/TerminalHero.tsx` (new)
- `src/app/page.tsx` (swap hero block)
- `src/app/globals.css` (cursor-blink keyframe, reduced-motion-guarded — if not done inline)
- `docs/knowledge/design-system.md` (note the new instrument)
