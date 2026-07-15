import { getCommunityStats } from "@/lib/stats";

export default async function CommunityStatsBar({ compact = false }: { compact?: boolean }) {
  const stats = await getCommunityStats();

  const items = [
    { label: "Members", value: stats.memberCount },
    { label: "Discussions this week", value: stats.postsLast7Days },
    { label: "Total posts", value: stats.totalPosts },
  ];

  if (compact) {
    return (
      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Community
        </h3>
        <div className="divide-y divide-line">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-muted">{item.label}</span>
              <span className="font-semibold text-slate-50">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface shadow-sm">
      {items.map((item) => (
        <div key={item.label} className="px-4 py-4 text-center">
          <div className="text-2xl font-semibold tracking-tight text-slate-50">
            {item.value.toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs text-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
