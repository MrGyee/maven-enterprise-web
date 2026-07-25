import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Maven Enterprise Ltd — Trusted Interior Solutions Partner in Kenya";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F7B48 0%, #0b5c36 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            fontSize: 52,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          M
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          Maven Enterprise Ltd
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 16, color: "#C9A227" }}>
          Trusted Interior Solutions Partner in Kenya
        </div>
      </div>
    ),
    { ...size }
  );
}
