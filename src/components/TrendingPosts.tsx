import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { getTrendingPosts } from "@/lib/stats";
import Avatar from "@/components/Avatar";

// This is the actual core of the product — real community discussions —
// so it gets a full card treatment on Home, not just a bare link list.
export default async function TrendingPosts() {
  const posts = await getTrendingPosts(5);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Trending discussions
        </h3>
        <Link href="/community" className="text-xs font-medium text-accent hover:underline">
          View all →
        </Link>
      </div>

      {!posts.length ? (
        <div className="rounded-lg border border-dashed border-line py-8 text-center">
          <p className="text-sm text-muted">No discussions yet — be the first to post.</p>
          <Link
            href="/community"
            className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
          >
            Browse boards →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {posts.map((post) => {
            const commentCount = post.comments?.[0]?.count ?? 0;
            return (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="block py-3 transition hover:bg-white/5"
              >
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
                  <Avatar username={post.profiles?.username ?? "?"} />
                  <span className="font-medium text-slate-200">
                    {post.profiles?.username ?? "[deleted]"}
                  </span>
                  {post.boards?.name && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
                      {post.boards.name}
                    </span>
                  )}
                  <span>·</span>
                  <span>{formatDistanceToNowStrict(new Date(post.created_at), { addSuffix: true })}</span>
                </div>
                <h4 className="font-medium text-slate-50">{post.title}</h4>
                {post.body && (
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">{post.body}</p>
                )}
                <div className="mt-1.5 flex items-center gap-4 text-xs text-faint">
                  <span>▲ {post.score}</span>
                  <span>{commentCount} {commentCount === 1 ? "reply" : "replies"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
