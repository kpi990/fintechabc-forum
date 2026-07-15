import { ImageResponse } from "next/og";

// Browser tab favicon. Deliberately simpler than LogoIcon.tsx (the nav/footer
// mark) - at 32px, the full coin+circuit+bars+arrow composition turns to mud.
// Gradient badge + a plain "B" reads clearly at this size, matching the
// "Simplified"/"Minimal" tiers on the brand sheet rather than the full "Logo"
// panel. Uses a plain ASCII letter, not the ₿ glyph - next/og's ImageResponse
// (Satori) has to dynamically fetch a font subset for whatever characters
// appear, and that fetch 400s for the U+20BF Bitcoin sign (confirmed via
// Vercel runtime error logs after the first version of this file shipped -
// the route was throwing on every request). ASCII avoids the dependency
// entirely.
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
        <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>B</span>
      </div>
    ),
    { ...size }
  );
}
