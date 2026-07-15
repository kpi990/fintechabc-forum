"use client";

import { useState, useTransition } from "react";
import { submitReport } from "@/lib/reportActions";

type Props = {
  targetType: "post" | "comment";
  targetId: string;
};

export default function ReportButton({ targetType, targetId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [isPending, startTransition] = useTransition();

  if (status === "done") {
    return <span className="text-xs text-slate-400">Reported</span>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-slate-400 transition hover:text-rose-600"
      >
        Report
      </button>
    );
  }

  return (
    <div className="mt-1.5 space-y-1.5">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (e.g. spam, abuse, misinformation)"
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
      />
      {status === "error" && (
        <p className="text-xs text-rose-600">Couldn&apos;t submit that report. Try again.</p>
      )}
      <div className="flex gap-2">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const res = await submitReport(targetType, targetId, reason);
              if (res?.error) setStatus("error");
              else setStatus("done");
            })
          }
          className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-rose-500 disabled:opacity-50"
        >
          Submit
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
