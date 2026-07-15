import { createClient } from "@/lib/supabase/server";
import type { Board } from "@/lib/types";
import { createBoard, updateBoard, setBoardArchived } from "./actions";

export default async function AdminBoardsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: boards } = await supabase
    .from("boards")
    .select("*, posts(count)")
    .order("created_at", { ascending: true })
    .returns<Board[]>();

  const items = boards ?? [];

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg bg-down/10 p-3 text-sm text-down ring-1 ring-inset ring-down/20">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Create a new board
        </h2>
        <form action={createBoard} className="grid gap-3 sm:grid-cols-2">
          <input
            name="slug"
            placeholder="slug (e.g. personal-finance)"
            pattern="[a-z0-9-]{2,40}"
            required
            className="rounded-lg border border-line-strong bg-transparent px-3 py-1.5 text-sm text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            name="name"
            placeholder="Display name"
            required
            className="rounded-lg border border-line-strong bg-transparent px-3 py-1.5 text-sm text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="sm:col-span-2 rounded-lg border border-line-strong bg-transparent px-3 py-1.5 text-sm text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="is_paid" className="rounded border-line-strong" />
            Paid board
          </label>
          <button className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-400 sm:w-fit sm:justify-self-end">
            Create board
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {items.map((board) => {
          const isCoinBoard = !!board.coin_id;
          const postCount = board.posts?.[0]?.count ?? 0;
          return (
            <div
              key={board.id}
              className={`rounded-xl border p-4 shadow-sm ${
                board.is_archived ? "border-line-strong bg-white/[0.02] opacity-70" : "border-line bg-surface"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-faint">
                  /{board.slug}
                </span>
                {isCoinBoard && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent">
                    Coin board
                  </span>
                )}
                {board.is_paid && (
                  <span className="rounded-full bg-warn/10 px-2 py-0.5 font-medium text-warn ring-1 ring-inset ring-warn/20">
                    Paid
                  </span>
                )}
                {board.is_archived && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-medium text-faint">
                    Archived
                  </span>
                )}
                <span className="ml-auto text-faint">
                  {postCount} {postCount === 1 ? "post" : "posts"}
                </span>
              </div>

              {isCoinBoard ? (
                <div className="text-sm text-slate-200">
                  <div className="font-medium text-slate-50">{board.name}</div>
                  <p className="mt-1 text-muted">{board.description}</p>
                  <p className="mt-2 text-xs text-faint">
                    Coin-linked boards are named/described automatically and aren't editable here.
                  </p>
                </div>
              ) : (
                <form action={updateBoard.bind(null, board.id)} className="grid gap-2 sm:grid-cols-2">
                  <input
                    name="name"
                    defaultValue={board.name}
                    required
                    className="rounded-lg border border-line-strong bg-transparent px-3 py-1.5 text-sm text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <input
                    name="description"
                    defaultValue={board.description ?? ""}
                    className="rounded-lg border border-line-strong bg-transparent px-3 py-1.5 text-sm text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      name="is_paid"
                      defaultChecked={board.is_paid}
                      className="rounded border-line-strong"
                    />
                    Paid board
                  </label>
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-white/5">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {!isCoinBoard && (
                <div className="mt-3 border-t border-line pt-3">
                  <form action={setBoardArchived.bind(null, board.id, !board.is_archived)}>
                    <button className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-white/5">
                      {board.is_archived ? "Unarchive" : "Archive"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
