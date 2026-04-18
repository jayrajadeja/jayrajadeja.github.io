import Link from "next/link";
import type { BlogPost } from "@/lib/types";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
    .toUpperCase();
}

export default function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex flex-col md:flex-row gap-6 md:gap-12">
      <div className="md:w-32 shrink-0">
        <span className="font-headline text-xs font-bold text-outline uppercase tracking-widest block">
          {formatDate(post.date)}
        </span>
        <span className="font-headline text-[10px] text-tertiary uppercase tracking-widest mt-1 block">
          {post.tags.join(" \u2022 ")}
        </span>
      </div>
      <div className="flex-grow">
        <h2 className="font-body text-3xl md:text-4xl text-on-surface group-hover:text-primary transition-colors duration-300 leading-tight">
          {post.title}
        </h2>
        <p className="font-body text-lg text-on-surface-variant mt-4 leading-relaxed max-w-2xl">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Link
            href={`/blog/${post.slug}`}
            className="font-headline text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:text-tertiary transition-all"
          >
            Read Entry
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
