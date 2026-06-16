import type { ReactElement } from "react";

/**
 * Shared Open Graph card for section pages (work / about / interests).
 * Matches the site's terminal-on-near-black aesthetic. Satori-safe: every
 * container with >1 child sets display:flex; the prompt line is a single string.
 * (ImageResponse/Satori requires literal hex — theme tokens don't apply here.)
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function ogCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0c0e0f",
        color: "#e5e2e1",
      }}
    >
      <div style={{ color: "#4cd6ff", fontSize: 28, letterSpacing: 4 }}>
        {`jayraj@engineering:~$ ${eyebrow}`}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div
          style={{ fontSize: 30, color: "#9aa0a1", marginTop: 24, maxWidth: 980 }}
        >
          {subtitle}
        </div>
      </div>
      <div style={{ fontSize: 24, color: "#ffb4a8" }}>
        Jayraj Jadeja — backend · distributed systems
      </div>
    </div>
  );
}
