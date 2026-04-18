export default function FinanceSection() {
  return (
    <section className="mb-32">
      <div className="flex items-baseline gap-4 mb-12">
        <span className="font-headline text-tertiary text-sm font-bold tracking-widest">
          03
        </span>
        <h2 className="font-headline text-4xl font-bold tracking-tight uppercase">
          Finance &amp; Economics
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container-low p-10 rounded-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="font-headline text-3xl font-bold mb-6 text-on-surface uppercase tracking-tight">
              Macro &amp; Micro Economics
            </h3>
            <p className="font-body text-xl text-on-surface-variant leading-relaxed max-w-xl">
              Bridging the gap between sovereign fiscal policies and individual
              market psychology. Deep-diving into interest rate cycles,
              quantitative easing, and the velocity of money.
            </p>
          </div>
          <div className="mt-12 flex gap-4 items-end h-32">
            <div className="w-full bg-tertiary/10 h-1/2 relative group">
              <div className="absolute bottom-0 w-full bg-tertiary h-2/3 group-hover:h-3/4 transition-all duration-500" />
            </div>
            <div className="w-full bg-tertiary/10 h-3/4 relative group">
              <div className="absolute bottom-0 w-full bg-tertiary h-1/2 group-hover:h-2/3 transition-all duration-500" />
            </div>
            <div className="w-full bg-tertiary/10 h-full relative group">
              <div className="absolute bottom-0 w-full bg-tertiary h-4/5 group-hover:h-full transition-all duration-500" />
            </div>
            <div className="w-full bg-primary/10 h-2/3 relative group">
              <div className="absolute bottom-0 w-full bg-primary h-1/3 group-hover:h-1/2 transition-all duration-500" />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high p-8 rounded-sm">
          <span className="font-label text-xs text-primary font-bold tracking-[0.2em] uppercase block mb-6">
            Market Notes
          </span>
          <ul className="space-y-6">
            <li>
              <p className="font-label text-xs text-on-surface-variant uppercase mb-1">
                01. Liquidity
              </p>
              <p className="font-body text-lg italic text-on-surface">
                &ldquo;The tide that lifts all boats is retreating.&rdquo;
              </p>
            </li>
            <li>
              <p className="font-label text-xs text-on-surface-variant uppercase mb-1">
                02. Game Theory
              </p>
              <p className="font-body text-lg text-on-surface">
                Analyzing institutional hedge-fund behavior in low-volatility
                environments.
              </p>
            </li>
            <li>
              <p className="font-label text-xs text-on-surface-variant uppercase mb-1">
                03. Real-Yields
              </p>
              <p className="font-body text-lg text-on-surface">
                The ultimate metric for asset allocation in inflationary
                regimes.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
