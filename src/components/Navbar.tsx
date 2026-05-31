"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/writing", label: "writing" },
  { href: "/interests", label: "interests" },
  { href: "/about", label: "about" },
  { href: "/now", label: "now" },
  { href: "/uses", label: "uses" },
];

const RESUME_URL =
  "https://drive.google.com/file/d/1tleUFEbGJ4Se847v0RVS3qQ_4kZL-dS0/view?usp=sharing";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="w-full bg-surface/70 backdrop-blur-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-primary uppercase font-headline"
        >
          J. JADEJA
        </Link>

        <div className="hidden md:flex items-center gap-6 font-mono text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                isActive(href)
                  ? "text-tertiary"
                  : "text-on-surface-variant hover:text-on-surface transition-colors"
              }
            >
              <span className="text-outline">/</span>
              {label}
            </Link>
          ))}
        </div>

        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs font-bold uppercase tracking-widest bg-primary text-on-primary px-5 py-2 rounded-sm hover:bg-tertiary transition-all duration-300"
        >
          résumé
        </a>
      </div>
    </nav>
  );
}
