import { ImageResponse } from "next/og";

// Apple touch icon (home-screen bookmark). Larger canvas than icon.tsx, so it
// can carry a bit more of the brand mark - coin + upward arrow - without the
// "Simplified" favicon's tight 32px constraint. Apple applies its own
// corner-rounding mask, so this ships as a plain filled square.
// Built entirely from plain divs/ASCII text (no ₿/↗ Unicode glyphs) - the
// first version of icon.tsx used those and Satori's dynamic font fetch 400'd
// on them in production (confirmed via Vercel runtime error logs), so this
// file avoids the same failure mode even though it hadn't errored yet itself.
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
        <span style={{ fontSize: 72, fontWeight: 700, color: "#ffffff", display: "flex" }}>B</span>
        <div
          style={{
            display: "flex",
            width: 46,
            height: 6,
            borderRadius: 3,
            background: "#ffffff",
            marginTop: 10,
            transform: "rotate(-35deg)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
