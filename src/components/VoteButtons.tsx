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
    <div className="flex flex-col items-center gap-1 text-gray-400">
      <button
        onClick={() => vote(1)}
        disabled={isPending}
        aria-label="Upvote"
        className="hover:text-orange-400 disabled:opacity-50"
      >
        ▲
      </button>
      <span className="text-sm font-medium text-gray-200">{score}</span>
      <button
        onClick={() => vote(-1)}
        disabled={isPending}
        aria-label="Downvote"
        className="hover:text-blue-400 disabled:opacity-50"
      >
        ▼
      </button>
    </div>
  );
}
