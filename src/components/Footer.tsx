import StatusDot from "@/components/instruments/StatusDot";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/jayrajadeja" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jayrajadeja/" },
  { label: "Substack", href: "https://substack.com/@jayrajadeja" },
  { label: "Email", href: "mailto:jayrajsinh.jadeja399@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 bg-surface">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <StatusDot>open to roles · bengaluru</StatusDot>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-tertiary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} Jayraj Jadeja · built with Next.js, statically exported.
        </p>
      </div>
    </footer>
  );
}
