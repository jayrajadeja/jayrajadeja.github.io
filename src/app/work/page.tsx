import type { Metadata } from "next";
import work from "@/data/work.json";
import experience from "@/data/experience.json";
import type { WorkCaseFile, ExperienceEntry } from "@/lib/types";

export const metadata: Metadata = {
  title: "Selected Systems",
  description:
    "Case files and experience — distributed systems, event-driven architecture, and full-stack engineering.",
};

const CaseFiles = work as WorkCaseFile[];
const Experience = experience as ExperienceEntry[];

// Derive stack union from all case files, deduped + ordered
const STACK_UNION = Array.from(
  new Set(CaseFiles.flatMap((c) => c.stack))
);

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
      {children}
    </span>
  );
}

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
          that shipped.
        </p>
      </section>

      {/* ── 2. Case files ─────────────────────────────────────────── */}
      <section aria-labelledby="case-files-heading" className="mb-28">
        <div className="flex items-baseline gap-4 border-b-2 border-on-surface pb-4 mb-2">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
            case files
          </span>
          <h2
            id="case-files-heading"
            className="font-headline text-2xl md:text-3xl font-bold tracking-tight"
          >
            What I&rsquo;ve Built
          </h2>
        </div>

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

      {/* ── 3. Experience timeline ────────────────────────────────── */}
      <section aria-labelledby="experience-heading" className="mb-28">
        <div className="flex items-baseline gap-4 border-b-2 border-on-surface pb-4 mb-2">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
            experience
          </span>
          <h2
            id="experience-heading"
            className="font-headline text-2xl md:text-3xl font-bold tracking-tight"
          >
            Where I&rsquo;ve Worked
          </h2>
        </div>

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

      {/* ── 4. Stack & specialties ────────────────────────────────── */}
      <section aria-labelledby="stack-heading" className="border-t-2 border-on-surface pt-10">
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
