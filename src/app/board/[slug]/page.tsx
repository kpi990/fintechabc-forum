import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VoteButtons from "@/components/VoteButtons";
import type { Board, Post } from "@/lib/types";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug)
    .single<Board>();

  if (!board) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url)")
    .eq("board_id", board.id)
    .eq("is_removed", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{board.name}</h1>
          {board.description && <p className="text-gray-400">{board.description}</p>}
        </div>
        <Link
          href={`/board/${slug}/new`}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          New post
        </Link>
      </div>

      <div className="space-y-3">
        {(posts as Post[] | null)?.map((post) => (
          <div key={post.id} className="flex gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
            <VoteButtons targetType="post" targetId={post.id} initialScore={post.score} />
            <div className="flex-1">
              <Link href={`/post/${post.id}`} className="font-medium hover:underline">
                {post.title}
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                posted by u/{post.profiles?.username ?? "[deleted]"}
              </p>
            </div>
          </div>
        ))}
        {!posts?.length && <p className="text-gray-500">No posts yet — be the first.</p>}
      </div>
    </div>
  );
}
