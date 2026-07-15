import { createClient } from "@/lib/supabase/server";
import type { Report } from "@/lib/types";
import { dismissReport, removeReportedContent } from "./actions";

export default async function ModerationPage() {
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select(
      "*, profiles(username), posts(id, title, body, is_removed), comments(id, body, is_removed, post_id)"
    )
    .eq("resolved", false)
    .order("created_at", { ascending: false })
    .returns<Report[]>();

  const items = reports ?? [];

  if (!items.length) {
    return (
      <p className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
        No open reports. New reports on posts or comments will show up here.
      </p>
    );
  }

  return (
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
                  <p className="whitespace-pre-wrap">
                    {"body" in target ? target.body : ""}
                  </p>
                  {alreadyRemoved && (
                    <span className="mt-1 inline-block text-xs font-medium text-down">
                      Already removed
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
          </div>
        );
      })}
    </div>
  );
}
