"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/library", label: "Library" },
  { href: "/interests", label: "Interests" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-primary uppercase font-headline"
        >
          J. JADEJA
        </Link>

        <div className="hidden md:flex items-center gap-10 font-headline">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                isActive(href)
                  ? "text-primary border-b-2 border-primary pb-1 font-medium"
                  : "text-gray-400 font-medium hover:text-white transition-colors"
              }
            >
              {label}
            </Link>
          ))}
        </div>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-on-primary font-headline px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-tertiary transition-all duration-300"
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
