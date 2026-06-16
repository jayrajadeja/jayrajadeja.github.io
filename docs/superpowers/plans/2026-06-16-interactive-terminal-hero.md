# Interactive Terminal Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static home-page terminal hero with a real interactive terminal — auto-types an intro on load, accepts typed commands, offers clickable command chips — that degrades cleanly to the current static content with no JS / reduced motion.

**Architecture:** A pure command engine (`src/lib/terminal.ts`, unit-tested) returns output lines + an optional intent (navigate/external/clear) for any input string. A thin client island (`TerminalHero.tsx`) renders inside the existing `TerminalBlock`, owns I/O (typing animation, history, chips, focus), and acts on intents via `next/navigation`. The home page swaps its static hero block for `<TerminalHero>`.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript (strict), Tailwind v4 (theme tokens in `globals.css`), Vitest (logic-only tests).

Spec: `docs/superpowers/specs/2026-06-16-interactive-terminal-hero-design.md`. Honesty rules (`docs/knowledge/profile.md`) apply: aggregate-only, company-agnostic prompt (`jayraj@engineering`).

---

## File Structure

- `src/lib/terminal.ts` *(new)* — pure command engine: types, content constants, `ROUTES`, `INTRO_SEQUENCE`, `runCommand()`, `listCommands()`. No React/DOM.
- `src/lib/terminal.test.ts` *(new)* — Vitest unit tests for the engine.
- `src/components/instruments/TerminalHero.tsx` *(new)* — `"use client"` island; renders inside `TerminalBlock`; I/O + animation + navigation only.
- `src/app/globals.css` *(modify)* — add the `.terminal-cursor` blink keyframe, guarded by `prefers-reduced-motion`.
- `src/app/page.tsx` *(modify)* — swap the static hero block for `<TerminalHero tenureYears={stats.tenureYears} />`; drop now-unused `TerminalBlock`/`StatusDot` imports.
- `docs/knowledge/design-system.md` *(modify)* — list the new `TerminalHero` instrument.

---

## Task 1: Command engine (`src/lib/terminal.ts`) — TDD

**Files:**
- Create: `src/lib/terminal.ts`
- Test: `src/lib/terminal.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/terminal.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  runCommand,
  listCommands,
  WHOAMI,
  FOCUS,
  THESIS,
  type TerminalContext,
} from "@/lib/terminal";

const ctx: TerminalContext = { tenureYears: "5" };

describe("runCommand", () => {
  it("whoami prints identity", () => {
    expect(runCommand("whoami", ctx).lines).toEqual([{ text: WHOAMI }]);
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(runCommand("  WHOAMI  ", ctx).lines).toEqual([{ text: WHOAMI }]);
  });

  it("empty input returns no lines", () => {
    expect(runCommand("   ", ctx)).toEqual({ lines: [] });
  });

  it("cat focus.txt prints the focus line", () => {
    expect(runCommand("cat focus.txt", ctx).lines).toEqual([{ text: FOCUS }]);
  });

  it("cat thesis.txt prints the thesis line", () => {
    expect(runCommand("cat thesis.txt", ctx).lines).toEqual([{ text: THESIS }]);
  });

  it("cat with no argument errors", () => {
    expect(runCommand("cat", ctx).lines[0].tone).toBe("error");
  });

  it("cat unknown file errors with 'no such file'", () => {
    const r = runCommand("cat secrets.txt", ctx);
    expect(r.lines[0].tone).toBe("error");
    expect(r.lines[0].text).toContain("no such file");
  });

  it("./status includes tenure and uses the 'up' tone", () => {
    const r = runCommand("./status", ctx);
    expect(r.lines[0].text).toContain("5 yrs");
    expect(r.lines[0].tone).toBe("up");
  });

  it("open writing returns a navigate intent", () => {
    expect(runCommand("open writing", ctx).intent).toEqual({
      type: "navigate",
      href: "/writing",
    });
  });

  it("cd is an alias for open", () => {
    expect(runCommand("cd about", ctx).intent).toEqual({
      type: "navigate",
      href: "/about",
    });
  });

  it("open with no argument navigates home", () => {
    expect(runCommand("open", ctx).intent).toEqual({
      type: "navigate",
      href: "/",
    });
  });

  it("open to an unknown page errors and yields no intent", () => {
    const r = runCommand("open nope", ctx);
    expect(r.intent).toBeUndefined();
    expect(r.lines[0].tone).toBe("error");
  });

  it("ls lists the routes", () => {
    const r = runCommand("ls", ctx);
    expect(r.lines[0].text).toContain("work");
    expect(r.lines[0].text).toContain("writing");
  });

  it("clear returns a clear intent and no lines", () => {
    expect(runCommand("clear", ctx)).toEqual({
      lines: [],
      intent: { type: "clear" },
    });
  });

  it("unknown command errors and echoes the original token", () => {
    const r = runCommand("FooBar", ctx);
    expect(r.lines[0].tone).toBe("error");
    expect(r.lines[0].text).toContain("FooBar");
  });

  it("sudo is a hidden easter egg", () => {
    expect(runCommand("sudo rm -rf /", ctx).lines[0].text.toLowerCase()).toContain(
      "root",
    );
  });
});

describe("listCommands", () => {
  it("lists documented commands and hides easter eggs + aliases", () => {
    const names = listCommands().map((c) => c.name);
    expect(names).toContain("whoami");
    expect(names).toContain("open");
    expect(names).not.toContain("sudo");
    expect(names).not.toContain("uptime");
    expect(names).not.toContain("cd");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/terminal.test.ts`
