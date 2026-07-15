import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VoteButtons from "@/components/VoteButtons";
import Avatar from "@/components/Avatar";
import type { Board, Post } from "@/lib/types";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: board } = await supabase
    .from("boards")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!board) return { title: "Board not found" };

  return {
    title: board.name,
    description: board.description ?? `Discussions in the ${board.name} board on fintechabc.`,
  };
}

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              {board.name}
            </h1>
            {board.is_paid && (
              <span className="inline-flex items-center rounded-full bg-warn/10 px-2.5 py-0.5 text-xs font-medium text-warn ring-1 ring-inset ring-warn/20">
                Paid
              </span>
            )}
          </div>
          {board.description && <p className="mt-1 text-sm text-muted">{board.description}</p>}
        </div>
        <Link
          href={`/board/${slug}/new`}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-400"
        >
          New post
        </Link>
      </div>

      <div className="space-y-3">
        {(posts as Post[] | null)?.map((post) => (
          <div
            key={post.id}
            className="flex gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:shadow-md"
          >
            <VoteButtons targetType="post" targetId={post.id} initialScore={post.score} />
            <div className="flex-1">
              <Link
                href={`/post/${post.id}`}
                className="font-medium text-slate-50 transition hover:text-accent"
              >
                {post.title}
              </Link>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                <Avatar username={post.profiles?.username ?? "?"} />
                <span>{post.profiles?.username ?? "[deleted]"}</span>
              </div>
            </div>
          </div>
        ))}
        {!posts?.length && (
          <p className="rounded-xl border border-dashed border-line-strong bg-surface p-8 text-center text-sm text-muted">
            No posts yet — be the first.
          </p>
        )}
      </div>
    </div>
  );
}
