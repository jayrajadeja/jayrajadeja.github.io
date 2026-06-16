import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Jayraj Jadeja — Selected Systems";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "ls work",
      title: "Selected Systems",
      subtitle:
        "Workflow-as-a-Service on Temporal · multi-region data movement · event-driven scaling.",
    }),
    { ...OG_SIZE },
  );
}
