import markets from "@/data/markets.json";
import TickerChip from "./TickerChip";

export default function TickerRail() {
  const items = [...markets.stocks, ...markets.crypto];
  const group = (prefix: string) =>
    items.map((m) => (
      <TickerChip key={`${prefix}-${m.symbol}`} symbol={m.symbol} changePct={m.changePct} />
    ));
  return (
    <div
      className="border-b border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-md"
      aria-label="Illustrative market ticker — sample data, not real-time"
    >
      <div className="flex items-stretch">
        {/* Static honesty label — these are seed/sample values, not a live feed (real data lands in P3). */}
        <span className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-outline/80 px-3 border-r border-outline-variant/20">
          <span className="w-1 h-1 rounded-full bg-outline/60" aria-hidden="true" />
          markets · illustrative
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-marquee flex gap-8 py-2 px-4 w-max">
            {group("a")}
            {group("b")}
          </div>
        </div>
      </div>
    </div>
  );
}
