import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogArticle from "@/components/BlogArticle";
import VelocityNugget from "@/components/VelocityNugget";
import nuggetsData from "@/data/nuggets.json";
import type { VelocityNugget as VelocityNuggetType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering thoughts at the intersection of high-velocity logic and curated documentation.",
};

const nuggets: VelocityNuggetType[] = nuggetsData;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-32 pb-24 velocity-grid min-h-screen">
      <div className="max-w-4xl mx-auto px-8">
        <header className="mb-20">
          <span className="font-headline text-tertiary uppercase tracking-[0.3em] text-xs font-bold block mb-4">
            The Archive
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter text-on-background leading-none">
            TECHNICAL <br />
            <span className="text-primary italic font-body font-light">
              Nuggets.
            </span>
          </h1>
          <p className="font-body text-xl text-on-surface-variant mt-8 max-w-xl leading-relaxed">
            Engineering thoughts at the intersection of high-velocity logic and
            curated documentation. A linear feed of code, architecture, and
            systems.
          </p>
        </header>

        <div className="flex flex-col gap-16 md:gap-24 relative">
          {posts.slice(0, 2).map((post) => (
            <BlogArticle key={post.slug} post={post} />
          ))}

          {nuggets.length > 0 && (
            <>
              <div className="w-full h-px bg-primary/10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {nuggets.map((nugget, i) => (
                  <VelocityNugget
                    key={nugget.id}
                    nugget={nugget}
                    showBorder={i > 0}
                  />
                ))}
              </div>
            </>
          )}

          {posts.slice(2).map((post) => (
            <BlogArticle key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-32 flex justify-center">
          <button className="font-headline text-xs font-bold uppercase tracking-[0.5em] text-outline hover:text-primary transition-colors px-12 py-4 border border-outline-variant hover:border-primary">
            LOAD OLDER RECORDS
          </button>
        </div>
      </div>
    </div>
  );
}
