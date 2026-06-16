import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on static pages: a build-time `new Date()` changes on every
  // deploy regardless of content, so it's noise to crawlers. Posts carry their
  // real publish date from frontmatter.
  const pages = ["", "/work", "/writing", "/interests", "/about", "/now", "/uses"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const posts = getAllPosts().map((post) => ({
    url: `${BASE}/writing/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
