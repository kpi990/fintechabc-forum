import { ImageResponse } from "next/og";

// Browser tab favicon. Deliberately simpler than LogoIcon.tsx (the nav/footer
// mark) - at 32px, the full coin+circuit+bars+arrow composition turns to mud.
// Gradient badge + the Bitcoin symbol reads clearly at this size, matching
// the "Simplified"/"Minimal" tiers on the brand sheet rather than the full
// "Logo" panel.
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
          borderRadius: "50%",
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>₿</span>
      </div>
    ),
    { ...size }
  );
}
