import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import fieldnotesData from "@/data/fieldnotes.json";
import type { FieldNote } from "@/lib/types";
import Eyebrow from "@/components/Eyebrow";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  alternates: { canonical: "/writing" },
  title: "The Desk",
  description:
    "Finance × engineering essays and field notes — where order books meet consensus protocols.",
};

const FieldNotes = fieldnotesData as FieldNote[];

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">

      {/* ── 1. Eyebrow + display headline + serif intro ───────────── */}
      <section aria-labelledby="writing-headline" className="mb-20">
        <Eyebrow>/writing</Eyebrow>
        <h1
          id="writing-headline"
          className="mt-3 font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface"
        >
          The Desk
        </h1>
        <p className="mt-6 max-w-2xl font-body text-xl md:text-2xl italic leading-relaxed text-on-surface-variant">
          Finance and engineering live closer together than most textbooks admit.
          This is where I work that intersection — in long-form and in field notes.
        </p>
      </section>

      {/* ── 2. Substack callout ───────────────────────────────────── */}
      <section aria-labelledby="substack-heading" className="mb-20">
        <div className="border border-outline-variant/40 rounded-lg p-8 bg-surface-container-low">
          <div className="flex items-start gap-4">
            <span
              className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary pt-1 shrink-0"
              aria-hidden="true"
            >
              ⊕
            </span>
            <div>
              <Eyebrow>substack</Eyebrow>
              <h2
                id="substack-heading"
                className="mt-2 font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface"
              >
                Finance × Engineering
              </h2>
              <p className="mt-4 max-w-xl font-body text-lg leading-relaxed text-on-surface-variant">
                A matching engine and a consensus protocol are solving cousins of
                the same problem: agreeing on an ordered truth under contention,
                fast. The newsletter digs into storage for market data, the cost
                of latency, and how big financial systems actually work —
                written the way I&rsquo;d explain them to a sharp colleague.
              </p>
              <a
                href="https://substack.com/@jayrajadeja"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block font-mono text-sm uppercase tracking-[0.2em] text-tertiary hover:text-on-surface transition-colors border border-tertiary/40 hover:border-on-surface/40 rounded px-4 py-2"
              >
                Read on Substack &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Long-form posts ────────────────────────────────────── */}
      <section aria-labelledby="longform-heading" className="mb-28">
        <SectionHeader eyebrow="long-form" id="longform-heading">
          Essays
        </SectionHeader>

        {posts.length === 0 ? (
          <p className="py-10 font-body text-lg text-on-surface-variant italic">
            First essay coming soon.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant/30">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="py-10">
                  <Link href={`/writing/${post.slug}`} className="group block">
                    {/* date + tags row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                      <time dateTime={post.date} className="font-mono text-xs uppercase tracking-[0.15em] text-outline">
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

                    {/* title */}
                    <h3 className="font-body text-2xl md:text-3xl font-normal leading-snug text-on-surface group-hover:text-tertiary transition-colors">
                      {post.title}
                    </h3>

                    {/* excerpt */}
                    <p className="mt-3 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                      {post.excerpt}
                    </p>

                    <span className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
                      read &rarr;
                    </span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── 4. Field notes grid ───────────────────────────────────── */}
      <section aria-labelledby="fieldnotes-heading">
        <SectionHeader eyebrow="field notes" id="fieldnotes-heading">
          Field Notes
        </SectionHeader>

        <p className="mb-8 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
          Short observations from the trenches — things worth writing down after
          a late-night debugging session or a deep dive into a data-store paper.
        </p>

        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-label="Field notes"
        >
          {FieldNotes.map((note) => (
            <li
              key={note.id}
              className="border border-outline-variant/40 rounded-lg p-6 bg-surface-container-low flex flex-col gap-3"
            >
              {/* mono number */}
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary">
                #{note.number}
              </span>

              {/* title */}
              <p className="font-body text-base leading-snug text-on-surface">
                {note.title}
              </p>

              {/* italic serif quote */}
              <blockquote className="font-body italic text-sm leading-relaxed text-on-surface-variant border-l-2 border-primary/40 pl-3">
                {note.quote}
              </blockquote>

              {/* tag */}
              <span className="mt-auto font-mono text-[11px] uppercase tracking-[0.15em] text-outline">
                {note.tag}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
