import markets from "@/data/markets.json";
import TickerChip from "./TickerChip";

export default function TickerRail() {
  const items = [...markets.stocks, ...markets.crypto];
  const group = (prefix: string) =>
    items.map((m) => (
      <TickerChip key={`${prefix}-${m.symbol}`} symbol={m.symbol} changePct={m.changePct} />
    ));
  return (
    <div className="sticky top-0 z-40 border-b border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-md overflow-hidden">
      <div className="ticker-marquee flex gap-8 py-2 px-4 w-max">
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}
