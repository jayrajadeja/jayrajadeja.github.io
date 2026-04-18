export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-48 text-center">
      <h2 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter mb-12">
        LET&apos;S BUILD THE <br />
        <span className="italic text-primary">NEXT ARCHIVE.</span>
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
        <a
          className="text-2xl italic hover:text-tertiary transition-colors underline underline-offset-8 decoration-primary/30"
          href="mailto:contact@jayraj.dev"
        >
          Get in touch
        </a>
        <span className="hidden md:block text-outline-variant">/</span>
        <a
          className="text-2xl italic hover:text-tertiary transition-colors underline underline-offset-8 decoration-primary/30"
          href="https://github.com/jayrajadeja"
          target="_blank"
          rel="noopener noreferrer"
        >
          View GitHub
        </a>
      </div>
    </section>
  );
}
