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
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-slate-900">
        New post in {board.name}
      </h1>
      <form
        action={createPost}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            required
            maxLength={300}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Body (optional)
          </label>
          <textarea
            name="body"
            rows={6}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <button className="w-full rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-violet-500">
          Post
        </button>
      </form>
    </div>
  );
}
