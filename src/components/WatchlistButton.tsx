"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlistActions";

export default function WatchlistButton({
  coinId,
  initialInWatchlist,
  isLoggedIn,
}: {
  coinId: string;
  initialInWatchlist: boolean;
  isLoggedIn: boolean;
}) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const next = !inWatchlist;
    setInWatchlist(next);
    startTransition(async () => {
      const res = next ? await addToWatchlist(coinId) : await removeFromWatchlist(coinId);
      if (res?.error) {
        setInWatchlist(!next);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      aria-pressed={inWatchlist}
      className={`shrink-0 rounded-full p-1 transition disabled:opacity-50 ${
        inWatchlist ? "text-warn" : "text-faint hover:text-warn"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={inWatchlist ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.9-6.2 3.9 1.6-7-5.4-4.7 7.1-.6z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
