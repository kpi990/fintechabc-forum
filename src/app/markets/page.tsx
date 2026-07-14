import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import CryptoMovers from "@/components/CryptoMovers";
import BrandBadge from "@/components/BrandBadge";
import RangeBar from "@/components/RangeBar";
import {
  ASOF_DATE,
  upcomingIPOs,
  ipoSource,
  fnoSnapshot,
  fnoSource,
  homeLoanRates,
  loanRatesSource,
  healthInsurancePlans,
  insuranceSource,
} from "@/lib/indiaMarkets";

export const metadata: Metadata = {
  title: "Markets — Nifty, IPOs, loan rates, insurance & live crypto",
  description:
    "India market snapshot first — Nifty/Bank Nifty, upcoming IPOs, home loan rates, and health insurance plans, each linked to a live source — followed by live global crypto prices and top movers.",
};

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:underline"
    >
      Source: {label} ↗
    </a>
  );
}

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Markets</h1>
        <p className="mt-1 text-sm text-slate-500">
          India first, global crypto second — every section links to its live source.
        </p>
      </div>

      {/* ---------------- India, first ---------------- */}

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Nifty &amp; Bank Nifty — India
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              Snapshot: {fnoSnapshot.asOf}
            </span>
          </div>
          <SourceLink {...fnoSource} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">Nifty 50</span>
              <span
                className={`text-sm font-medium ${fnoSnapshot.nifty.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {fnoSnapshot.nifty.change >= 0 ? "+" : ""}
                {fnoSnapshot.nifty.change} ({fnoSnapshot.nifty.changePct}%)
              </span>
            </div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {fnoSnapshot.nifty.value.toLocaleString()}
            </div>
            <RangeBar
              low={fnoSnapshot.nifty.low}
              high={fnoSnapshot.nifty.high}
              value={fnoSnapshot.nifty.value}
              positive={fnoSnapshot.nifty.change >= 0}
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">Bank Nifty</span>
              <span
                className={`text-sm font-medium ${fnoSnapshot.bankNifty.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {fnoSnapshot.bankNifty.change >= 0 ? "+" : ""}
                {fnoSnapshot.bankNifty.change} ({fnoSnapshot.bankNifty.changePct}%)
              </span>
            </div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {fnoSnapshot.bankNifty.value.toLocaleString()}
            </div>
            <RangeBar
              low={fnoSnapshot.bankNifty.low}
              high={fnoSnapshot.bankNifty.high}
              value={fnoSnapshot.bankNifty.value}
              positive={fnoSnapshot.bankNifty.change >= 0}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">{fnoSnapshot.note}</p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Upcoming IPOs — India
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              As of {ASOF_DATE}
            </span>
          </div>
          <SourceLink {...ipoSource} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Open</th>
                <th className="px-4 py-3">Close</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Price / issue size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {upcomingIPOs.map((ipo) => (
                <tr key={ipo.name}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <BrandBadge name={ipo.name} size={24} />
                      {ipo.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        ipo.type === "Mainboard"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {ipo.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ipo.openDate}</td>
                  <td className="px-4 py-3 text-slate-600">{ipo.closeDate}</td>
                  <td className="px-4 py-3 text-slate-600">{ipo.listingDate}</td>
                  <td className="px-4 py-3 text-slate-600">{ipo.issueSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Home loan rates — India
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              As of {ASOF_DATE}
            </span>
          </div>
          <SourceLink {...loanRatesSource} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Bank</th>
                <th className="px-4 py-3">Rate from</th>
                <th className="px-4 py-3">Rate up to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {homeLoanRates.map((row) => (
                <tr key={row.bank}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <BrandBadge name={row.bank} size={24} />
                      {row.bank}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-emerald-700">{row.homeLoanFrom}</td>
                  <td className="px-4 py-3 text-slate-600">{row.homeLoanTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Reference rates only, not a quote — actual rate depends on credit score and loan amount.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Health insurance — India
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              As of {ASOF_DATE}
            </span>
          </div>
          <SourceLink {...insuranceSource} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Insurer</th>
                <th className="px-4 py-3">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {healthInsurancePlans.map((row) => (
                <tr key={row.insurer}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <BrandBadge name={row.insurer} size={24} />
                      {row.insurer}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Informational only, not personalized insurance advice — see the source link for current claim-settlement ratios.
        </p>
      </section>

      {/* ---------------- Global crypto, second ---------------- */}

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Global crypto — live
          </h2>
          <SourceLink label="CoinGecko API (live)" url="https://www.coingecko.com/en/api" />
        </div>
        <MarketTicker />
        <div className="mt-4">
          <CryptoMovers />
        </div>
      </section>
    </div>
  );
}
