import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { remark } from "remark";
import html from "remark-html";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <div className="pt-32 pb-24 velocity-grid min-h-screen">
      <article className="max-w-3xl mx-auto px-8">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-headline text-xs font-bold text-outline uppercase tracking-widest">
              {new Date(post.date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })
                .toUpperCase()}
            </span>
            <span className="font-headline text-[10px] text-tertiary uppercase tracking-widest">
              {post.tags.join(" \u2022 ")}
            </span>
          </div>
          <h1 className="font-body text-4xl md:text-5xl text-on-surface leading-tight mb-6">
            {post.title}
          </h1>
          <p className="font-body text-xl text-on-surface-variant leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-headline prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:text-on-surface prose-h2:mt-12 prose-h2:mb-4
            prose-p:font-body prose-p:text-on-surface-variant prose-p:leading-relaxed
            prose-li:font-body prose-li:text-on-surface-variant
            prose-strong:text-primary"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className="mt-20 pt-8 border-t border-outline-variant/20">
          <Link
            href="/blog"
            className="font-headline text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:text-tertiary transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Archive
          </Link>
        </div>
      </article>
    </div>
  );
}
