import { createClient } from "@/lib/supabase/server";
import type { AdminAction } from "@/lib/types";

const ACTION_LABELS: Record<string, string> = {
  ban_user: "Banned user",
  unban_user: "Unbanned user",
  promote_moderator: "Promoted to moderator",
  demote_moderator: "Removed moderator",
  promote_admin: "Promoted to admin",
  demote_admin: "Removed admin",
  rename_user: "Renamed user",
  dismiss_report: "Dismissed report",
  remove_reported_content: "Removed reported content",
  restore_content: "Restored content",
  create_board: "Created board",
  update_board: "Updated board",
  archive_board: "Archived board",
  unarchive_board: "Unarchived board",
};

export default async function AdminAuditPage() {
  const supabase = await createClient();

  const { data: actions } = await supabase
    .from("admin_actions")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<AdminAction[]>();

  const items = actions ?? [];

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        Every admin/moderator action, most recent first. Append-only — entries can&apos;t be
        edited or deleted through the app.
      </p>
      {!items.length ? (
        <p className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
          No admin actions logged yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-white/5 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">When</th>
                <th className="px-4 py-2.5 font-medium">Actor</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
                <th className="px-4 py-2.5 font-medium">Target</th>
                <th className="px-4 py-2.5 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2.5 text-muted">
                    {new Date(a.created_at).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2.5 text-slate-50">
                    {a.profiles?.username ?? "[deleted]"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-200">
                    {ACTION_LABELS[a.action] ?? a.action}
                  </td>
                  <td className="px-4 py-2.5 text-muted">
                    {a.target_type}
                    {a.target_id ? ` · ${a.target_id.slice(0, 12)}` : ""}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-faint">
                    {a.detail ? JSON.stringify(a.detail) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
