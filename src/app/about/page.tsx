import type { Metadata } from "next";
import CountUp from "@/components/instruments/CountUp";
import Sparkline from "@/components/instruments/Sparkline";
import StatusDot from "@/components/instruments/StatusDot";
import Eyebrow from "@/components/Eyebrow";
import SectionHeader from "@/components/SectionHeader";
import stats from "@/data/stats.json";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bio, education, verified delivery metrics, and how to reach Jayraj Jadeja — backend and distributed-systems engineer.",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function metricVal(label: string): number {
  return stats.headline.find((h) => h.label === label)?.value ?? 0;
}

// ── Data slices ───────────────────────────────────────────────────────────────

const resolvedPct =
  stats.headline.find((h) => h.label === "issues resolved")?.pct ?? 0;
const mergedPct =
  stats.headline.find((h) => h.label === "PRs merged")?.pct ?? 0;

const HEADLINE_METRICS = [
  {
    label: "issues delivered",
    end: metricVal("issues delivered"),
    unit: undefined,
    accent: "primary" as const,
  },
  {
    label: `resolved (${resolvedPct}%)`,
    end: metricVal("issues resolved"),
    unit: undefined,
    accent: "primary" as const,
  },
  {
    label: "pull requests",
    end: metricVal("pull requests"),
    unit: undefined,
    accent: "tertiary" as const,
  },
  {
    label: `merged (${mergedPct}%)`,
    end: metricVal("PRs merged"),
    unit: undefined,
    accent: "tertiary" as const,
  },
  {
    label: "lines changed",
    end: metricVal("lines changed"),
    unit: undefined,
    accent: "primary" as const,
  },
  {
    label: "commits",
    end: metricVal("commits"),
    unit: undefined,
    accent: "primary" as const,
  },
  {
    label: "files changed",
    end: metricVal("files changed"),
    unit: undefined,
    accent: "tertiary" as const,
  },
  {
    label: "repositories",
    end: metricVal("repositories"),
    unit: undefined,
    accent: "tertiary" as const,
  },
  {
    label: "review submissions",
    end: metricVal("review submissions"),
    unit: undefined,
    accent: "primary" as const,
  },
  {
    label: "median cycle time",
    end: metricVal("median cycle time (days)"),
    unit: " days",
    accent: "tertiary" as const,
  },
];

