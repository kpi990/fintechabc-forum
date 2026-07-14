// Minimal inline SVG sparkline — no charting library dependency.
// Only ever fed real historical series (e.g. CoinGecko's sparkline_in_7d);
// never used to visualize data we don't actually have (see indiaMarkets.ts —
// deliberately no sparkline there, since we only have a single snapshot value,
// not a real intraday/historical series).
export default function Sparkline({
  points,
  width = 80,
  height = 28,
  positive,
}: {
  points: number[];
  width?: number;
  height?: number;
  positive: boolean;
}) {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = positive ? "#059669" : "#e11d48";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={coords} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
