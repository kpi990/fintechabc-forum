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
    return <span className="text-xs text-faint">Reported</span>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-faint transition hover:text-down"
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
        className="w-full rounded-lg border border-line-strong px-2 py-1 text-xs text-slate-50 placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      {status === "error" && (
        <p className="text-xs text-down">Couldn&apos;t submit that report. Try again.</p>
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
          className="rounded-lg bg-down px-2 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-down/90 disabled:opacity-50"
        >
          Submit
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-line px-2 py-1 text-xs text-muted transition hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
