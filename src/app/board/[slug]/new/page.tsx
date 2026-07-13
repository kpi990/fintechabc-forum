import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NewPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/board/${slug}/new`);

  const { data: board } = await supabase.from("boards").select("id, name").eq("slug", slug).single();
  if (!board) notFound();

  async function createPost(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/login?next=/board/${slug}/new`);

    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    if (!title) return;

    const { data: boardRow } = await supabase.from("boards").select("id").eq("slug", slug).single();
    if (!boardRow) return;

    const { data: post } = await supabase
      .from("posts")
      .insert({ board_id: boardRow.id, author_id: user.id, title, body })
      .select("id")
      .single();

    if (post) redirect(`/post/${post.id}`);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-xl font-semibold">New post in {board.name}</h1>
      <form action={createPost} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-400">Title</label>
          <input
            name="title"
            required
            maxLength={300}
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-400">Body (optional)</label>
          <textarea
            name="body"
            rows={6}
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2"
          />
        </div>
        <button className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500">
          Post
        </button>
      </form>
    </div>
  );
}
