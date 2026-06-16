import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { remark } from "remark";
import html from "remark-html";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  // The colocated opengraph-image.tsx auto-populates og:image (and Twitter
  // falls back to it), so no manual `images` entry is needed here.
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/writing/${slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Sibling posts for prev/next nav (getAllPosts is newest-first).
  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt,
                datePublished: post.date,
                dateModified: post.date,
                image: [`${SITE_URL}/writing/${slug}/opengraph-image`],
                author: { "@id": `${SITE_URL}/#person` },
                publisher: { "@id": `${SITE_URL}/#person` },
                url: `${SITE_URL}/writing/${slug}`,
                mainEntityOfPage: `${SITE_URL}/writing/${slug}`,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Writing",
                    item: `${SITE_URL}/writing`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: post.title,
                    item: `${SITE_URL}/writing/${slug}`,
                  },
                ],
              },
            ],
          }),
        }}
      />

      {/* ── breadcrumb ────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="mb-12 font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-tertiary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-outline">
            /
          </li>
          <li>
            <Link
              href="/writing"
              className="hover:text-tertiary transition-colors"
            >
              Writing
            </Link>
          </li>
          <li aria-hidden="true" className="text-outline">
            /
          </li>
          <li className="text-tertiary/70 normal-case tracking-normal truncate max-w-[60vw]">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* ── post header ───────────────────────────────────────────── */}
      <header className="mb-12 border-b border-outline-variant/40 pb-10">
        {/* mono date + tags eyebrow */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
          <time
            dateTime={post.date}
            className="font-mono text-xs uppercase tracking-[0.15em] text-outline"
          >
            {post.date}
          </time>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-tertiary/70"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* post title — serif (editorial/broadsheet register) */}
        <h1 className="font-body font-normal text-4xl md:text-5xl leading-[1.1] tracking-tight text-on-surface">
          {post.title}
        </h1>

        {/* serif excerpt lead */}
        {post.excerpt && (
          <p className="mt-6 font-body italic text-xl md:text-2xl leading-relaxed text-on-surface-variant">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* ── prose body ────────────────────────────────────────────── */}
      <div
        className={[
          "prose prose-invert prose-lg max-w-none",
          "prose-headings:font-headline prose-headings:tracking-tight prose-headings:text-on-surface",
          "prose-p:font-body prose-p:text-on-surface-variant prose-p:leading-relaxed",
          "prose-strong:text-primary prose-strong:font-semibold",
          "prose-a:text-tertiary prose-a:underline prose-a:underline-offset-4 prose-a:decoration-tertiary/40 hover:prose-a:decoration-tertiary",
          "prose-blockquote:border-l-primary/40 prose-blockquote:text-on-surface-variant prose-blockquote:italic",
          "prose-code:text-primary prose-code:bg-surface-container-low prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm",
          "prose-pre:bg-surface-container-low prose-pre:border prose-pre:border-outline-variant/40",
          "prose-hr:border-outline-variant/40",
          "prose-li:text-on-surface-variant prose-li:font-body",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* ── footer nav ────────────────────────────────────────────── */}
      <footer className="mt-16 pt-10 border-t border-outline-variant/40">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:text-tertiary transition-colors"
        >
          &larr; Back to the desk
        </Link>

        {(older || newer) && (
          <nav
            aria-label="More posts"
            className="mt-8 grid grid-cols-2 gap-4 border-t border-outline-variant/40 pt-8"
          >
            <div>
              {older && (
                <Link href={`/writing/${older.slug}`} className="group block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-outline">
                    &larr; Older
                  </span>
                  <span className="mt-1 block font-body text-on-surface-variant group-hover:text-tertiary transition-colors">
                    {older.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {newer && (
                <Link href={`/writing/${newer.slug}`} className="group block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-outline">
                    Newer &rarr;
                  </span>
                  <span className="mt-1 block font-body text-on-surface-variant group-hover:text-tertiary transition-colors">
                    {newer.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </footer>
    </div>
  );
}
