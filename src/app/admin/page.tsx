import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    users,
    banned,
    moderators,
    posts,
    removedPosts,
    comments,
    openReports,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .or("is_moderator.eq.true,is_admin.eq.true"),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("is_removed", true),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("resolved", false),
  ]);

  const stats = [
    { label: "Total users", value: users.count ?? 0 },
    { label: "Banned users", value: banned.count ?? 0 },
    { label: "Moderators/admins", value: moderators.count ?? 0 },
    { label: "Total posts", value: posts.count ?? 0 },
    { label: "Removed posts", value: removedPosts.count ?? 0 },
    { label: "Total comments", value: comments.count ?? 0 },
  ];

  const openReportCount = openReports.count ?? 0;

  return (
    <div>
      {openReportCount > 0 && (
        <Link
          href="/admin/moderation"
          className="mb-5 block rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm font-medium text-warn transition hover:bg-warn/15"
        >
          {openReportCount} open report{openReportCount === 1 ? "" : "s"} awaiting review →
        </Link>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-4 shadow-sm">
            <div className="text-2xl font-semibold text-slate-50">{s.value}</div>
            <div className="mt-0.5 text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
