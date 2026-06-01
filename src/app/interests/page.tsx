import type { Metadata } from "next";
import interestsRaw from "@/data/interests.json";
import animeRaw from "@/data/anime.json";
import booksRaw from "@/data/books.json";
import papersRaw from "@/data/papers.json";
import systemsRaw from "@/data/systems.json";
import type {
  InterestsData,
  AnimeEntry,
  Book,
  ResearchPaper,
  StudiedSystem,
} from "@/lib/types";
import TickerChip from "@/components/instruments/TickerChip";
import Sparkline from "@/components/instruments/Sparkline";

export const metadata: Metadata = {
  title: "Curated Interests",
  description:
    "Formula 1, markets, anime, sport, the shelf, and systems I've studied — the obsessions that run alongside the work.",
};

const interests = interestsRaw as InterestsData;
const anime = animeRaw as AnimeEntry[];
const books = booksRaw as Book[];
const papers = papersRaw as ResearchPaper[];
const systems = systemsRaw as StudiedSystem[];

const flagships = systems.filter((s) => s.flagship);
const compact = systems.filter((s) => !s.flagship);

// Decorative sparkline — illustrative shape only, not real market data
const SPARKLINE_POINTS = [28, 30, 27, 32, 31, 35, 33, 36, 34, 38, 37, 40];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
      {children}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  id,
  children,
}: {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 border-b-2 border-on-surface pb-4 mb-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-headline text-2xl md:text-3xl font-bold tracking-tight"
      >
        {children}
      </h2>
    </div>
  );
}

