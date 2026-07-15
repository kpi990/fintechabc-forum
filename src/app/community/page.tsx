import Link from "next/link";
import type { Metadata } from "next";
import { getBoardsWithStats } from "@/lib/stats";
import { getCommunityStats } from "@/lib/stats";
import BrandBadge from "@/components/BrandBadge";

export const metadata: Metadata = {
  title: "Community boards",
  description: "Browse fintechabc's crypto, markets, and personal-finance discussion boards.",
};

export default async function CommunityPage() {
  const [boards, stats] = await Promise.all([getBoardsWithStats(), getCommunityStats()]);

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-line bg-gradient-to-br from-violet-600 to-fuchsia-500 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Community boards</h1>
        <p className="mt-1 max-w-lg text-sm text-violet-100">
          Pick a topic and join the conversation — crypto, markets, and personal finance,
          moderated for quality discussion.
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <div className="text-lg font-semibold">{stats.memberCount.toLocaleString()}</div>
            <div className="text-xs text-violet-100">Members</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{boards.length}</div>
            <div className="text-xs text-violet-100">Boards</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{stats.totalPosts.toLocaleString()}</div>
            <div className="text-xs text-violet-100">Total posts</div>
          </div>
        </div>
      </div>

      {!boards.length ? (
        <p className="rounded-xl border border-dashed border-line-strong bg-surface p-8 text-center text-sm text-muted">
          No boards yet. Run <code>schema.sql</code> in Supabase to seed the starter boards.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <BrandBadge name={board.name} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-medium text-slate-50">
                  <span className="truncate">{board.name}</span>
                  {board.is_paid && (
                    <span className="shrink-0 rounded-full bg-warn/10 px-2.5 py-0.5 text-xs font-medium text-warn ring-1 ring-inset ring-warn/20">
                      Paid
                    </span>
                  )}
                </div>
                {board.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{board.description}</p>
                )}
                <div className="mt-2 text-xs text-faint">
                  {board.postCount} {board.postCount === 1 ? "post" : "posts"}
                </div>
              </div>
              <span className="shrink-0 text-faint transition group-hover:text-accent">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
