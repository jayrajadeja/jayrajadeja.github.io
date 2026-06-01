import type { Metadata } from "next";
import usesData from "@/data/uses.json";
import type { UsesData } from "@/lib/types";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The editor, terminal, languages, and datastores behind Jayraj Jadeja's engineering work.",
};

const uses = usesData as UsesData;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
      {children}
    </span>
  );
}

type SpecRowProps = {
  label: string;
  value: string;
};

function SpecRow({ label, value }: SpecRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-8 gap-y-1 py-5">
      <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-0.5">
        {label}
      </dt>
      <dd className="font-body text-lg leading-relaxed text-on-surface-variant">
        {value}
      </dd>
    </div>
  );
}

type SpecListRowProps = {
  label: string;
  items: string[];
};

function SpecListRow({ label, items }: SpecListRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-8 gap-y-1 py-5">
      <dt className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary pt-0.5">
        {label}
      </dt>
      <dd>
        <ul className="flex flex-wrap gap-2" aria-label={label}>
          {items.map((item) => (
            <li
              key={item}
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-2 py-1"
            >
              {item}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

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
          The editor, terminal, languages, and datastores behind the work.
        </p>
      </section>

      {/* ── Spec list ────────────────────────────────────────────── */}
      <section aria-labelledby="uses-spec-heading" className="mb-16">
        <h2 id="uses-spec-heading" className="sr-only">
          Setup
        </h2>

        <dl className="divide-y divide-outline-variant/30 border-t border-outline-variant/30">
          <SpecRow label="editor" value={uses.editor} />
          <SpecRow label="terminal" value={uses.terminal} />
          <SpecListRow label="languages" items={uses.languages} />
          <SpecListRow label="datastores" items={uses.datastores} />
        </dl>
      </section>

      {/* ── Provisional note ─────────────────────────────────────── */}
      <p className="font-body text-sm italic text-on-surface-variant/60 border-t border-outline-variant/20 pt-6">
        {uses.note}
      </p>
    </div>
  );
}
