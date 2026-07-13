import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewsFeed from "@/components/NewsFeed";
import type { Board } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: boards } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <NewsFeed />

      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Boards</h1>
        <p className="mt-0.5 text-sm text-slate-500">Pick a topic to join the conversation.</p>
      </div>
      <div className="space-y-2.5">
        {(boards as Board[] | null)?.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.slug}`}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <div className="flex items-center gap-2 font-medium text-slate-900">
                {board.name}
                {board.is_paid && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    Paid
                  </span>
                )}
              </div>
              {board.description && (
                <p className="mt-1 text-sm text-slate-500">{board.description}</p>
              )}
            </div>
            <span className="text-slate-300 transition group-hover:text-violet-500">→</span>
          </Link>
        ))}
        {!boards?.length && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No boards yet. Run <code>schema.sql</code> in Supabase to seed the starter boards.
          </p>
        )}
      </div>
    </div>
  );
}
