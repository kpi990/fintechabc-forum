// fintechabc brand mark, per the brand sheet: gradient badge, a Bitcoin coin
// accent, circuit-node dots, an ascending pixel bar chart, and an upward
// arrow sweeping across it. Reverted from the earlier session's simplified
// arrow-only version at the user's explicit request to match the sheet.
// Recreated as a vector interpretation - the sheet was a flattened mockup
// image, not a source file, so this isn't a pixel-exact import.
//
// Note: at true favicon size (16-32px) this much detail turns to mud, so the
// browser favicon (src/app/icon.tsx) intentionally uses a simpler mark, not
// this component - this version is for the nav bar / footer where it renders
// at 28px+.
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
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#fabc-badge)" />

      {/* circuit-node dots, trailing diagonally into the bar chart */}
      <g fill="#ffffff" opacity="0.55">
        <circle cx="16" cy="22" r="1.8" />
        <circle cx="22" cy="28" r="2.3" />
        <circle cx="28" cy="34" r="2.8" />
      </g>

      {/* ascending bar chart */}
      <g fill="#ffffff" opacity="0.95">
        <rect x="28" y="54" width="9" height="20" rx="2" />
        <rect x="41" y="44" width="9" height="30" rx="2" />
        <rect x="54" y="34" width="9" height="40" rx="2" />
        <rect x="67" y="24" width="9" height="50" rx="2" />
      </g>

      {/* upward diagonal arrow across the bars, capped with an arrowhead */}
      <path d="M24 76 L76 24" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 22 L78 22 L78 40 Z" fill="#ffffff" />

      {/* Bitcoin coin accent, bottom-left, overlapping the first bar */}
      <circle cx="27" cy="72" r="14" fill="#5b21b6" stroke="#ffffff" strokeWidth="2" />
      <text
        x="27"
        y="77.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="15"
        fill="#ffffff"
      >
        ₿
      </text>
    </svg>
  );
}