Expected: FAIL — cannot resolve `@/lib/terminal` (module does not exist yet).

- [ ] **Step 3: Write the engine**

Create `src/lib/terminal.ts`:

```ts
export type Tone = "default" | "accent" | "muted" | "error" | "up";

export interface OutputLine {
  text: string;
  tone?: Tone;
}

export type Intent =
  | { type: "navigate"; href: string }
  | { type: "external"; href: string }
  | { type: "clear" };

export interface CommandResult {
  lines: OutputLine[];
  intent?: Intent;
}

export interface TerminalContext {
  tenureYears: string;
}

// ── Content (single source; reused by the SSR / no-JS fallback) ─────────────
export const WHOAMI = "Jayraj Jadeja — Software Engineer II · Bengaluru";
export const FOCUS =
  "backend · distributed systems · event-driven · go / typescript";
export const THESIS =
  "markets & distributed systems — the same problems in different clothes";

// Pages reachable via `open`/`cd`; also what `ls` prints.
export const ROUTES: { name: string; href: string }[] = [
  { name: "work", href: "/work" },
  { name: "writing", href: "/writing" },
  { name: "interests", href: "/interests" },
  { name: "about", href: "/about" },
  { name: "now", href: "/now" },
  { name: "uses", href: "/uses" },
];

// Auto-played on first load (each entry is a command string).
export const INTRO_SEQUENCE = [
  "whoami",
  "cat focus.txt",
  "cat thesis.txt",
  "./status",
];

interface Command {
  help: string; // empty string ⇒ hidden from `help` / listCommands (aliases, easter eggs)
  run: (args: string[], ctx: TerminalContext) => CommandResult;
}

const CAT_FILES: Record<string, string> = {
  "focus.txt": FOCUS,
  "thesis.txt": THESIS,
};

function navigate(target: string | undefined): CommandResult {
  if (!target || target === "~" || target === "home" || target === "/") {
    return {
      lines: [{ text: "→ /", tone: "muted" }],
      intent: { type: "navigate", href: "/" },
    };
  }
  const name = target.toLowerCase().replace(/^\//, "");
  const route = ROUTES.find((r) => r.name === name);
  if (!route) {
    return {
      lines: [{ text: `open: no such page: ${target} — try 'ls'`, tone: "error" }],
    };
  }
  return {
    lines: [{ text: `→ ${route.href}`, tone: "muted" }],
    intent: { type: "navigate", href: route.href },
  };
}

const COMMANDS: Record<string, Command> = {
  help: {
    help: "list available commands",
    run: () => ({
      lines: [
        { text: "available commands:", tone: "muted" },
        ...listCommands().map((c) => ({
          text: `  ${c.name.padEnd(16)}${c.help}`,
          tone: "default" as const,
        })),
      ],
    }),
  },
  whoami: {
    help: "who I am",
    run: () => ({ lines: [{ text: WHOAMI }] }),
  },
  cat: {
    help: "print a file (focus.txt · thesis.txt)",
    run: (args) => {
      const file = args[0];
      if (!file) {
        return { lines: [{ text: "cat: missing file operand", tone: "error" }] };
      }
      const content = CAT_FILES[file.toLowerCase()];
      if (content === undefined) {
        return {
          lines: [{ text: `cat: ${file}: no such file`, tone: "error" }],
        };
      }
      return { lines: [{ text: content }] };
    },
  },
  ls: {
    help: "list pages",
    run: () => ({
      lines: [
        { text: ROUTES.map((r) => r.name).join("   "), tone: "accent" },
        { text: "open <page> to navigate", tone: "muted" },
      ],
    }),
  },
  open: {
    help: "go to a page (alias: cd)",
    run: (args) => navigate(args[0]),
  },
  cd: {
    help: "",
    run: (args) => navigate(args[0]),
  },
  "./status": {
    help: "availability",
    run: (_args, ctx) => ({
      lines: [{ text: `● open to roles · ${ctx.tenureYears} yrs`, tone: "up" }],
    }),
  },
  clear: {
    help: "clear the screen",
    run: () => ({ lines: [], intent: { type: "clear" } }),
  },
  sudo: {
    help: "",
    run: () => ({
      lines: [{ text: "nice try — you already have root here :)", tone: "muted" }],
    }),
  },
  uptime: {
    help: "",
    run: (_args, ctx) => ({
      lines: [
        {
          text: `up ${ctx.tenureYears} years · load average: curious, building, shipping`,
        },
      ],
    }),
  },
};

export function runCommand(input: string, ctx: TerminalContext): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const [rawCmd, ...args] = trimmed.split(/\s+/);
  const command = COMMANDS[rawCmd.toLowerCase()];
  if (!command) {
    return {
      lines: [{ text: `command not found: ${rawCmd} — type 'help'`, tone: "error" }],
    };
  }
  return command.run(args, ctx);
}

export function listCommands(): { name: string; help: string }[] {
  return Object.entries(COMMANDS)
    .filter(([, c]) => c.help)
    .map(([name, c]) => ({ name, help: c.help }));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/terminal.test.ts`
