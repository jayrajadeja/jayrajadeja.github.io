import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "writing");

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      tags: data.tags ?? [],
      excerpt: data.excerpt ?? "",
      content,
    };
  });

  return posts.sort((a, b) => {
    const ta = a.date ? new Date(a.date).getTime() : 0;
    const tb = b.date ? new Date(b.date).getTime() : 0;
    return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? "",
    content,
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
