import { describe, it, expect } from "vitest";
import { sortByDateDesc } from "@/lib/blog";
import type { BlogPost } from "@/lib/types";

const post = (slug: string, date: string): BlogPost => ({
  slug,
  date,
  title: slug,
  tags: [],
  excerpt: "",
  content: "",
});

describe("sortByDateDesc", () => {
  it("orders posts newest-first", () => {
    const sorted = sortByDateDesc([
      post("old", "2024-01-01"),
      post("new", "2026-05-01"),
      post("mid", "2025-03-01"),
    ]);
    expect(sorted.map((p) => p.slug)).toEqual(["new", "mid", "old"]);
  });

  it("sorts posts with missing or invalid dates last", () => {
    const sorted = sortByDateDesc([
      post("nodate", ""),
      post("valid", "2026-01-01"),
      post("garbage", "not-a-date"),
    ]);
    expect(sorted[0].slug).toBe("valid");
    expect(sorted.map((p) => p.slug).slice(1)).toEqual(
      expect.arrayContaining(["nodate", "garbage"]),
    );
  });

  it("does not mutate the input array", () => {
    const input = [post("a", "2024-01-01"), post("b", "2026-01-01")];
    const before = input.map((p) => p.slug);
    sortByDateDesc(input);
    expect(input.map((p) => p.slug)).toEqual(before);
  });
});
