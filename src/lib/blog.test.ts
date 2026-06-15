import { describe, it, expect } from "vitest";
import { sortByDateDesc, buildPost } from "@/lib/blog";
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

describe("buildPost", () => {
  const valid = `---
title: "Test Post"
date: "2026-01-01"
tags: ["a", "b"]
excerpt: "A short excerpt."
---

Body content here.`;

  it("parses valid frontmatter into a typed post", () => {
    const p = buildPost("test-post", valid);
    expect(p).toMatchObject({
      slug: "test-post",
      title: "Test Post",
      date: "2026-01-01",
      tags: ["a", "b"],
      excerpt: "A short excerpt.",
    });
    expect(p.content.trim()).toBe("Body content here.");
  });

  it("throws naming the missing field when title is absent", () => {
    const noTitle = `---\ndate: "2026-01-01"\n---\nBody`;
    expect(() => buildPost("broken", noTitle)).toThrowError(/broken\.mdx.*title/);
  });

  it("throws when date is absent", () => {
    const noDate = `---\ntitle: "X"\n---\nBody`;
    expect(() => buildPost("nodate", noDate)).toThrowError(/date/);
  });

  it("defaults optional tags and excerpt to safe values", () => {
    const minimal = `---\ntitle: "X"\ndate: "2026-01-01"\n---\nBody`;
    const p = buildPost("minimal", minimal);
    expect(p.tags).toEqual([]);
    expect(p.excerpt).toBe("");
  });

  it("normalizes an unquoted YAML date to an ISO date string", () => {
    const dateObj = `---\ntitle: "X"\ndate: 2026-01-01\n---\nBody`;
    expect(buildPost("d", dateObj).date).toBe("2026-01-01");
  });
});
