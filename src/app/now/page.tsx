import type { Metadata } from "next";

export const metadata: Metadata = { title: "Now" };

export default function Page() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
      <span className="font-mono text-tertiary text-xs tracking-[0.3em] uppercase">/now</span>
      <h1 className="font-headline text-6xl md:text-7xl font-bold tracking-tighter mt-4">
        Now
      </h1>
      <p className="font-body text-xl text-on-surface-variant mt-6 italic max-w-2xl">
        What I&apos;m building, reading, and watching right now. A dated snapshot, coming soon.
      </p>
    </div>
  );
}
