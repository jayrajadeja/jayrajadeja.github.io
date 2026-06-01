export default function Metric({
  label,
  value,
  unit,
  accent = "primary",
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: "primary" | "tertiary" | "up";
}) {
  const color =
    accent === "tertiary" ? "text-tertiary" : accent === "up" ? "text-up" : "text-primary";
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-outline">
        {label}
      </div>
      <div className={`font-mono text-2xl font-bold ${color}`}>
        {value}
        {unit && <span className="text-sm">{unit}</span>}
      </div>
    </div>
  );
}
