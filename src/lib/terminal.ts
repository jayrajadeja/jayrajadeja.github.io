export type Tone = "default" | "accent" | "muted" | "error" | "up";

export interface OutputLine {
  text: string;
  tone?: Tone;
}

export type Intent =
  | { type: "navigate"; href: string }
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
  const name = target.toLowerCase().replace(/^\/|\/$/g, "");
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
