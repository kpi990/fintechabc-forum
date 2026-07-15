import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { getViewerRole } from "@/lib/admin";
import { setBanned, setModerator } from "./actions";

type ProfileWithEmail = Profile & { user_emails: { email: string } | null };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const viewer = await getViewerRole();

  // user_emails is a separate, admin-only-readable table (see schema.sql) -
  // profiles itself is publicly readable, so email is deliberately kept out
  // of that table to avoid exposing every user's address to anon visitors.
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*, user_emails(email)")
    .order("created_at", { ascending: true })
    .returns<ProfileWithEmail[]>();

  const users = profiles ?? [];

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-white/5 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-2.5 font-medium">User</th>
            <th className="px-4 py-2.5 font-medium">Email</th>
            <th className="px-4 py-2.5 font-medium">Karma</th>
            <th className="px-4 py-2.5 font-medium">Joined</th>
            <th className="px-4 py-2.5 font-medium">Role</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {users.map((u) => {
            const isSelf = viewer?.userId === u.id;
            return (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-slate-50">{u.username}</td>
                <td className="px-4 py-3 text-muted">{u.user_emails?.email ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{u.karma}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(u.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  {u.is_admin ? (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                      Admin
                    </span>
                  ) : u.is_moderator ? (
                    <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-medium text-sky-400">
                      Moderator
                    </span>
                  ) : (
                    <span className="text-xs text-faint">Member</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.is_banned ? (
                    <span className="rounded-full bg-down/15 px-2 py-0.5 text-xs font-medium text-down">
                      Banned
                    </span>
                  ) : (
                    <span className="text-xs text-faint">Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isSelf || u.is_admin ? (
                    <span className="text-xs text-faint">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <form action={setBanned.bind(null, u.id, !u.is_banned)}>
                        <button className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-white/5">
                          {u.is_banned ? "Unban" : "Ban"}
                        </button>
                      </form>
                      <form action={setModerator.bind(null, u.id, !u.is_moderator)}>
                        <button className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-white/5">
                          {u.is_moderator ? "Remove moderator" : "Make moderator"}
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