export default function InterestsPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
      {/* ── 1. Eyebrow + headline + intro ─────────────────────────── */}
      <section aria-labelledby="interests-headline" className="mb-20">
        <Eyebrow>/interests</Eyebrow>
        <h1
          id="interests-headline"
          className="mt-3 font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface"
        >
          Curated Interests
        </h1>
        <p className="mt-6 max-w-2xl font-body text-xl md:text-2xl italic leading-relaxed text-on-surface-variant">
          The obsessions that run alongside the work — paddock strategy, market
          mechanics, systems architecture, and the shelf.
        </p>
      </section>

      {/* ── 2. Formula 1 ─────────────────────────────────────────── */}
      <section aria-labelledby="f1-heading" className="mb-24">
        <SectionHeader eyebrow="f1" id="f1-heading">
          Formula 1
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Favorite team */}
          <div className="bg-surface-container-low rounded-lg px-6 py-5 border border-outline-variant/30">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary mb-2">
              favorite team
            </p>
            <p className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
              {interests.f1.favoriteTeam}
            </p>
          </div>

          {/* Favorite drivers */}
          <div className="bg-surface-container-low rounded-lg px-6 py-5 border border-outline-variant/30">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary mb-2">
              favorite drivers
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {interests.f1.favoriteDrivers.map((driver) => (
                <li
                  key={driver}
                  className="font-headline text-2xl md:text-3xl font-bold text-on-surface"
                >
                  {driver}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
          {interests.f1.note}
        </p>
      </section>

      {/* ── 3. Markets ───────────────────────────────────────────── */}
      <section aria-labelledby="markets-heading" className="mb-24">
        <SectionHeader eyebrow="markets" id="markets-heading">
          Markets
        </SectionHeader>

        <p className="max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant mb-6">
          {interests.markets.note}
        </p>

        {/* Focus chips */}
        <ul className="flex flex-wrap gap-2 mb-8" aria-label="Market focus areas">
          {interests.markets.focus.map((f) => (
            <li
              key={f}
              className="font-mono text-sm uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-3 py-1.5"
            >
              {f}
            </li>
          ))}
        </ul>

        {/* Decorative instrument accent */}
        <div
          className="bg-surface-container-low rounded-lg px-6 py-5 border border-outline-variant/30"
          aria-label="Decorative market accent — illustrative only, not real-time data"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-outline mb-3">
            Illustrative · not real-time · not financial advice
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4">
            <TickerChip symbol="AAPL" changePct={1.24} />
            <TickerChip symbol="QQQ" changePct={0.87} />
            <TickerChip symbol="NVDA" changePct={-0.53} />
          </div>
          <Sparkline
            points={SPARKLINE_POINTS}
            className="text-tertiary/50 max-w-xs"
          />
        </div>
      </section>

      {/* ── 4. Anime & manga ─────────────────────────────────────── */}
      <section aria-labelledby="anime-heading" className="mb-24">
        <SectionHeader eyebrow="anime & manga" id="anime-heading">
          Anime &amp; Manga
        </SectionHeader>

        <ul className="divide-y divide-outline-variant/30">
          {anime.map((entry, i) => (
            <li
              key={entry.id}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-x-6 gap-y-1 py-5 items-center"
            >
              <span
                className="font-mono text-sm text-tertiary"
                aria-hidden="true"
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span className="font-body text-lg text-on-surface">
                {entry.title}
              </span>
              <span
                className={`font-mono text-[11px] uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${
                  entry.kind === "anime"
                    ? "text-primary border-primary/30"
                    : "text-tertiary border-tertiary/30"
                }`}
              >
                {entry.kind}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 5. Sport ──────────────────────────────────────────────── */}
      <section aria-labelledby="sport-heading" className="mb-24">
        <SectionHeader eyebrow="sport" id="sport-heading">
          Sport
        </SectionHeader>

        <p className="max-w-2xl font-body text-xl md:text-2xl italic leading-relaxed text-on-surface-variant">
          {interests.sport.note}
        </p>
      </section>

      {/* ── 6. The shelf — books + papers ────────────────────────── */}
      <section aria-labelledby="shelf-heading" className="mb-24">
        <SectionHeader eyebrow="library" id="shelf-heading">
          The Shelf
        </SectionHeader>

        {/* Books */}
        <div className="mb-14">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-on-surface-variant mb-6">
            Books
          </h3>
          <ol className="divide-y divide-outline-variant/30">
            {books.map((book, i) => (
              <li
                key={book.id}
                className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-8"
              >
                <span
                  className="font-mono text-sm text-tertiary pt-1"
                  aria-hidden="true"
                >
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h4 className="font-headline text-xl font-bold tracking-tight text-on-surface">
                      {book.title}
                    </h4>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/40 rounded-md px-2 py-0.5">
                      {book.category}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-sm text-outline">
                    {book.author}
                  </p>
                  <p className="mt-3 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                    {book.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Papers */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-on-surface-variant mb-6">
            Research Papers
          </h3>
          <ol className="divide-y divide-outline-variant/30">
            {papers.map((paper, i) => (
              <li
                key={paper.id}
                className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-8"
              >
                <span
                  className="font-mono text-sm text-tertiary pt-1"
                  aria-hidden="true"
                >
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <div>
                  <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
                    <h4 className="font-headline text-xl font-bold tracking-tight text-on-surface">
                      {paper.title}
                    </h4>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-outline mt-1">
                      {paper.venue}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-sm text-outline">
                    {paper.authors}
                  </p>
                  <p className="mt-3 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                    {paper.why}
                  </p>
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em] text-tertiary hover:text-tertiary/70 transition-colors"
                    aria-label={`Read ${paper.title} (opens in new tab)`}
                  >
                    read paper
                    <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">
                      north_east
                    </span>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 7. Systems I've studied ──────────────────────────────── */}
      <section aria-labelledby="systems-heading">
        <SectionHeader eyebrow="study notes" id="systems-heading">
          Systems I&rsquo;ve Studied
        </SectionHeader>

        <p className="mb-10 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
          Curiosity-driven deep dives — architecture breakdowns of systems I
          find interesting. These are personal study notes, not employment
          history.
        </p>

        {/* Flagship systems — featured larger */}
        {flagships.length > 0 && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {flagships.map((s) => (
              <div
                key={s.id}
                className="bg-surface-container-low rounded-lg px-6 py-6 border border-outline-variant/30"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-tertiary mb-3">
                  flagship study
                </p>
                <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface mb-3">
                  {s.system}
                </h3>
                <p className="font-body text-lg leading-relaxed text-on-surface-variant">
                  {s.note}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Compact systems */}
        {compact.length > 0 && (
          <ul className="divide-y divide-outline-variant/30">
            {compact.map((s) => (
              <li
                key={s.id}
                className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-8 gap-y-2 py-6"
              >
                <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface pt-0.5">
                  {s.system}
                </h3>
                <p className="font-body text-base leading-relaxed text-on-surface-variant">
                  {s.note}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
