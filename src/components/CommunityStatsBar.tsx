import { getCommunityStats } from "@/lib/stats";

export default async function CommunityStatsBar() {
  const stats = await getCommunityStats();

  const items = [
    { label: "Members", value: stats.memberCount },
    { label: "Discussions this week", value: stats.postsLast7Days },
    { label: "Total posts", value: stats.totalPosts },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
      {items.map((item) => (
        <div key={item.label} className="px-4 py-4 text-center">
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            {item.value.toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
