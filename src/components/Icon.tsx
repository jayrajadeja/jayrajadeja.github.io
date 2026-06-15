import type { ReactNode } from "react";

/**
 * Inline SVG icons — replaces the Material Symbols icon font so the site makes
 * no render-blocking request to Google Fonts for icons (and never flashes the
 * raw ligature text while the font loads). Stroke-based, 24×24 viewBox, sized
 * in `em` so it inherits the surrounding text size and color via `currentColor`.
 *
 * Only the glyphs actually used across the site are included; add a path here
 * when a new icon is needed.
 */
const PATHS: Record<string, ReactNode> = {
  code: (
    <>
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </>
  ),
  description: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </>
  ),
  edit_note: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </>
  ),
  mail: (
    <>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </>
  ),
  north_east: (
    <>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </>
  ),
  work: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
};

export default function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`inline-block h-[1em] w-[1em] shrink-0 ${className}`.trim()}
    >
      {path}
    </svg>
  );
}
