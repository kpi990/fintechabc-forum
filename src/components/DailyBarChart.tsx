import type { DailyCount } from "@/lib/stats";

// Plain CSS bars, no charting dependency - matches RangeBar.tsx's approach
// of drawing small data visualizations directly rather than pulling in a
// chart library for what's currently a handful of data points.
export default function DailyBarChart({
  data,
  label,
}: {
  data: DailyCount[];
  label: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
        <span className="text-sm font-semibold text-slate-50">{total}</span>
      </div>
      <div className="flex h-16 items-end gap-[2px]">
        {data.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.count}`}
            className="flex-1 rounded-t bg-accent/60"
            style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-faint">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
