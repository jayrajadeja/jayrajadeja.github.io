import Link from "next/link";
import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";

/**
 * Shared call-to-action button. Single source for the primary/secondary button
 * styling used across the home, about, and 404 pages. Picks the right element
 * from the href: `mailto:` and `http(s):` render an <a> (external opens in a new
 * tab), everything else renders a Next <Link> for client-side nav.
 */
const BASE =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] px-5 py-2.5 rounded-md transition-colors";

const VARIANTS = {
  primary: "bg-primary text-on-primary hover:bg-tertiary",
  secondary:
    "border border-outline-variant/60 text-on-surface hover:border-tertiary hover:text-tertiary",
} as const;

export default function CtaLink({
  href,
  variant = "primary",
  icon,
  children,
  className = "",
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  icon?: IconName;
  children: ReactNode;
  className?: string;
}) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`.trim();
  const inner = (
    <>
      {icon && <Icon name={icon} className="text-base" />}
      {children}
    </>
  );

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  if (/^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
