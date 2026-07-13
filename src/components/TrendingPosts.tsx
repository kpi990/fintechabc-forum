import Link from "next/link";
import { getTrendingPosts } from "@/lib/stats";

export default async function TrendingPosts() {
  const posts = await getTrendingPosts(5);
  if (!posts.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Trending this week
      </h3>
      <div className="divide-y divide-slate-100">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="flex items-center justify-between py-2 text-sm transition hover:text-violet-600"
          >
            <span className="truncate pr-3 text-slate-800">{post.title}</span>
            <span className="shrink-0 text-xs font-medium text-slate-400">▲ {post.score}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
