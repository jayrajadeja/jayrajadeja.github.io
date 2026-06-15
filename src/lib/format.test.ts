import { describe, it, expect } from "vitest";
import { deltaDirection, formatDelta, formatGrouped } from "@/lib/format";

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

describe("formatGrouped", () => {
  it("adds thousands separators", () => {
    expect(formatGrouped(1024873)).toBe("1,024,873");
  });
  it("handles zero", () => {
    expect(formatGrouped(0)).toBe("0");
  });
  it("handles small numbers without separator", () => {
    expect(formatGrouped(42)).toBe("42");
  });
});
