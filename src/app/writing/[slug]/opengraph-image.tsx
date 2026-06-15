import { ImageResponse } from "next/og";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Jayraj Jadeja — essay";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Writing";
  const date = post?.date ?? "";
  const tags = post?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0c0e0f",
          color: "#e5e2e1",
        }}
      >
        <div style={{ color: "#4cd6ff", fontSize: 28, letterSpacing: 4 }}>
          {`jayraj@engineering:~$ cat writing/${slug}.mdx`}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, color: "#9aa0a1", marginTop: 28 }}>
            {[date, ...tags.map((t) => `#${t}`)].filter(Boolean).join("   ·   ")}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#ffb4a8" }}>
          Jayraj Jadeja — finance × engineering
        </div>
      </div>
    ),
    { ...size },
  );
}
