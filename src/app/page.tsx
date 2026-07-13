import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Board } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: boards } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Boards</h1>
      <div className="space-y-3">
        {(boards as Board[] | null)?.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.slug}`}
            className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700"
          >
            <div>
              <div className="flex items-center gap-2 font-medium">
                {board.name}
                {board.is_paid && (
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                    Paid
                  </span>
                )}
              </div>
              {board.description && (
                <p className="mt-1 text-sm text-gray-400">{board.description}</p>
              )}
            </div>
          </Link>
        ))}
        {!boards?.length && (
          <p className="text-gray-500">
            No boards yet. Run <code>schema.sql</code> in Supabase to seed the starter boards.
          </p>
        )}
      </div>
    </div>
  );
}
