"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  targetType: "post" | "comment";
  targetId: string;
  initialScore: number;
};

export default function VoteButtons({ targetType, targetId, initialScore }: Props) {
  const [score, setScore] = useState(initialScore);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function vote(value: 1 | -1) {
    setScore((s) => s + value);
    startTransition(async () => {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, value }),
      });
      if (!res.ok) {
        setScore((s) => s - value);
        if (res.status === 401) router.push("/login");
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-1.5">
      <button
        onClick={() => vote(1)}
        disabled={isPending}
        aria-label="Upvote"
        className="rounded p-0.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
      >
        ▲
      </button>
      <span className="text-sm font-semibold text-slate-900">{score}</span>
      <button
        onClick={() => vote(-1)}
        disabled={isPending}
        aria-label="Downvote"
        className="rounded p-0.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
      >
        ▼
      </button>
    </div>
  );
}
