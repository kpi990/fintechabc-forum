import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { getViewerRole } from "@/lib/admin";
import { setBanned, setModerator, setAdmin, setUsername } from "./actions";

type ProfileWithEmail = Profile & { user_emails: { email: string } | null };

const PAGE_SIZE = 20;

// Search/filter/role/status are applied in-memory rather than as Supabase
// query filters: username search needs to also match the admin-only
// user_emails table, which isn't something a single PostgREST query can OR
// across two tables. Fine at current scale (tens to low hundreds of users);
// if this ever grows into the thousands, move filtering into a Postgres
// view/RPC that joins profiles+user_emails server-side instead.
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string; role?: string; status?: string; page?: string }>;
}) {
  const { error, q = "", role = "all", status = "all", page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const supabase = await createClient();
  const viewer = await getViewerRole();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*, user_emails(email)")
    .order("created_at", { ascending: true })
    .returns<ProfileWithEmail[]>();

  let users = profiles ?? [];

  const needle = q.trim().toLowerCase();
  if (needle) {
    users = users.filter(
      (u) =>
        u.username.toLowerCase().includes(needle) ||
        (u.user_emails?.email ?? "").toLowerCase().includes(needle)
    );
  }
  if (role === "admin") users = users.filter((u) => u.is_admin);
  else if (role === "moderator") users = users.filter((u) => u.is_moderator && !u.is_admin);
  else if (role === "member") users = users.filter((u) => !u.is_admin && !u.is_moderator);

  if (status === "active") users = users.filter((u) => !u.is_banned);
  else if (status === "banned") users = users.filter((u) => u.is_banned);

  const total = users.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageUsers = users.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  const buildPageLink = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role !== "all") params.set("role", role);
    if (status !== "all") params.set("status", status);
    params.set("page", String(p));
    return `/admin/users?${params.toString()}`;
  };

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg bg-down/10 p-3 text-sm text-down ring-1 ring-inset ring-down/20">
          {error}
        </p>
      )}

      <form className="mb-4 flex flex-wrap items-center gap-2" action="/admin/users">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search username or email..."
          className="w-56 rounded-lg border border-line-strong bg-transparent px-3 py-1.5 text-sm text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          name="role"
          defaultValue={role}
          className="rounded-lg border border-line-strong bg-surface px-2 py-1.5 text-sm text-slate-50"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="member">Member</option>
        </select>
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-line-strong bg-surface px-2 py-1.5 text-sm text-slate-50"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
        <button className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-400">
          Filter
        </button>
        {(q || role !== "all" || status !== "all") && (
          <Link href="/admin/users" className="text-sm text-muted hover:text-accent">
            Clear
          </Link>
        )}
        <span className="ml-auto text-xs text-faint">
          {total} user{total === 1 ? "" : "s"}
        </span>
      </form>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
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
          {pageUsers.map((u) => {
            const isSelf = viewer?.userId === u.id;
            return (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <div className="mb-1">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      {u.username} →
                    </Link>
                  </div>
                  <form
                    action={setUsername.bind(null, u.id)}
                    className="flex items-center gap-1.5"
                  >
                    <input
                      name="username"
                      defaultValue={u.username}
                      minLength={3}
                      maxLength={20}
                      pattern="[a-zA-Z0-9_]+"
                      className="w-32 rounded-md border border-line-strong bg-transparent px-2 py-1 text-sm font-medium text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      className="rounded-md border border-line px-2 py-1 text-xs text-muted transition hover:bg-white/5"
                      title="Save username"
                    >
                      Save
                    </button>
                  </form>
                </td>
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
                  {isSelf ? (
                    <span className="text-xs text-faint">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {!u.is_admin && (
                        <form action={setBanned.bind(null, u.id, !u.is_banned)}>
                          <button className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-white/5">
                            {u.is_banned ? "Unban" : "Ban"}
                          </button>
                        </form>
                      )}
                      {!u.is_admin && (
                        <form action={setModerator.bind(null, u.id, !u.is_moderator)}>
                          <button className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-white/5">
                            {u.is_moderator ? "Remove moderator" : "Make moderator"}
                          </button>
                        </form>
                      )}
                      <form action={setAdmin.bind(null, u.id, !u.is_admin)}>
                        <button className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-white/5">
                          {u.is_admin ? "Remove admin" : "Make admin"}
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          {!pageUsers.length && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                No users match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <Link
            href={buildPageLink(Math.max(1, clampedPage - 1))}
            aria-disabled={clampedPage <= 1}
            className={`rounded-lg border border-line px-3 py-1.5 ${
              clampedPage <= 1 ? "pointer-events-none opacity-40" : "text-muted hover:bg-white/5"
            }`}
          >
            Previous
          </Link>
          <span className="text-xs text-faint">
            Page {clampedPage} of {totalPages}
          </span>
          <Link
            href={buildPageLink(Math.min(totalPages, clampedPage + 1))}
            aria-disabled={clampedPage >= totalPages}
            className={`rounded-lg border border-line px-3 py-1.5 ${
              clampedPage >= totalPages ? "pointer-events-none opacity-40" : "text-muted hover:bg-white/5"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
