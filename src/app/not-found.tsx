import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import CtaLink from "@/components/CtaLink";
import TerminalBlock from "@/components/instruments/TerminalBlock";

export const metadata: Metadata = {
  title: "404 — Not Found",
  description: "This route doesn't resolve.",
};

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto min-h-[70vh] flex flex-col justify-center">
      <Eyebrow>/404</Eyebrow>
      <h1 className="mt-3 font-headline text-6xl md:text-7xl font-bold tracking-tighter text-on-surface">
        Page not found
      </h1>
      <p className="mt-5 max-w-xl font-body text-xl italic leading-relaxed text-on-surface-variant">
        The path you followed doesn&rsquo;t resolve. It may have moved, or it
        never existed.
      </p>

      <div className="mt-10">
        <TerminalBlock title="jayraj@engineering — zsh">
          <p className="text-on-surface-variant">
            <span className="text-tertiary">jayraj@engineering</span>
            <span className="text-outline">:~$</span> cd /the-page-you-wanted
          </p>
          <p className="mt-1 text-down">
            cd: no such file or directory{" "}
            <span className="text-outline">(404)</span>
          </p>
          <p className="mt-1 text-on-surface-variant">
            <span className="text-tertiary">jayraj@engineering</span>
            <span className="text-outline">:~$</span> cd ~
          </p>
        </TerminalBlock>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <CtaLink href="/">Back home</CtaLink>
        <CtaLink href="/work" variant="secondary">
          See the work
        </CtaLink>
        <CtaLink href="/writing" variant="secondary">
          Read the desk
        </CtaLink>
      </div>
    </div>
  );
}
