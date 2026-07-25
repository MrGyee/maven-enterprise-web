import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Maven Enterprise Ltd — Trusted Interior Solutions Partner in Kenya";

const logoDataUri = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "brand-icon-master.png")
).toString("base64")}`;

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
          background: "linear-gradient(135deg, #1B211D 0%, #2B1608 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          alt=""
          width={96}
          height={96}
          style={{ borderRadius: 20, marginBottom: 32 }}
        />
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          Maven Enterprise Ltd
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 16, color: "#FF8A50" }}>
          Trusted Interior Solutions Partner in Kenya
        </div>
      </div>
    ),
    { ...size }
  );
}
