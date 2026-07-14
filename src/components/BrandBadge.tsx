// We don't have licensed logo image assets for Indian banks, insurers, or
// IPO companies (unlike crypto, where CoinGecko serves official icons via
// its public API). Rather than fetching/guessing at logo images from
// unverified sources, this renders a deterministic colored initials badge —
// same idea as the Avatar component, applied to brand names.
const PALETTE = [
  ["#7c3aed", "#ede9fe"], // violet
  ["#0891b2", "#cffafe"], // cyan
  ["#d97706", "#fef3c7"], // amber
  ["#059669", "#d1fae5"], // emerald
  ["#db2777", "#fce7f3"], // pink
  ["#4f46e5", "#e0e7ff"], // indigo
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
