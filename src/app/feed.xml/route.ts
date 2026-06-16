import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// Statically generated at build (output: "export") → emitted as out/feed.xml.
export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s.replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[
        c
      ]!,
  );
}

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/writing/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${p.slug}</guid>${
        p.date ? `\n      <pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ""
      }
      <description>${escapeXml(p.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jayraj Jadeja — Writing</title>
    <link>${SITE_URL}/writing</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Finance × engineering essays and field notes — where order books meet consensus protocols.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
