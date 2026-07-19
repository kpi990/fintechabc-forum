import Link from "next/link";
import LiveBadge from "@/components/LiveBadge";
import { ASOF_DATE, fnoSnapshot, fnoSource } from "@/lib/indiaMarkets";

export default function IndiaSnapshotCard() {
  const { nifty, bankNifty } = fnoSnapshot;
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex flex-col gap-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Today&apos;s trade
        </h3>
        <LiveBadge mode="asof" label={ASOF_DATE} interval="manual review" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-200">Nifty 50</span>
          <span className="font-medium text-slate-50">{nifty.value.toLocaleString()}</span>
          <span className={nifty.change >= 0 ? "text-up" : "text-down"}>
            {nifty.change >= 0 ? "+" : ""}
            {nifty.changePct}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-200">Bank Nifty</span>
          <span className="font-medium text-slate-50">{bankNifty.value.toLocaleString()}</span>
          <span className={bankNifty.change >= 0 ? "text-up" : "text-down"}>
            {bankNifty.change >= 0 ? "+" : ""}
            {bankNifty.changePct}%
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Link href="/markets" className="text-xs font-medium text-accent hover:underline">
          IPOs, loan rates &amp; insurance →
        </Link>
        <a
          href={fnoSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-faint hover:underline"
        >
          Live data ↗
        </a>
      </div>
    </div>
  );
}
