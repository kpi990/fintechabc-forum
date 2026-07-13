// Recreation of the fintechabc brand mark (violet/fuchsia gradient badge:
// ascending bar chart + upward arrow + Bitcoin coin + circuit-node accents).
// Built as an inline SVG rather than a raster image since no image file was
// ever received as an actual attachment (only pasted inline in chat, which
// this environment can view but not save to disk) — this keeps the mark
// crisp at any size and avoids depending on a missing asset.
export default function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fabc-badge" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="fabc-coin" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#fabc-badge)" />

      {/* faint pixel/data trail, upper-left */}
      <g fill="#ffffff" opacity="0.35">
        <rect x="20" y="34" width="5" height="5" rx="1" />
        <rect x="28" y="30" width="5" height="5" rx="1" />
        <rect x="36" y="26" width="5" height="5" rx="1" />
      </g>

      {/* ascending bar chart */}
      <g fill="#ffffff" opacity="0.9">
        <rect x="34" y="52" width="7" height="16" rx="1.5" />
        <rect x="44" y="44" width="7" height="24" rx="1.5" />
        <rect x="54" y="36" width="7" height="32" rx="1.5" />
        <rect x="64" y="28" width="7" height="40" rx="1.5" />
      </g>

      {/* upward diagonal arrow across the bars */}
      <path
        d="M22 71 L74 26"
        stroke="#ffffff"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M60 24 L76 24 L76 40 Z" fill="#ffffff" />

      {/* circuit / node accents, right side */}
      <g stroke="#ffffff" strokeWidth="2" opacity="0.7">
        <path d="M80 40 L86 40 L86 48" fill="none" />
        <path d="M84 55 L90 55 L90 63" fill="none" />
      </g>
      <g fill="#ffffff" opacity="0.85">
        <circle cx="86" cy="48" r="2.4" />
        <circle cx="90" cy="63" r="2.4" />
      </g>

      {/* Bitcoin coin, lower-left, overlapping the badge edge */}
      <circle cx="26" cy="74" r="15" fill="url(#fabc-coin)" stroke="#ffffff" strokeWidth="2.5" />
      <text
        x="26"
        y="80"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="17"
        fill="#ffffff"
      >
        ₿
      </text>
    </svg>
  );
}
