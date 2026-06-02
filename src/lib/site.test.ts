import { describe, it, expect } from "vitest";
import { statValue, stats } from "@/lib/site";

describe("statValue", () => {
  it("returns the value for a known headline label", () => {
    const known = stats.headline[0];
    expect(statValue(known.label)).toBe(known.value);
  });
  it("falls back to 0 for an unknown label", () => {
    expect(statValue("__does_not_exist__")).toBe(0);
  });
});
