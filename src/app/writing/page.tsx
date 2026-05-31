import type { Metadata } from "next";

export const metadata: Metadata = { title: "The Desk" };

export default function Page() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
      <span className="font-mono text-tertiary text-xs tracking-[0.3em] uppercase">/writing</span>
      <h1 className="font-headline text-6xl md:text-7xl font-bold tracking-tighter mt-4">
        The Desk
      </h1>
      <p className="font-body text-xl text-on-surface-variant mt-6 italic max-w-2xl">
        Finance × engineering essays and field notes. Wiring up in the next build phase.
      </p>
    </div>
  );
}
