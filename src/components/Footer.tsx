const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/jayrajadeja" },
  { label: "GitHub", href: "https://github.com/jayrajadeja" },
  { label: "Twitter", href: "https://twitter.com/jayrajadeja" },
  { label: "Email", href: "mailto:contact@jayraj.dev" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 bg-surface">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 max-w-7xl mx-auto">
        <p className="font-headline text-xs uppercase tracking-widest text-gray-500">
          &copy; {new Date().getFullYear()} JAYRAJ JADEJA. ENGINEERED FOR VELOCITY.
        </p>
        <div className="flex gap-8">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-headline text-xs uppercase tracking-widest text-gray-500 hover:text-tertiary underline-offset-4 hover:underline transition-all duration-500"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
