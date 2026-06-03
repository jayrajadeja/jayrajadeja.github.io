import Link from "next/link";
import StatusDot from "@/components/instruments/StatusDot";
import { RESUME_URL } from "@/lib/site";

const PAGE_LINKS = [
  { label: "Now", href: "/now" },
  { label: "Uses", href: "/uses" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/jayrajadeja" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jayrajadeja/" },
  { label: "Substack", href: "https://substack.com/@jayrajadeja" },
  { label: "Résumé", href: RESUME_URL },
  { label: "Email", href: "mailto:jayrajsinh.jadeja399@gmail.com?subject=Hello%20Jayraj" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 bg-surface">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <StatusDot>open to roles · bengaluru</StatusDot>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
            {PAGE_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-on-surface-variant hover:text-tertiary transition-colors"
              >
                {label}
              </Link>
            ))}
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
