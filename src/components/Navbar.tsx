"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RESUME_URL } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/writing", label: "writing" },
  { href: "/interests", label: "interests" },
  { href: "/about", label: "about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav aria-label="Main navigation" className="w-full bg-surface/70 backdrop-blur-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-primary uppercase font-headline"
        >
          J. JADEJA
        </Link>

        {/* Desktop nav */}
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

        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            ref={toggleRef}
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span
              className={`block w-5 h-px bg-on-surface transition-all duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-on-surface transition-all duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-on-surface transition-all duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>

          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-bold uppercase tracking-widest bg-primary text-on-primary px-5 py-2 rounded-sm hover:bg-tertiary transition-all duration-300"
          >
            résumé
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-xl"
        >
          <ul className="flex flex-col py-4 px-8 gap-1 font-mono text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={
                    isActive(href)
                      ? "block py-2 text-tertiary"
                      : "block py-2 text-on-surface-variant hover:text-on-surface transition-colors"
                  }
                >
                  <span className="text-outline">/</span>
                  {label}
                </Link>
              </li>
            ))}
            <li className="mt-3 pt-3 border-t border-outline-variant/20">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block py-2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="text-outline">/</span>
                résumé
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
