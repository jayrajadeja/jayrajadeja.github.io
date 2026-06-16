import Link from "next/link";
import StatsSection from "@/components/StatsSection";
import TerminalHero from "@/components/instruments/TerminalHero";
import Metric from "@/components/instruments/Metric";
import Eyebrow from "@/components/Eyebrow";
import CtaLink from "@/components/CtaLink";
import { getAllPosts } from "@/lib/blog";
import work from "@/data/work.json";
import now from "@/data/now.json";
import { RESUME_URL, statValue, stats } from "@/lib/site";
import { formatGrouped } from "@/lib/format";
import type { WorkCaseFile, NowData } from "@/lib/types";

const mergeRate = stats.headline.find((h) => h.label === "PRs merged")?.pct ?? 0;

const HERO_METRICS = [
  {
    label: "issues delivered",
    value: formatGrouped(statValue("issues delivered")),
    accent: "primary" as const,
  },
  {
    label: "PR merge rate",
    value: `${mergeRate}%`,
    accent: "tertiary" as const,
  },
  {
    label: "median cycle time",
    value: `${statValue("median cycle time (days)")} days`,
    accent: "primary" as const,
  },
];

const CaseFiles = work as WorkCaseFile[];
const Now = now as NowData;

export default function HomePage() {
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
      {/* ── 1. Terminal hero ─────────────────────────────────────── */}
      <section aria-labelledby="hero-lead" className="mb-28">
        <TerminalHero tenureYears={stats.tenureYears} />

        {/* honest delivery telemetry — static, sourced from stats.json */}
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
          {HERO_METRICS.map((m) => (
            <Metric
              key={m.label}
              label={m.label}
              value={m.value}
              accent={m.accent}
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-outline">
          Delivery telemetry · Jira + GitHub · 2021–2026
        </p>
        <Link
          href="/about"
          className="mt-2 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-tertiary hover:text-on-surface transition-colors"
        >
          See the full record &rarr;
        </Link>

        {/* serif lead — the editorial spine */}
        <div className="mt-12 border-t border-outline-variant/40 pt-10">
          <h1
            id="hero-lead"
            className="font-body font-light text-4xl md:text-5xl leading-[1.05] tracking-tight text-on-surface"
          >
            <span className="text-primary">&ldquo;</span>I take systems apart to
            see how they tick.<span className="text-primary">&rdquo;</span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg md:text-xl leading-relaxed text-on-surface-variant">
            Backend and distributed-systems engineer who reads markets and
            consensus protocols through the same lens — tuning the hot paths of a
            cyber-risk platform, and writing finance × engineering on{" "}
            <a
              href="https://substack.com/@jayrajadeja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary underline underline-offset-4 decoration-tertiary/40 hover:decoration-tertiary"
            >
              Substack
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaLink href={RESUME_URL} icon="description">
              Résumé
            </CtaLink>
            <CtaLink
              href="mailto:jayrajsinh.jadeja399@gmail.com?subject=Hello%20Jayraj"
              variant="secondary"
              icon="mail"
            >
              Email
            </CtaLink>
            <CtaLink
              href="https://www.linkedin.com/in/jayrajadeja/"
              variant="secondary"
              icon="work"
            >
              LinkedIn
            </CtaLink>
          </div>
        </div>
      </section>

      {/* ── 2. Selected work ─────────────────────────────────────── */}
      <section aria-labelledby="work-heading" className="mb-28">
        <div className="flex items-baseline justify-between border-b border-outline-variant/30 pb-4">
          <div className="flex items-baseline gap-4">
            <Eyebrow>/work</Eyebrow>
            <h2
              id="work-heading"
              className="font-headline text-2xl md:text-3xl font-bold tracking-tight"
            >
              Selected Systems
            </h2>
          </div>
          <Link
            href="/work"
            className="hidden sm:inline font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:text-tertiary transition-colors"
          >
            view all &rarr;
          </Link>
        </div>

        <ol className="divide-y divide-outline-variant/30">
          {CaseFiles.slice(0, 3).map((c, i) => (
            <li
              key={c.id}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-8"
            >
              <span
                className="font-mono text-sm text-tertiary"
                aria-hidden="true"
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <div>
                <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                  {c.title}
                </h3>
                <p className="mt-3 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                  {c.summary}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
                  {c.stack.map((s) => (
                    <li
                      key={s}
                      className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-2 py-1"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <Link
          href="/work"
          className="sm:hidden mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:text-tertiary transition-colors"
        >
          view all &rarr;
        </Link>
      </section>

      {/* ── 3. Latest writing ────────────────────────────────────── */}
      <section aria-labelledby="writing-heading" className="mb-28">
        <div className="flex items-baseline gap-4 border-b border-outline-variant/30 pb-4">
          <Eyebrow>/writing</Eyebrow>
          <h2
            id="writing-heading"
            className="font-headline text-2xl md:text-3xl font-bold tracking-tight"
          >
            Latest Writing
          </h2>
        </div>

        <ul className="divide-y divide-outline-variant/30">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="py-8">
                <Link href={`/writing/${post.slug}`} className="group block">
                  <time dateTime={post.date} className="font-mono text-xs uppercase tracking-[0.15em] text-outline">
                    {post.date}
                  </time>
                  <h3 className="mt-2 font-body text-2xl md:text-3xl font-normal leading-snug text-on-surface group-hover:text-tertiary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-3 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
                    read &rarr;
                  </span>
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-6 font-body text-lg text-on-surface-variant">
          More at the intersection of finance and engineering on{" "}
          <a
            href="https://substack.com/@jayrajadeja"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary underline underline-offset-4 decoration-tertiary/40 hover:decoration-tertiary"
          >
            Substack &rarr;
          </a>
        </p>
      </section>

      {/* ── 4. Currently ─────────────────────────────────────────── */}
      <section aria-labelledby="now-heading" className="mb-28">
        <div className="flex items-baseline gap-4 border-b border-outline-variant/30 pb-4">
          <Eyebrow>/now</Eyebrow>
          <h2
            id="now-heading"
            className="font-headline text-2xl md:text-3xl font-bold tracking-tight"
          >
            Currently
          </h2>
          <span className="ml-auto font-mono text-xs uppercase tracking-[0.15em] text-outline">
            {Now.updated}
          </span>
        </div>

        <dl className="divide-y divide-outline-variant/30">
          {[
            { term: "building", value: Now.building },
            { term: "reading", value: Now.reading.join(" · ") },
            { term: "exploring", value: Now.exploring },
          ].map(({ term, value }) => (
            <div
              key={term}
              className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-6 gap-y-1 py-5"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-1">
                {term}
              </dt>
              <dd className="font-body text-lg leading-relaxed text-on-surface-variant">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 5. Stats band (verified metrics) ─────────────────────── */}
      <div className="-mx-8 mb-28">
        <StatsSection />
      </div>

      {/* ── 6. CTA — slim closing ────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className="border-t border-outline-variant/30 pt-10"
      >
        <Eyebrow>/contact</Eyebrow>
        <h2
          id="cta-heading"
          className="mt-3 font-body font-light text-3xl md:text-4xl italic text-on-surface"
        >
          Let&rsquo;s build the next system.
        </h2>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
          Open to backend &amp; distributed-systems roles. Pull the résumé or
          reach out directly — no gatekeeping.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <CtaLink href={RESUME_URL} icon="description">
            Résumé
          </CtaLink>
          <CtaLink
            href="mailto:jayrajsinh.jadeja399@gmail.com?subject=Hello%20Jayraj"
            variant="secondary"
            icon="mail"
          >
            Email
          </CtaLink>
          <CtaLink
            href="https://www.linkedin.com/in/jayrajadeja/"
            variant="secondary"
            icon="work"
          >
            LinkedIn
          </CtaLink>
          <CtaLink
            href="https://github.com/jayrajadeja"
            variant="secondary"
            icon="code"
          >
            GitHub
          </CtaLink>
        </div>
      </section>
    </div>
  );
}
