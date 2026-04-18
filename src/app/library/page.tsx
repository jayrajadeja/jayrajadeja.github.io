import type { Metadata } from "next";
import PaperCard from "@/components/PaperCard";
import BookCard from "@/components/BookCard";
import papersData from "@/data/papers.json";
import booksData from "@/data/books.json";
import type { ResearchPaper, Book } from "@/lib/types";

export const metadata: Metadata = {
  title: "Library",
  description:
    "A curated selection of intellectual fuel. From high-velocity technical papers to deep editorial works.",
};

const papers: ResearchPaper[] = papersData;
const books: Book[] = booksData;

export default function LibraryPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <header className="mb-24">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="font-headline text-tertiary text-sm tracking-[0.3em] font-bold">
            02 / ARCHIVE
          </span>
        </div>
        <h1 className="font-headline text-7xl md:text-8xl font-bold tracking-tighter text-on-surface leading-none">
          Recommendation <br />
          <span className="italic font-body font-light text-primary">
            Zone.
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-xl text-on-surface-variant font-body leading-relaxed">
          A curated selection of intellectual fuel. From high-velocity technical
          papers that redefine architecture to deep editorial works that shape
          the engineering mindset.
        </p>
      </header>

      {/* Research Papers Section */}
      <section className="mb-32">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight uppercase">
            Research Papers
          </h2>
          <div className="h-[1px] flex-grow bg-outline-variant/20" />
          <span className="font-headline text-xs text-tertiary font-bold tracking-widest uppercase">
            Velocity Engineering
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </section>

      {/* Bookshelf Section */}
      <section>
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight uppercase">
            The Bookshelf
          </h2>
          <div className="h-[1px] flex-grow bg-outline-variant/20" />
          <span className="font-headline text-xs text-tertiary font-bold tracking-widest uppercase">
            Editorial Depth
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} reverse={i % 2 !== 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
