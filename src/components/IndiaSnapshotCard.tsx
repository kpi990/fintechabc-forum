import Link from "next/link";
import { ASOF_DATE, fnoSnapshot } from "@/lib/indiaMarkets";

// Compact India market card for the dashboard sidebar column on Home.
// Full detail (IPOs, loan rates, insurance) lives on /markets.
export default function IndiaSnapshotCard() {
  const { nifty, bankNifty } = fnoSnapshot;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          India snapshot
        </h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          As of {ASOF_DATE}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-700">Nifty 50</span>
          <span className="font-medium text-slate-900">{nifty.value.toLocaleString()}</span>
          <span className={nifty.change >= 0 ? "text-emerald-600" : "text-rose-600"}>
            {nifty.change >= 0 ? "+" : ""}
            {nifty.changePct}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-700">Bank Nifty</span>
          <span className="font-medium text-slate-900">{bankNifty.value.toLocaleString()}</span>
          <span className={bankNifty.change >= 0 ? "text-emerald-600" : "text-rose-600"}>
            {bankNifty.change >= 0 ? "+" : ""}
            {bankNifty.changePct}%
          </span>
        </div>
      </div>
      <Link href="/markets" className="mt-3 block text-xs font-medium text-violet-600 hover:underline">
        IPOs, loan rates &amp; insurance →
      </Link>
    </div>
  );
}
