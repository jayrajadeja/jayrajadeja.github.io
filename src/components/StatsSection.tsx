const STATS = [
  { value: "05", label: "Years Expertise", accent: "text-tertiary" },
  { value: "42+", label: "Production Releases", accent: "text-primary" },
  { value: "1.2M", label: "Lines of Logic", accent: "text-tertiary" },
  { value: "∞", label: "Kinetic Energy", accent: "text-primary" },
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
      </div>
    </section>
  );
}
