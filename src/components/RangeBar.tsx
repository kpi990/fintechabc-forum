// Honest alternative to a fabricated trend line: we only have a single day's
// open/high/low/close for Nifty/Bank Nifty (no verified multi-day series —
// see indiaMarkets.ts), so this renders today's actual low-to-high range with
// the current value marked, instead of drawing a fake historical trend.
export default function RangeBar({
  low,
  high,
  value,
  positive,
}: {
  low: number;
  high: number;
  value: number;
  positive: boolean;
}) {
  const range = high - low || 1;
  const pct = Math.min(100, Math.max(0, ((value - low) / range) * 100));
  const color = positive ? "#34d399" : "#fb7185";

  return (
    <div className="mt-2">
      <div className="relative h-1.5 w-full rounded-full bg-white/10">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-faint">
        <span>{low.toLocaleString()}</span>
        <span>Today's range</span>
        <span>{high.toLocaleString()}</span>
      </div>
    </div>
  );
}