// Bar width as a percentage of the max count in issuesByType
const maxTypeCount = Math.max(...stats.issuesByType.map((t) => t.count));
const maxCreated = Math.max(...stats.issuesByYear.map((r) => r.created));
const maxMerged = Math.max(...stats.prsByYear.map((r) => r.merged));

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">

      {/* ── 1. Eyebrow + headline + serif intro ──────────────────── */}
      <section aria-labelledby="about-headline" className="mb-20">
        <Eyebrow>/about</Eyebrow>
        <h1
          id="about-headline"
          className="mt-3 font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface"
        >
          About
        </h1>
        <p className="mt-6 max-w-2xl font-body text-xl md:text-2xl italic leading-relaxed text-on-surface-variant">
          The full record — who I am, how I work, and how to reach me.
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-outline">
          <StatusDot color="up">open to new opportunities · {stats.tenureYears} years in engineering</StatusDot>
        </p>
      </section>

      {/* ── 2. Bio ───────────────────────────────────────────────── */}
      <section aria-labelledby="bio-heading" className="mb-24">
        <SectionHeader eyebrow="bio" id="bio-heading">
          Who I Am
        </SectionHeader>

        <div className="max-w-2xl space-y-6 font-body text-lg md:text-xl leading-relaxed text-on-surface-variant">
          <p>
            I&rsquo;m a Software Engineer II working on the
            backend and full-stack of an enterprise cyber-risk-quantification platform
            — Go services, React/TypeScript frontends, and the distributed systems
            infrastructure that ties them together. My day is mostly MySQL query
            optimization, event-driven architecture, and getting Temporal workflows to
            behave across regions. Five-plus years in and the job still surprises me.
          </p>
          <p>
            My instinct with any system is to take it apart and see what actually makes
            it fast. That curiosity runs from the hot paths in our Go services to
            architectural breakdowns of YouTube&rsquo;s video pipeline and financial
            data stores — deep dives I do on the side because the design problems are
            genuinely interesting, not because they&rsquo;re on a roadmap. Designing
            Data-Intensive Applications lives permanently on my desk.
          </p>
          <p>
            Alongside the engineering work I write on{" "}
            <a
              href="https://substack.com/@jayrajadeja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary underline underline-offset-4 decoration-tertiary/40 hover:decoration-tertiary"
            >
              Substack
            </a>{" "}
            at the intersection of finance and engineering — market structure,
            NASDAQ fundamentals, and what high-performance software can learn from
            how trading systems are built. Good tech is OP, and I&rsquo;ll call it
            that.
          </p>
        </div>
      </section>

      {/* ── 3. By the numbers ────────────────────────────────────── */}
      <section aria-labelledby="metrics-heading" className="mb-24">
        <SectionHeader eyebrow="metrics" id="metrics-heading">
          By the Numbers
        </SectionHeader>

        {/* 3a. Headline metric grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-8 mb-12">
          {HEADLINE_METRICS.map((m) => {
            const color =
              m.accent === "tertiary" ? "text-tertiary" : "text-primary";
            return (
              <div key={m.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-outline">
                  {m.label}
                </div>
                <div className={`font-mono text-2xl font-bold ${color}`}>
                  <CountUp end={m.end} />
                  {m.unit && <span className="text-sm">{m.unit}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3b. Year-over-year sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Issues by year */}
          <div className="bg-surface-container-low rounded-lg px-6 py-5 border border-outline-variant/30">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary mb-4">
              Issues — created per year
            </p>
            <div className="flex items-end gap-1 mb-2" aria-label="Issues created per year bar chart">
              {stats.issuesByYear.map((y) => {
                const heightPct = Math.round((y.created / maxCreated) * 100);
                return (
                  <div key={y.year} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary/40 rounded-sm"
                      style={{ height: `${heightPct * 0.48}px` }}
                      aria-label={`${y.year}: ${y.created} created`}
                    />
                    <span className="font-mono text-[10px] text-outline">{y.year}</span>
                  </div>
                );
              })}
            </div>
            <Sparkline
              points={stats.issuesByYear.map((y) => y.created)}
              className="text-primary/70 mt-2"
            />
            <p className="mt-3 font-mono text-[11px] text-outline">
              {stats.issuesByYear.reduce((s, y) => s + y.created, 0)} total ·{" "}
              ~{stats.cadence.issuesPerYear}/yr avg
            </p>
          </div>

          {/* PRs by year */}
          <div className="bg-surface-container-low rounded-lg px-6 py-5 border border-outline-variant/30">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary mb-4">
              Pull requests — merged per year
            </p>
            <div className="flex items-end gap-1 mb-2" aria-label="Pull requests merged per year bar chart">
              {stats.prsByYear.map((y) => {
                const heightPct = Math.round((y.merged / maxMerged) * 100);
                return (
                  <div key={y.year} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-tertiary/40 rounded-sm"
                      style={{ height: `${heightPct * 0.48}px` }}
                      aria-label={`${y.year}: ${y.merged} merged`}
                    />
                    <span className="font-mono text-[10px] text-outline">{y.year}</span>
                  </div>
                );
              })}
            </div>
            <Sparkline
              points={stats.prsByYear.map((y) => y.merged)}
              className="text-tertiary/70 mt-2"
            />
            <p className="mt-3 font-mono text-[11px] text-outline">
              {stats.prsByYear.reduce((s, y) => s + y.merged, 0)} total ·{" "}
              ~{stats.cadence.prsPerMonth}/mo avg
            </p>
          </div>
        </div>

        {/* 3c. Issues by type breakdown */}
        <div className="bg-surface-container-low rounded-lg px-6 py-6 border border-outline-variant/30 mb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary mb-6">
            Issue breakdown by type
          </p>
          <ul className="space-y-3" aria-label="Issues broken down by type">
            {stats.issuesByType.map((t) => {
              const widthPct = Math.round((t.count / maxTypeCount) * 100);
              return (
                <li key={t.type} className="flex items-center gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-surface-variant w-36 shrink-0">
                    {t.type}
                  </span>
                  <div
                    className="relative flex-1 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden"
                    aria-label={`${t.count} issues`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/60 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-outline w-10 text-right">
                    {t.count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Caption */}
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-outline">
          Verified across Jira + GitHub · 2021–2026 · Aggregate only
        </p>
      </section>

      {/* ── 4. Education ─────────────────────────────────────────── */}
      <section aria-labelledby="education-heading" className="mb-24">
        <SectionHeader eyebrow="education" id="education-heading">
          Education
        </SectionHeader>

        <ol className="divide-y divide-outline-variant/30">
          <li className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-8 gap-y-2 py-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary">
                2017 – 2021
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-outline mt-1">
                Noida, India
              </p>
            </div>
            <div>
              <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                Jaypee Institute of Information Technology
              </h3>
              <p className="mt-1 font-mono text-sm uppercase tracking-[0.12em] text-on-surface-variant">
                B.Tech — Computer Science
              </p>
              <p className="mt-3 font-body text-lg leading-relaxed text-on-surface-variant">
                8.1 CGPA. Four years of algorithms, systems design, and figuring
                out that distributed computing is the most interesting problem in
                software.
              </p>
            </div>
          </li>

          <li className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-8 gap-y-2 py-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary">
                Schooling
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-outline mt-1">
                Vindhyanagar, India
              </p>
            </div>
            <div>
              <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                Delhi Public School, Vindhyanagar
              </h3>
              <p className="mt-1 font-mono text-sm uppercase tracking-[0.12em] text-on-surface-variant">
                CBSE
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* ── 5. Résumé + contact ──────────────────────────────────── */}
      <section
        aria-labelledby="contact-heading"
        className="border-t border-outline-variant/30 pt-10"
      >
        <Eyebrow>/contact</Eyebrow>
        <h2
          id="contact-heading"
          className="mt-3 font-body font-light text-3xl md:text-4xl italic text-on-surface"
        >
          Get in touch.
        </h2>

        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
          Open to backend and distributed-systems roles. Reach out directly or
          pull the résumé — no gatekeeping.
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://drive.google.com/file/d/1tleUFEbGJ4Se847v0RVS3qQ_4kZL-dS0/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] bg-primary text-on-primary px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">
              description
            </span>
            View Résumé
          </a>
          <a
            href="mailto:jayrajsinh.jadeja399@gmail.com"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] border border-outline-variant/60 text-on-surface px-5 py-2.5 rounded-md hover:border-tertiary hover:text-tertiary transition-colors"
          >
            <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">
              mail
            </span>
            Email me
          </a>
        </div>

        {/* Secondary links */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {[
            {
              label: "GitHub",
              href: "https://github.com/jayrajadeja",
              icon: "code",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/jayrajadeja/",
              icon: "work",
            },
            {
              label: "Substack",
              href: "https://substack.com/@jayrajadeja",
              icon: "edit_note",
            },
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] text-on-surface-variant hover:text-tertiary transition-colors"
            >
              <span
                className="material-symbols-outlined text-base leading-none"
                aria-hidden="true"
              >
                {icon}
              </span>
              {label}
              <span aria-hidden="true">&rarr;</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
