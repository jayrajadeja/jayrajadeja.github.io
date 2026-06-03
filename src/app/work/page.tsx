import type { Metadata } from "next";
import Link from "next/link";
import work from "@/data/work.json";
import experience from "@/data/experience.json";
import systems from "@/data/systems.json";
import type { WorkCaseFile, ExperienceEntry, StudiedSystem } from "@/lib/types";
import Eyebrow from "@/components/Eyebrow";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Selected Systems",
  description:
    "Case files and experience — distributed systems, event-driven architecture, and full-stack engineering.",
};

const CaseFiles = work as WorkCaseFile[];
const Experience = experience as ExperienceEntry[];
const Flagship = (systems as StudiedSystem[]).filter((s) => s.flagship);

// Derive stack union from all case files, deduped + ordered
const STACK_UNION = Array.from(
  new Set(CaseFiles.flatMap((c) => c.stack))
);

function formatPeriod(start: string, end: string | null): string {
  const endLabel = end ?? "present";
  return `${start} – ${endLabel}`;
}

export default function WorkPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">

      {/* ── 1. Eyebrow + headline + intro ─────────────────────────── */}
      <section aria-labelledby="work-headline" className="mb-20">
        <Eyebrow>/work</Eyebrow>
        <h1
          id="work-headline"
          className="mt-3 font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface"
        >
          Selected Systems
        </h1>
        <p className="mt-6 max-w-2xl font-body text-xl md:text-2xl italic leading-relaxed text-on-surface-variant">
          Five years of backend and distributed-systems engineering — the work
          that shipped, plus the large-scale systems I take apart to sharpen the
          same instincts.
        </p>
      </section>

      {/* ── 2. Case files ─────────────────────────────────────────── */}
      <section aria-labelledby="case-files-heading" className="mb-28">
        <SectionHeader eyebrow="case files" id="case-files-heading">
          What I&rsquo;ve Built
        </SectionHeader>

        <ol className="divide-y divide-outline-variant/30">
          {CaseFiles.map((c, i) => (
            <li
              key={c.id}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-8 gap-y-2 py-10"
            >
              {/* mono index */}
              <span
                className="font-mono text-sm text-tertiary pt-1 select-none"
                aria-hidden="true"
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>

              <div>
                {/* title */}
                <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                  {c.title}
                </h3>

                {/* serif summary */}
                <p className="mt-4 max-w-2xl font-body text-lg md:text-xl leading-relaxed text-on-surface-variant">
                  {c.summary}
                </p>

                {/* depth: problem → approach → hard part → outcome */}
                {(c.problem || c.approach || c.hardPart || c.outcome) && (
                  <dl className="mt-6 space-y-4 max-w-2xl border-l border-outline-variant/30 pl-5">
                    {(
                      [
                        ["problem", c.problem],
                        ["approach", c.approach],
                        ["hard part", c.hardPart],
                        ["outcome", c.outcome],
                      ] as [string, string | undefined][]
                    ).map(([label, value]) =>
                      value ? (
                        <div key={label}>
                          <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary">
                            {label}
                          </dt>
                          <dd className="mt-1 font-body text-base md:text-lg leading-relaxed text-on-surface-variant">
                            {value}
                          </dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                )}

                {c.role && (
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">
                    <span className="text-primary">role ·</span> {c.role}
                  </p>
                )}

                {/* stack chips */}
                <ul
                  className="mt-5 flex flex-wrap gap-2"
                  aria-label={`Stack for ${c.title}`}
                >
                  {c.stack.map((s) => (
                    <li
                      key={s}
                      className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-2 py-1"
                    >
                      {s}
                    </li>
                  ))}
                </ul>

                {/* tags */}
                {c.tags.length > 0 && (
                  <ul
                    className="mt-3 flex flex-wrap gap-x-3 gap-y-1"
                    aria-label={`Tags for ${c.title}`}
                  >
                    {c.tags.map((t) => (
                      <li
                        key={t}
                        className="font-mono text-[11px] uppercase tracking-[0.15em] text-tertiary/70"
                      >
                        #{t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 3. Systems I take apart (studied, not shipped) ────────── */}
      <section aria-labelledby="studied-heading" className="mb-28">
        <SectionHeader eyebrow="studied, not shipped" id="studied-heading">
          Systems I Take Apart
        </SectionHeader>
        <p className="mb-8 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
          The design problems I dig into on my own time — how the big systems
          actually work. Studied, not shipped; the same lens I bring to the work
          above.
        </p>
        <ul
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          aria-label="Systems studied"
        >
          {Flagship.map((s) => (
            <li
              key={s.id}
              className="border border-outline-variant/40 rounded-lg p-6 bg-surface-container-low"
            >
              <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface">
                {s.system}
              </h3>
              <p className="mt-2 font-body text-base leading-relaxed text-on-surface-variant">
                {s.note}
              </p>
            </li>
          ))}
        </ul>
        <Link
          href="/interests"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.2em] text-tertiary hover:text-on-surface transition-colors"
        >
          More systems I&rsquo;ve studied &rarr;
        </Link>
      </section>

      {/* ── 4. Experience timeline ────────────────────────────────── */}
      <section aria-labelledby="experience-heading" className="mb-28">
        <SectionHeader eyebrow="experience" id="experience-heading">
          Where I&rsquo;ve Worked
        </SectionHeader>

        <ol className="mt-2">
          {Experience.map((e, i) => (
            <li
              key={e.id}
              className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-8 gap-y-2 py-10 border-b border-outline-variant/30 last:border-b-0"
            >
              {/* date rail */}
              <div className="flex md:flex-col gap-x-4 gap-y-1">
                <time
                  dateTime={e.start}
                  className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary"
                >
                  {formatPeriod(e.start, e.end)}
                </time>
                {e.location && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-outline mt-0 md:mt-1">
                    {e.location}
                  </span>
                )}
                {/* vertical connector line (desktop only) */}
                {i < Experience.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden md:block w-px h-full min-h-[2rem] bg-outline-variant/30 mt-3 ml-0"
                  />
                )}
              </div>

              {/* content */}
              <div>
                <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                  {e.title}
                </h3>
                <p className="mt-1 font-mono text-sm uppercase tracking-[0.15em] text-on-surface-variant">
                  {e.org}
                </p>
                <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                  {e.summary}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 5. Stack & specialties ────────────────────────────────── */}
      <section aria-labelledby="stack-heading" className="border-t border-outline-variant/30 pt-10">
        <div className="flex items-baseline gap-4 mb-6">
          <Eyebrow>stack</Eyebrow>
          <h2
            id="stack-heading"
            className="font-headline text-2xl md:text-3xl font-bold tracking-tight"
          >
            Stack &amp; Specialties
          </h2>
        </div>

        <ul
          className="flex flex-wrap gap-3"
          aria-label="Technology stack and specialties"
        >
          {STACK_UNION.map((s) => (
            <li
              key={s}
              className="font-mono text-sm uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-3 py-1.5"
            >
              {s}
            </li>
          ))}
          {/* curated specialties not already in the union */}
          {["distributed systems", "TypeScript", "MySQL"].map((s) =>
            STACK_UNION.includes(s) ? null : (
              <li
                key={s}
                className="font-mono text-sm uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-3 py-1.5"
              >
                {s}
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
}
