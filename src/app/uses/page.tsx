import type { Metadata } from "next";
import usesData from "@/data/uses.json";
import type { UsesData } from "@/lib/types";
import Eyebrow from "@/components/Eyebrow";

export const metadata: Metadata = {
  alternates: { canonical: "/uses" },
  title: "Uses",
  description:
    "The editors, terminals, languages, data tooling, and AI in the loop behind Jayraj Jadeja's engineering work.",
};

const uses = usesData as UsesData;

export default function UsesPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
      {/* ── Header ───────────────────────────────────────────────── */}
      <section aria-labelledby="uses-headline" className="mb-20">
        <Eyebrow>/uses</Eyebrow>
        <h1
          id="uses-headline"
          className="mt-3 font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface"
        >
          Uses
        </h1>
        <p className="mt-6 max-w-2xl font-body text-xl md:text-2xl italic leading-relaxed text-on-surface-variant">
          The tools behind the work — editors, terminals, languages, data, and
          the AI in the loop.
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-outline">
          updated {uses.updated}
        </p>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section aria-labelledby="uses-spec-heading">
        <h2 id="uses-spec-heading" className="sr-only">
          Setup
        </h2>

        <dl className="divide-y divide-outline-variant/30 border-t border-outline-variant/30">
          {uses.sections.map((section) => (
            <div
              key={section.title}
              className="grid grid-cols-1 md:grid-cols-[13rem_1fr] gap-x-8 gap-y-3 py-6"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-0.5">
                {section.title}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2" aria-label={section.title}>
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-2.5 py-1"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
