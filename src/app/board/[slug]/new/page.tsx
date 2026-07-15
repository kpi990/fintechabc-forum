import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkBotId } from "botid/server";
import { checkLimit } from "@/lib/rateLimit";

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
    const verification = await checkBotId();
    if (verification.isBot) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/login?next=/board/${slug}/new`);
    if (!checkLimit(`post:${user.id}`, 5, 10 * 60 * 1000)) return;

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
      <h1 className="mb-6 text-xl font-semibold tracking-tight text-slate-50">
        New post in {board.name}
      </h1>
      <form
        action={createPost}
        className="space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-sm"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">Title</label>
          <input
            name="title"
            required
            maxLength={300}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-slate-50 placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">
            Body (optional)
          </label>
          <textarea
            name="body"
            rows={6}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-slate-50 placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <button className="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-violet-400">
          Post
        </button>
      </form>
    </div>
  );
}