Expected: PASS (all assertions green).

- [ ] **Step 5: Lint to confirm no type/style errors**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/terminal.ts src/lib/terminal.test.ts
git commit -m "feat(terminal): pure command engine for the interactive hero"
```

---

## Task 2: Cursor-blink CSS + `TerminalHero` component

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/instruments/TerminalHero.tsx`

(No component unit test — per the project convention, UI is verified by `npm run build` + visual check, not Vitest.)

- [ ] **Step 1: Add the cursor-blink keyframe to `globals.css`**

In `src/app/globals.css`, immediately after the `@keyframes sparkline-in { ... }` block (near the end of the file), append:

```css
.terminal-cursor {
  animation: terminal-blink 1s step-end infinite;
}

@keyframes terminal-blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .terminal-cursor {
    animation: none;
  }
}
```

- [ ] **Step 2: Create the `TerminalHero` component**

Create `src/components/instruments/TerminalHero.tsx`:

```tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TerminalBlock from "./TerminalBlock";
import {
  runCommand,
  INTRO_SEQUENCE,
  type OutputLine,
  type TerminalContext,
} from "@/lib/terminal";

// useLayoutEffect on the client (so the SSR intro can be cleared before paint —
// no flash); useEffect on the server to avoid React's SSR warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const TONE_CLASS: Record<NonNullable<OutputLine["tone"]>, string> = {
  default: "text-on-surface-variant",
  accent: "text-tertiary",
  muted: "text-outline",
  error: "text-down",
  up: "text-up",
};

const CHIPS = ["help", "ls", "cat thesis.txt", "open writing"];
const SESSION_KEY = "terminal-hero-played";
const TYPE_MS = 40; // per character
const PAUSE_MS = 220; // after a command finishes typing, before its output
const NEXT_MS = 260; // between commands

type Block = { input: string; lines: OutputLine[] };

function Line({ line }: { line: OutputLine }) {
  return <p className={TONE_CLASS[line.tone ?? "default"]}>{line.text}</p>;
}

function BlockView({ block }: { block: Block }) {
  return (
    <div className="space-y-0.5">
      <p>
        <span className="text-tertiary">&gt;</span>{" "}
        <span className="text-on-surface">{block.input}</span>
      </p>
      {block.lines.map((line, i) => (
        <Line key={i} line={line} />
      ))}
    </div>
  );
}

function buildIntro(ctx: TerminalContext): Block[] {
  return INTRO_SEQUENCE.map((input) => ({
    input,
    lines: runCommand(input, ctx).lines,
  }));
}

export default function TerminalHero({ tenureYears }: { tenureYears: string }) {
  const ctx: TerminalContext = { tenureYears };
  const router = useRouter();

  // SSR + first client render show the full intro: good for no-JS / SEO, and
  // identical on server and client so hydration is clean.
  const [blocks, setBlocks] = useState<Block[]>(() => buildIntro(ctx));
  const [typing, setTyping] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // First session visit (motion permitting): clear the intro BEFORE paint and
  // re-type it; otherwise just reveal the live prompt beneath the static intro.
  // useLayoutEffect ⇒ the clear lands before the browser paints, so the
  // pre-rendered intro never flashes away.
  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let played = false;
    try {
      played = !!sessionStorage.getItem(SESSION_KEY);
    } catch {
      /* sessionStorage unavailable */
    }

    if (reduce || played) {
      setReady(true); // keep the intro already in state; just show the prompt
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    setBlocks([]); // cleared before paint — no flash
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      for (const cmd of INTRO_SEQUENCE) {
        for (let i = 1; i <= cmd.length; i++) {
          if (cancelled) return;
          setTyping(cmd.slice(0, i));
          await wait(TYPE_MS);
        }
        await wait(PAUSE_MS);
        if (cancelled) return;
        setBlocks((prev) => [
          ...prev,
          { input: cmd, lines: runCommand(cmd, ctx).lines },
        ]);
        setTyping(null);
        await wait(NEXT_MS);
      }
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the latest output in view as the terminal grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [blocks, typing, ready]);

  function submit(raw: string) {
    const value = raw.trim();
    if (!value) return;
    const result = runCommand(value, ctx);
    if (result.intent?.type === "clear") {
      setBlocks([]);
    } else {
      setBlocks((prev) => [...prev, { input: value, lines: result.lines }]);
    }
    setCmdHistory((prev) => [...prev, value]);
    setHistIndex(-1);
    setInput("");
    if (result.intent?.type === "navigate") {
      router.push(result.intent.href);
    } else if (result.intent?.type === "external") {
      window.open(result.intent.href, "_blank", "noopener,noreferrer");
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit(input);
    } else if ((e.key === "l" || e.key === "L") && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setBlocks([]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const next =
        histIndex < 0 ? cmdHistory.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(next);
      setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex < 0) return;
      const next = histIndex + 1;
      if (next >= cmdHistory.length) {
        setHistIndex(-1);
        setInput("");
      } else {
        setHistIndex(next);
        setInput(cmdHistory[next]);
      }
    }
  }

  // SSR renders this with `blocks = intro` and `ready = false` → the static
  // intro shows (no prompt) for no-JS; JS reveals the prompt/chips after mount.
  return (
    <TerminalBlock title="jayraj@engineering:~$">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className="cursor-text" onClick={() => inputRef.current?.focus()}>
        <div
          ref={scrollRef}
          className="space-y-2 max-h-[360px] overflow-y-auto"
        >
          <div className="space-y-2" aria-live="polite">
            {blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>

          {typing !== null && (
            <p aria-hidden="true">
              <span className="text-tertiary">&gt;</span>{" "}
              <span className="text-on-surface">{typing}</span>
              <span className="terminal-cursor">▮</span>
            </p>
          )}

          {ready && (
            <p className="flex items-center">
              <span className="text-tertiary shrink-0">&gt;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal command input"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="ml-2 flex-1 bg-transparent outline-none text-on-surface caret-tertiary"
              />
            </p>
          )}
        </div>

        {ready && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick commands">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  submit(c);
                  inputRef.current?.focus();
                }}
                className="font-mono text-[11px] text-on-surface-variant border border-outline-variant/40 rounded px-2.5 py-1 hover:border-tertiary hover:text-tertiary transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </TerminalBlock>
  );
}
```

