import type { Metadata } from "next";
import PhotoGrid from "@/components/PhotoGrid";
import F1Section from "@/components/F1Section";
import FinanceSection from "@/components/FinanceSection";

export const metadata: Metadata = {
  title: "Interests",
  description:
    "A repository of obsessions. From the technical precision of the paddock to the volatile dynamics of global markets.",
};

export default function InterestsPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
      <header className="mb-24">
        <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter text-on-surface mb-6 leading-none">
          CURATED <br />
          <span className="text-primary italic font-body font-light">
            Interests.
          </span>
        </h1>
        <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
          A repository of obsessions. From the technical precision of the
          paddock to the volatile dynamics of global markets and the stillness of
          a shutter click.
        </p>
      </header>

      <PhotoGrid />
      <F1Section />
      <FinanceSection />
    </div>
  );
}
