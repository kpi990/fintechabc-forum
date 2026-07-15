import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewerRole } from "@/lib/admin";
import type { Profile, Post, Comment } from "@/lib/types";
import { setBanned, setModerator, setAdmin } from "../actions";

type ProfileWithEmail = Profile & { user_emails: { email: string } | null };

// Minimal shape for the "reports against this user's content" section -
// doesn't need the full Report type's nested post/comment fields since we
// only render the report's own columns here.
type ReportSummary = {
  id: string;
  reason: string;
  resolved: boolean;
  resolution: "removed" | "dismissed" | null;
  created_at: string;
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const viewer = await getViewerRole();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, user_emails(email)")
    .eq("id", id)
    .single<ProfileWithEmail>();

  if (!profile) notFound();

  const [{ data: posts }, { data: comments }, { data: reportsOnPosts }, { data: reportsOnComments }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("*, boards(name, slug)")
        .eq("author_id", id)
        .order("created_at", { ascending: false })
        .limit(20)
        .returns<Post[]>(),
      supabase
        .from("comments")
        .select("*")
        .eq("author_id", id)
        .order("created_at", { ascending: false })
        .limit(20)
        .returns<Comment[]>(),
      supabase
        .from("reports")
        .select("id, reason, resolved, resolution, created_at, posts!inner(author_id)")
        .eq("posts.author_id", id)
        .order("created_at", { ascending: false })
        .returns<ReportSummary[]>(),
      supabase
        .from("reports")
        .select("id, reason, resolved, resolution, created_at, comments!inner(author_id)")
        .eq("comments.author_id", id)
        .order("created_at", { ascending: false })
        .returns<ReportSummary[]>(),
    ]);

  const reportsAgainst = [...(reportsOnPosts ?? []), ...(reportsOnComments ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const isSelf = viewer?.userId === profile.id;

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="text-sm text-muted hover:text-accent">
        ← Back to Users
      </Link>

      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-50">{profile.username}</span>
              {profile.is_admin && (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                  Admin
                </span>
              )}
              {!profile.is_admin && profile.is_moderator && (
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-medium text-sky-400">
                  Moderator
                </span>
              )}
              {profile.is_banned && (
                <span className="rounded-full bg-down/15 px-2 py-0.5 text-xs font-medium text-down">
                  Banned
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-muted">{profile.user_emails?.email ?? "No email on file"}</div>
            <div className="mt-1 text-xs text-faint">
              Karma {profile.karma} · Joined {new Date(profile.created_at).toLocaleDateString("en-IN")}
            </div>
          </div>
          {!isSelf && (
            <div className="flex flex-wrap gap-2">
              {!profile.is_admin && (
                <form action={setBanned.bind(null, profile.id, !profile.is_banned)}>
                  <button className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-white/5">
                    {profile.is_banned ? "Unban" : "Ban"}
                  </button>
                </form>
              )}
              {!profile.is_admin && (
                <form action={setModerator.bind(null, profile.id, !profile.is_moderator)}>
                  <button className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-white/5">
                    {profile.is_moderator ? "Remove moderator" : "Make moderator"}
                  </button>
                </form>
              )}
              <form action={setAdmin.bind(null, profile.id, !profile.is_admin)}>
                <button className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-white/5">
                  {profile.is_admin ? "Remove admin" : "Make admin"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Recent posts ({posts?.length ?? 0})
        </h2>
        {posts?.length ? (
          <div className="space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="rounded-lg border border-line bg-surface p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/post/${p.id}`} className="font-medium text-slate-50 hover:text-accent">
                    {p.title}
                  </Link>
                  {p.is_removed && (
                    <span className="text-xs font-medium text-down">Removed</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-faint">
                  {p.boards?.name ?? "Unknown board"} · score {p.score} ·{" "}
                  {new Date(p.created_at).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-line-strong bg-surface p-4 text-sm text-muted">
            No posts yet.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Recent comments ({comments?.length ?? 0})
        </h2>
        {comments?.length ? (
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-line bg-surface p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/post/${c.post_id}`} className="text-slate-200 hover:text-accent">
                    {c.body.slice(0, 140)}
                    {c.body.length > 140 ? "…" : ""}
                  </Link>
                  {c.is_removed && (
                    <span className="shrink-0 text-xs font-medium text-down">Removed</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-faint">
                  score {c.score} · {new Date(c.created_at).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-line-strong bg-surface p-4 text-sm text-muted">
            No comments yet.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Reports against their content ({reportsAgainst.length})
        </h2>
        {reportsAgainst.length ? (
          <div className="space-y-2">
            {reportsAgainst.map((r) => (
              <div key={r.id} className="rounded-lg border border-line bg-surface p-3 text-sm">
                <div className="flex items-center justify-between gap-2 text-xs text-muted">
                  <span>{new Date(r.created_at).toLocaleString("en-IN")}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      r.resolved
                        ? "bg-white/10 text-faint"
                        : "bg-warn/15 text-warn"
                    }`}
                  >
                    {r.resolved ? `Resolved (${r.resolution})` : "Open"}
                  </span>
                </div>
                <div className="mt-1 text-slate-200">Reason: {r.reason}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-line-strong bg-surface p-4 text-sm text-muted">
            No reports filed against this user's content.
          </p>
        )}
      </section>
    </div>
  );
}
