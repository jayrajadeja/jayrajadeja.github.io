import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "writing");

/**
 * Parse + validate one post's raw file contents into a typed BlogPost.
 * Throws (failing the build) when required frontmatter is missing so a
 * malformed post is caught at build time rather than silently rendering blank.
 * Pure — takes the raw string, so it is unit-testable without the filesystem.
 */
export function buildPost(slug: string, fileContents: string): BlogPost {
  const { data, content } = matter(fileContents);

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date ?? "").trim();

  const missing: string[] = [];
  if (!title) missing.push("title");
  if (!date) missing.push("date");
  if (missing.length > 0) {
    throw new Error(
      `content/writing/${slug}.mdx is missing required frontmatter: ${missing.join(", ")}`,
    );
  }

  return {
    slug,
    title,
    date,
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    content,
  };
}

/** Sort posts newest-first; missing/invalid dates sort last (NaN-safe, non-mutating). */
export function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const ta = a.date ? new Date(a.date).getTime() : 0;
    const tb = b.date ? new Date(b.date).getTime() : 0;
    return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
  });
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const fileContents = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    return buildPost(slug, fileContents);
  });

  return sortByDateDesc(posts);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return buildPost(slug, fs.readFileSync(filePath, "utf-8"));
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
