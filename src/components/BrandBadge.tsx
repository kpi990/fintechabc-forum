// We don't have licensed logo image assets for Indian banks, insurers, or
// IPO companies (unlike crypto, where CoinGecko serves official icons via
// its public API). Rather than fetching/guessing at logo images from
// unverified sources, this renders a deterministic colored initials badge —
// same idea as the Avatar component, applied to brand names.
// Dark-theme palette: bright foreground on a low-opacity tint of the same
// hue, rather than a light pastel chip (which would read as a bright,
// out-of-place blob on a dark surface).
const PALETTE = [
  ["#a78bfa", "rgba(124, 58, 237, 0.18)"], // violet
  ["#22d3ee", "rgba(8, 145, 178, 0.18)"], // cyan
  ["#fbbf24", "rgba(217, 119, 6, 0.18)"], // amber
  ["#34d399", "rgba(5, 150, 105, 0.18)"], // emerald
  ["#f472b6", "rgba(219, 39, 119, 0.18)"], // pink
  ["#818cf8", "rgba(79, 70, 229, 0.18)"], // indigo
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export default function BrandBadge({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const [fg, bg] = PALETTE[hashString(name) % PALETTE.length];

  return (
    <div
      style={{ width: size, height: size, backgroundColor: bg, color: fg, fontSize: size * 0.38 }}
      className="flex shrink-0 items-center justify-center rounded-full font-semibold"
    >
      {initials}
    </div>
  );
}
