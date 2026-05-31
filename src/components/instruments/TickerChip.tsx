import { formatDelta, deltaDirection } from "@/lib/format";

export default function TickerChip({
  symbol,
  changePct,
}: {
  symbol: string;
  changePct: number;
}) {
  const dir = deltaDirection(changePct);
  const color =
    dir === "up" ? "text-up" : dir === "down" ? "text-down" : "text-on-surface-variant";
  return (
    <span className="font-mono text-xs whitespace-nowrap">
      <span className="text-on-surface-variant">{symbol}</span>{" "}
      <span className={color}>{formatDelta(changePct)}</span>
    </span>
  );
}
