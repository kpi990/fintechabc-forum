import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Report } from "@/lib/types";
import { dismissReport, removeReportedContent, restoreContent } from "./actions";

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "open" } = await searchParams;
  const showResolved = tab === "resolved";

  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select(
      "*, profiles(username), posts(id, title, body, is_removed), comments(id, body, is_removed, post_id), resolver:resolved_by(username)"
    )
    .eq("resolved", showResolved)
    .order(showResolved ? "resolved_at" : "created_at", { ascending: false })
    .limit(showResolved ? 50 : 200)
    .returns<Report[]>();

  const items = reports ?? [];

  return (
    <div>
      <div className="mb-4 flex gap-1 border-b border-line">
        <Link
          href="/admin/moderation?tab=open"
          className={`rounded-t-lg px-3 py-2 text-sm font-medium transition ${
            !showResolved ? "border-b-2 border-accent text-accent" : "text-muted hover:text-slate-50"
          }`}
        >
          Open
        </Link>
        <Link
          href="/admin/moderation?tab=resolved"
          className={`rounded-t-lg px-3 py-2 text-sm font-medium transition ${
            showResolved ? "border-b-2 border-accent text-accent" : "text-muted hover:text-slate-50"
          }`}
        >
          Resolved
        </Link>
      </div>

      {!items.length && (
        <p className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
          {showResolved
            ? "No resolved reports yet."
            : "No open reports. New reports on posts or comments will show up here."}
        </p>
      )}

      <div className="space-y-3">
        {items.map((report) => {
          const isPost = !!report.post_id;
          const target = isPost ? report.posts : report.comments;
          const alreadyRemoved = target?.is_removed;

          return (
            <div key={report.id} className="rounded-xl border border-line bg-surface p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-xs text-muted">
                <span>
                  Reported by {report.profiles?.username ?? "[deleted]"} ·{" "}
                  {new Date(report.created_at).toLocaleString("en-IN")}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-medium uppercase tracking-wide">
                  {isPost ? "Post" : "Comment"}
                </span>
              </div>

              <div className="mb-2 rounded-lg bg-white/5 p-3 text-sm text-slate-200">
                {target ? (
                  <>
                    {isPost && "title" in target && (
                      <div className="mb-1 font-medium text-slate-50">{target.title}</div>
                    )}
                    <p className="whitespace-pre-wrap">{"body" in target ? target.body : ""}</p>
                    {alreadyRemoved && (
                      <span className="mt-1 inline-block text-xs font-medium text-down">
                        Currently removed
                      </span>
                    )}
                  </>
                ) : (
                  <em className="text-faint">Content no longer exists</em>
                )}
              </div>

              <div className="mb-3 text-sm text-muted">
                <span className="font-medium text-slate-100">Reason: </span>
                {report.reason}
              </div>

              {showResolved ? (
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      report.resolution === "removed"
                        ? "bg-down/15 text-down"
                        : "bg-white/10 text-faint"
                    }`}
                  >
                    {report.resolution === "removed" ? "Content removed" : "Dismissed"}
                  </span>
                  <span>
                    by {report.resolver?.username ?? "unknown"} ·{" "}
                    {report.resolved_at ? new Date(report.resolved_at).toLocaleString("en-IN") : ""}
                  </span>
                  {alreadyRemoved && target && (
                    <form action={restoreContent.bind(null, isPost ? "post" : "comment", target.id)}>
                      <button className="rounded-lg border border-line px-2.5 py-1 font-medium text-muted transition hover:bg-white/5">
                        Restore content
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  {target && !alreadyRemoved && (
                    <form
                      action={removeReportedContent.bind(
                        null,
                        report.id,
                        isPost ? "post" : "comment",
                        target.id
                      )}
                    >
                      <button className="rounded-lg bg-down px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-down/90">
                        Remove content
                      </button>
                    </form>
                  )}
                  <form action={dismissReport.bind(null, report.id)}>
                    <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-white/5">
                      Dismiss report
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
