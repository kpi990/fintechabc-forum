import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VoteButtons from "@/components/VoteButtons";
import CommentThread from "@/components/CommentThread";
import type { Post, Comment } from "@/lib/types";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url)")
    .eq("id", id)
    .single<Post>();

  if (!post) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(username, avatar_url)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  async function addComment(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/login?next=/post/${id}`);

    const body = String(formData.get("body") ?? "").trim();
    const parentId = formData.get("parentId") ? String(formData.get("parentId")) : null;
    if (!body) return;

    await supabase.from("comments").insert({
      post_id: id,
      parent_id: parentId,
      author_id: user.id,
      body,
    });
    redirect(`/post/${id}`);
  }

  return (
    <div>
      <div className="mb-6 flex gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
        <VoteButtons targetType="post" targetId={post.id} initialScore={post.score} />
        <div>
          <h1 className="text-xl font-semibold">{post.title}</h1>
          <p className="mb-2 text-xs text-gray-500">
            posted by u/{post.profiles?.username ?? "[deleted]"}
          </p>
          {post.body && <p className="whitespace-pre-wrap text-gray-200">{post.body}</p>}
        </div>
      </div>

      <form action={addComment} className="mb-6 space-y-2">
        <textarea
          name="body"
          required
          rows={3}
          placeholder="Add a comment"
          className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2"
        />
        <button className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500">
          Comment
        </button>
      </form>

      <CommentThread comments={(comments as Comment[] | null) ?? []} parentId={null} />
    </div>
  );
}
