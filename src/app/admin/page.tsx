import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getSignupTrend,
  getPostTrend,
  getCommentTrend,
  getTopBoards,
  getOpenReportCount,
} from "@/lib/stats";
import DailyBarChart from "@/components/DailyBarChart";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    users,
    banned,
    moderators,
    posts,
    removedPosts,
    comments,
    openReportCount,
    signupTrend,
    postTrend,
    commentTrend,
    topBoards,
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
    getOpenReportCount(),
    getSignupTrend(30),
    getPostTrend(30),
    getCommentTrend(30),
    getTopBoards(5),
  ]);

  const stats = [
    { label: "Total users", value: users.count ?? 0 },
    { label: "Banned users", value: banned.count ?? 0 },
    { label: "Moderators/admins", value: moderators.count ?? 0 },
    { label: "Total posts", value: posts.count ?? 0 },
    { label: "Removed posts", value: removedPosts.count ?? 0 },
    { label: "Total comments", value: comments.count ?? 0 },
  ];

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

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Last 30 days
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <DailyBarChart data={signupTrend} label="Signups" />
          <DailyBarChart data={postTrend} label="Posts" />
          <DailyBarChart data={commentTrend} label="Comments" />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Top boards
        </h2>
        {topBoards.length ? (
          <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-white/5 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Board</th>
                  <th className="px-4 py-2.5 font-medium">Posts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {topBoards.map((b) => (
                  <tr key={b.slug}>
                    <td className="px-4 py-2.5 font-medium text-slate-50">{b.name}</td>
                    <td className="px-4 py-2.5 text-muted">{b.postCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
            No boards with posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
