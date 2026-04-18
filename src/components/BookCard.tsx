import type { Book } from "@/lib/types";

export default function BookCard({
  book,
  reverse = false,
}: {
  book: Book;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } gap-8 items-start group ${reverse ? "md:mt-24" : ""}`}
    >
      <div className="w-full md:w-64 h-80 shrink-0 bg-surface-container-high relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">
        <img
          alt={`${book.title} cover`}
          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700"
          src={book.coverImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
      </div>
      <div
        className={`flex flex-col justify-center ${
          reverse ? "text-left md:text-right md:items-end" : ""
        }`}
      >
        <span className="font-headline text-[10px] text-tertiary font-bold tracking-widest block mb-4 uppercase">
          Recommended for: {book.category}
        </span>
        <h3 className="font-body text-4xl italic text-on-surface mb-2 font-medium">
          {book.title}
        </h3>
        <p className="font-headline text-sm text-on-surface-variant uppercase font-medium tracking-wide mb-6">
          {book.author}
        </p>
        <p
          className={`text-on-surface-variant font-body leading-relaxed mb-8 ${
            reverse
              ? "border-r md:border-l-0 border-primary/30 pr-4 md:pl-4"
              : "border-l border-primary/30 pl-4"
          }`}
        >
          &ldquo;{book.description}&rdquo;
        </p>
        <a
          href={book.link}
          className={`flex items-center gap-3 w-fit ${
            reverse ? "flex-row md:flex-row-reverse" : ""
          }`}
        >
          <span className="bg-primary text-on-primary w-10 h-10 flex items-center justify-center rounded-full transition-all group-hover:bg-tertiary group-hover:scale-110">
            <span className="material-symbols-outlined text-xl">
              {book.icon}
            </span>
          </span>
          <span className="font-headline text-sm font-bold uppercase tracking-tighter">
            View Book
          </span>
        </a>
      </div>
    </div>
  );
}
