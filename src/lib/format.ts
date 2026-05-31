export type Direction = "up" | "down" | "flat";

export function deltaDirection(pct: number): Direction {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "flat";
}

export function formatDelta(pct: number): string {
  const arrow = pct > 0 ? "▲" : pct < 0 ? "▼" : "■";
  return `${arrow}${Math.abs(pct).toFixed(2)}%`;
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatGrouped(n: number): string {
  return n.toLocaleString("en-US");
}
