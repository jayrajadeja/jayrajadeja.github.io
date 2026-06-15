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

export function formatGrouped(n: number): string {
  return n.toLocaleString("en-US");
}
