import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Jayraj Jadeja — Curated Interests";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "ls interests",
      title: "Curated Interests",
      subtitle:
        "Formula 1, markets, anime, the shelf — and the large-scale systems I study.",
    }),
    { ...OG_SIZE },
  );
}
