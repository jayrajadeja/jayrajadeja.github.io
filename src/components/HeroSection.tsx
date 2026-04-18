export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-8">
          <span className="font-headline text-tertiary uppercase tracking-[0.3em] text-sm mb-6 block">
            Software Engineer // 5 Years Experience
          </span>
          <h1 className="font-headline text-7xl md:text-9xl font-extrabold tracking-tighter leading-none mb-8">
            JAYRAJ <br />
            <span className="text-primary italic">JADEJA</span>
          </h1>
          <p className="text-2xl md:text-3xl max-w-2xl leading-relaxed text-on-surface-variant italic">
            Architecting high-velocity digital systems where technical precision
            meets editorial depth. Engineering for scalability, performance, and
            human intent.
          </p>
        </div>
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
          <div className="w-full aspect-[4/5] bg-surface-container-low mb-8 relative overflow-hidden rounded-sm">
            <img
              alt="Jayraj Jadeja"
              className="w-full h-full object-cover grayscale opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA48ArwIbUd6pM6SC3zJlnbHhpLV6QtAYP_zGkDK3SyyNYnQ_j_t3OJ-BDDiNY8S5gdRtkcyFs-JWGUGuAB4vPWRG3FkUlC5k3FpgobWeeKey6jZEQRJHqRgXIsqRgNsOPuJoYcL5_xsffAXopQe4-akEGzBtRM6u55m416hRnSrvaYf-N2X9rK7O8zferlSIcu-rrN0Q6t0fUWYVjxL7aBhoYlvPSQcTpGuecoxQ7cWaK79LvepQ5xqjX0NzxqRqItBtKggqctLb4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          </div>
          <button className="kinetic-gradient text-on-primary font-headline py-6 px-12 w-full text-lg font-bold uppercase tracking-widest flex justify-between items-center group">
            Download Portfolio
            <span className="material-symbols-outlined text-3xl group-hover:rotate-45 transition-transform duration-500">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