- [ ] **Step 3: Lint the new component**

Run: `npm run lint`
Expected: no errors (the two inline `eslint-disable` comments cover the click-to-focus affordance, which is intentional and backed by the always-available keyboard input + chips).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/instruments/TerminalHero.tsx
git commit -m "feat(terminal): TerminalHero client island + cursor-blink CSS"
```

---

## Task 3: Wire `TerminalHero` into the home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the static hero block**

In `src/app/page.tsx`, replace the entire static terminal block (the `<TerminalBlock title="jayraj@engineering:~$"> … </TerminalBlock>` element, currently spanning roughly lines 45–79) with:

```tsx
        <TerminalHero tenureYears={stats.tenureYears} />
```

Leave everything else in that `<section aria-labelledby="hero-lead">` unchanged (the metrics row, telemetry caption, "See the full record" link, serif lead, CTAs).

- [ ] **Step 2: Fix imports**

At the top of `src/app/page.tsx`:
- Remove `import TerminalBlock from "@/components/instruments/TerminalBlock";`
- Remove `import StatusDot from "@/components/instruments/StatusDot";`
- Add `import TerminalHero from "@/components/instruments/TerminalHero";`

(`stats` is already imported from `@/lib/site`.)

- [ ] **Step 3: Verify no other use of the removed imports**

Run: `grep -nE "TerminalBlock|StatusDot" src/app/page.tsx`
Expected: no matches (if either still appears, it's used elsewhere on the page — keep that import instead of removing it).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors, no unused-import warnings.

- [ ] **Step 5: Build (the real static-export check)**

Run: `npm run build`
Expected: "Compiled successfully" and all routes generate (home included). No prerender errors.

- [ ] **Step 6: Verify the no-JS fallback is in the built HTML**

Run: `grep -o "cat focus.txt" out/index.html | head -1`
Expected: prints `cat focus.txt` — confirming the SSR fallback renders the intro for no-JS crawlers.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(terminal): swap the static home hero for TerminalHero"
```

