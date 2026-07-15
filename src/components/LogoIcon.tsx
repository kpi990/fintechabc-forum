// fintechabc brand mark: gradient badge + a clean ascending bar chart with
// an upward arrow. Simplified from an earlier version that also carried a
// Bitcoin-coin overlay and circuit-node accents - those read as clutter at
// the small sizes this renders at in a horizontal nav bar, and tied the
// mark too specifically to "crypto" now that the product spans the whole
// India financial community, not just crypto.
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
    </svg>
  );
}
