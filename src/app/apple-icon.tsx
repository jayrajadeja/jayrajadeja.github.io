import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "#0c0e0f",
        }}
      >
        <span
          style={{
            fontSize: 130,
            fontWeight: 700,
            color: "#4cd6ff",
            lineHeight: 1,
          }}
        >
          ›
        </span>
        <div
          style={{
            width: 44,
            height: 12,
            background: "#ffb4a8",
            marginBottom: 18,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