---

## Task 4: Docs + final verification

**Files:**
- Modify: `docs/knowledge/design-system.md`

- [ ] **Step 1: Document the new instrument**

In `docs/knowledge/design-system.md`, find the instrument-kit list (the section describing `TerminalBlock`, `TickerChip`, `Metric`, `Sparkline`, etc.) and add a bullet:

```markdown
- **`TerminalHero`** — Client island. The interactive home hero: renders inside `TerminalBlock`, auto-types the intro (first session, motion-permitting), accepts typed commands + clickable chips, and navigates via the `terminal.ts` engine. Degrades to the static intro with no JS / reduced motion.
```

- [ ] **Step 2: Full verification sweep**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean; all Vitest tests pass (including the new `terminal.test.ts`); static export builds all routes.

- [ ] **Step 3: Manual checks (dev server)**

Run: `npm run dev`, open http://localhost:3000, and confirm:
- On first load the terminal auto-types the intro, then shows a live `>` prompt + chips.
- Typing `help`, `ls`, `cat thesis.txt`, `whoami`, `./status` works; unknown commands show the error line.
- `open writing` (and a chip click) navigates to `/writing`; `clear` empties the screen.
- Reload in the same tab → intro appears instantly (no re-typing).
- With OS "reduce motion" enabled → no typing animation; intro shows instantly; cursor doesn't blink.
- Resize to mobile width → chips are usable without a keyboard.

- [ ] **Step 4: Commit**

```bash
git add docs/knowledge/design-system.md
git commit -m "docs: note the TerminalHero instrument in the design system"
```

---

## Self-Review notes

- **Spec coverage:** interaction model (auto-play + type + chips) → Task 2; command set incl. navigation + easter eggs → Task 1; pure-engine/thin-UI split → Tasks 1–2; SSR/no-JS fallback → Task 2 lazy-initialized `blocks = buildIntro(ctx)` (rendered on the server) + Task 3 Step 6 grep; flash-free first paint → `useIsomorphicLayoutEffect` clears before paint; reduced-motion + a11y → Task 2 (aria-live on output, aria-label on input, aria-hidden cursor, reduced-motion guard) + Task 1 tones; testing → Task 1 (engine) + Task 4 (build/manual). All covered.
- **Types are consistent across tasks:** `OutputLine`, `Intent`, `CommandResult`, `TerminalContext`, `runCommand`, `listCommands`, `INTRO_SEQUENCE`, `ROUTES` are defined in Task 1 and used unchanged in Task 2.
- **No placeholders:** every code step contains complete code.
```
