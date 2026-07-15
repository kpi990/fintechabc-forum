import { ImageResponse } from "next/og";

// Apple touch icon (home-screen bookmark). Larger canvas than icon.tsx, so
// it can carry a bit more of the brand mark - coin + upward arrow - without
// the "Simplified" favicon's tight 32px constraint. Apple applies its own
// corner-rounding mask, so this ships as a plain filled square.
export const runtime = "edge";
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
        }}
      >
        <span style={{ fontSize: 72, fontWeight: 700, color: "#ffffff", display: "flex" }}>₿</span>
        <span style={{ fontSize: 34, color: "#ffffff", marginTop: 4, display: "flex" }}>↗</span>
      </div>
    ),
    { ...size }
  );
}
