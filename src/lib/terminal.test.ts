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
