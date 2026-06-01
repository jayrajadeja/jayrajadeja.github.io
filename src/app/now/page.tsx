import type { Metadata } from "next";
import nowData from "@/data/now.json";
import type { NowData } from "@/lib/types";

export const metadata: Metadata = {
  title: "Now",
  description:
    "A dated snapshot of what Jayraj Jadeja is building, reading, watching, and exploring right now.",
};

const now = nowData as NowData;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
      {children}
    </span>
  );
}

export default function NowPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
      {/* ── Header ───────────────────────────────────────────────── */}
      <section aria-labelledby="now-headline" className="mb-20">
        <Eyebrow>/now</Eyebrow>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h1
            id="now-headline"
            className="font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface"
          >
            Now
          </h1>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-outline">
            updated {now.updated}
          </span>
        </div>
        <p className="mt-6 max-w-2xl font-body text-xl md:text-2xl italic leading-relaxed text-on-surface-variant">
          A dated snapshot of what&rsquo;s on my plate — the work, the books,
          and the side quests.
        </p>
        <p className="mt-3 font-body text-base text-on-surface-variant/70">
          The{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary underline underline-offset-4 decoration-tertiary/40 hover:decoration-tertiary"
          >
            /now page
          </a>{" "}
          is a Derek Sivers concept — a public commitment to where you&rsquo;re
          actually spending your energy.
        </p>
      </section>

      {/* ── Data rows ────────────────────────────────────────────── */}
      <section aria-labelledby="now-data-heading" className="mb-24">
        <h2 id="now-data-heading" className="sr-only">
          Current focus
        </h2>

        <dl className="divide-y divide-outline-variant/30 border-t border-outline-variant/30">
          {/* Building */}
          <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-8 gap-y-2 py-8">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-1">
              building
            </dt>
            <dd>
              <p className="font-body text-xl leading-relaxed text-on-surface">
                {now.building}
              </p>
            </dd>
          </div>

          {/* Reading */}
          <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-8 gap-y-2 py-8">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-1">
              reading
            </dt>
            <dd>
              <ul className="space-y-2" aria-label="Currently reading">
                {now.reading.map((title) => (
                  <li
                    key={title}
                    className="flex items-start gap-3 font-body text-lg leading-relaxed text-on-surface-variant"
                  >
                    <span
                      className="font-mono text-tertiary text-xs pt-1.5"
                      aria-hidden="true"
                    >
                      &mdash;
                    </span>
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          {/* Watching */}
          <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-8 gap-y-2 py-8">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-1">
              watching
            </dt>
            <dd>
              <p className="font-body text-xl leading-relaxed text-on-surface-variant">
                {now.watching}
              </p>
            </dd>
          </div>

          {/* Exploring */}
          <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-8 gap-y-2 py-8">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-1">
              exploring
            </dt>
            <dd>
              <p className="font-body text-xl leading-relaxed text-on-surface-variant">
                {now.exploring}
              </p>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
