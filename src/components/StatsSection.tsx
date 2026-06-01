import stats from "@/data/stats.json";

const metric = (label: string): number =>
  stats.headline.find((h) => h.label === label)?.value ?? 0;

const STATS = [
  { value: stats.tenureYears, label: "Years Engineering", accent: "text-tertiary" },
  {
    value: metric("issues delivered").toLocaleString("en-US"),
    label: "Issues Delivered",
    accent: "text-primary",
  },
  {
    value: metric("pull requests").toLocaleString("en-US"),
    label: "Pull Requests",
    accent: "text-tertiary",
  },
  {
    value: metric("lines changed").toLocaleString("en-US"),
    label: "Lines Changed",
    accent: "text-primary",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-surface-container-low py-24 mb-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map(({ value, label, accent }) => (
            <div key={label} className="space-y-2">
              <div
                className={`font-headline text-4xl font-bold tracking-tighter ${accent}`}
              >
                {value}
              </div>
              <div className="font-headline text-xs uppercase tracking-widest text-outline">
                {label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center font-mono text-[11px] uppercase tracking-widest text-outline/70">
          Verified across Jira + GitHub · 2021–2026
        </p>
      </div>
    </section>
  );
}
