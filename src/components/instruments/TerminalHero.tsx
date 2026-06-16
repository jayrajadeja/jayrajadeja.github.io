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
        <span className="text-tertiary" aria-hidden="true">&gt;</span>{" "}
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
      if (!cancelled) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
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

  return (
    <TerminalBlock title="jayraj@engineering:~$">
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
              <span className="text-tertiary shrink-0" aria-hidden="true">&gt;</span>
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
