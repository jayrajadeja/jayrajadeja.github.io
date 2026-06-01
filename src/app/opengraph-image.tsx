import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Jayraj Jadeja — Software Engineer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: 80, background: "#0c0e0f", color: "#e9eaea",
        }}
      >
        <div style={{ color: "#4cd6ff", fontSize: 30, letterSpacing: 6 }}>jayraj@engineering:~$ whoami</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 20, letterSpacing: -2 }}>Jayraj Jadeja</div>
        <div style={{ fontSize: 38, color: "#8b9095", marginTop: 14 }}>I take systems apart to see how they tick.</div>
        <div style={{ display: "flex", gap: 36, marginTop: 44, fontSize: 26 }}>
          <span style={{ color: "#8b9095" }}><span style={{ color: "#4cd6ff" }}>788</span> issues</span>
          <span style={{ color: "#8b9095" }}><span style={{ color: "#4cd6ff" }}>626</span> PRs</span>
          <span style={{ color: "#ffb4a8" }}>backend · distributed systems</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
