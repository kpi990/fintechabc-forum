import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VoteButtons from "@/components/VoteButtons";
import CommentThread from "@/components/CommentThread";
import Avatar from "@/components/Avatar";
import ReportButton from "@/components/ReportButton";
import type { Post, Comment } from "@/lib/types";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("title, body").eq("id", id).single();

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.body ? post.body.slice(0, 160) : `Discussion: ${post.title}`,
  };
}

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
      <div className="mb-6 flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <VoteButtons targetType="post" targetId={post.id} initialScore={post.score} />
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">{post.title}</h1>
          <div className="mb-3 mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Avatar username={post.profiles?.username ?? "?"} />
            <span>{post.profiles?.username ?? "[deleted]"}</span>
          </div>
          {post.is_removed ? (
            <p className="italic text-slate-400">[removed by moderator]</p>
          ) : (
            post.body && (
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{post.body}</p>
            )
          )}
          <div className="mt-2">
            <ReportButton targetType="post" targetId={post.id} />
          </div>
        </div>
      </div>

      <form
        action={addComment}
        className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <textarea
          name="body"
          required
          rows={3}
          placeholder="Add a comment"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        <button className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500">
          Comment
        </button>
      </form>

      <CommentThread comments={(comments as Comment[] | null) ?? []} parentId={null} />
    </div>
  );
}
