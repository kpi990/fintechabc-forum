"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToWatchlist } from "@/lib/watchlistActions";

export default function WatchlistAddPicker({
  options,
}: {
  options: { id: string; symbol: string; name: string }[];
}) {
  const [selected, setSelected] = useState(options[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!options.length) return null;

  return (
    <div className="mt-3 flex gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full rounded-lg border border-line-strong bg-surface-2 px-2.5 py-1.5 text-xs text-slate-200 focus:border-accent focus:outline-none"
      >
        {options.map((c) => (
          <option key={c.id} value={c.id}>
            {c.symbol} — {c.name}
          </option>
        ))}
      </select>
      <button
        disabled={isPending || !selected}
        onClick={() =>
          startTransition(async () => {
            await addToWatchlist(selected);
            router.refresh();
          })
        }
        className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-400 disabled:opacity-50"
      >
        Add
      </button>
    </div>
  );
}
