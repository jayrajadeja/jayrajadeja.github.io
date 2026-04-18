import type { ResearchPaper } from "@/lib/types";

export default function PaperCard({ paper }: { paper: ResearchPaper }) {
  return (
    <article className="flex flex-col group">
      <div className="bg-surface-container-low p-8 relative overflow-hidden mb-6 transition-all duration-500 hover:bg-surface-container-high">
        <div className="absolute top-4 right-4 text-tertiary/20 group-hover:text-tertiary transition-colors">
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: '"FILL" 0' }}
          >
            {paper.icon}
          </span>
        </div>
        <span className="font-headline text-[10px] text-on-surface-variant font-bold tracking-widest block mb-4 uppercase">
          {paper.source}
        </span>
        <h3 className="font-headline text-2xl font-bold text-on-surface leading-tight mb-2">
          {paper.title}
        </h3>
        <p className="font-headline text-sm text-tertiary uppercase font-medium mb-6">
          {paper.authors}
        </p>
        <div className="h-24 overflow-hidden">
          <p className="text-on-surface-variant font-body leading-relaxed text-sm italic">
            &ldquo;{paper.description}&rdquo;
          </p>
        </div>
      </div>
      <a
        href={paper.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 group/link"
      >
        <span className="font-headline text-xs font-bold text-primary uppercase tracking-widest border-b border-primary/20 pb-1 group-hover/link:border-tertiary group-hover/link:text-tertiary transition-all">
          Read Paper
        </span>
        <span className="material-symbols-outlined text-sm text-primary group-hover/link:text-tertiary transition-colors">
          north_east
        </span>
      </a>
    </article>
  );
}
