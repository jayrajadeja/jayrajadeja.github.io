export default function Sparkline({
  points,
  className = "",
}: {
  points: number[];
  className?: string;
}) {
  if (points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / range) * 30;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className={`w-full h-8 ${className}`}
      aria-hidden="true"
    >
      <polyline points={coords} fill="none" stroke="currentColor" strokeWidth="2" className="sparkline-draw" />
    </svg>
  );
}
