import CountUp from "@/components/instruments/CountUp";
import stats from "@/data/stats.json";
import { statValue } from "@/lib/site";

const STATS = [
  { raw: null, textValue: stats.tenureYears, label: "Years Engineering", accent: "text-tertiary" },
  { raw: statValue("issues delivered"), label: "Issues Delivered", accent: "text-primary" },
  { raw: statValue("pull requests"), label: "Pull Requests", accent: "text-tertiary" },
  { raw: statValue("lines changed"), label: "Lines Changed", accent: "text-primary" },
];

export default function StatsSection() {
  return (
    <section className="bg-surface-container-low py-24 mb-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map(({ raw, textValue, label, accent }) => (
            <div key={label} className="space-y-2">
              <div
                className={`font-headline text-4xl font-bold tracking-tighter ${accent}`}
              >
                {raw !== null && raw !== undefined ? (
                  <CountUp end={raw} />
                ) : (
                  textValue
                )}
              </div>
              <div className="font-headline text-xs uppercase tracking-widest text-outline">
                {label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center font-mono text-[11px] uppercase tracking-widest text-outline">
          Verified across Jira + GitHub · 2021–2026
        </p>
      </div>
    </section>
  );
}
