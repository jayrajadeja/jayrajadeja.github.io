import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";

export const dynamic = "force-static";

const BASE = "https://jayrajadeja.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/writing", "/interests", "/about", "/now", "/uses"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const posts = getAllSlugs().map((slug) => ({
    url: `${BASE}/writing/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
