import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "fintechabc — crypto & finance community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 32,
          }}
        >
          f
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#ffffff", display: "flex" }}>
          fintechabc
        </div>
        <div style={{ fontSize: 28, color: "#ede9fe", marginTop: 16, display: "flex" }}>
          Discuss · Share · Grow
        </div>
        <div style={{ fontSize: 22, color: "#ede9fe", marginTop: 24, display: "flex" }}>
          Crypto & finance community for India
        </div>
      </div>
    ),
    { ...size }
  );
}
