import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Jayraj Jadeja — About";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "cat about.md",
      title: "About",
      subtitle:
        "Backend & distributed-systems engineer — the verified record, education, and contact.",
    }),
    { ...OG_SIZE },
  );
}
