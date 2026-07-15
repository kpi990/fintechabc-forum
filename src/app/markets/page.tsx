import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import CryptoMovers from "@/components/CryptoMovers";
import BrandBadge from "@/components/BrandBadge";
import RangeBar from "@/components/RangeBar";
import TradingViewChart from "@/components/TradingViewChart";
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
  alternates: {
    canonical: "/markets",
  },
};

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
    >
      Source: {label} ↗
    </a>
  );
}

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Markets</h1>
        <p className="mt-1 text-sm text-muted">
          India first, global crypto second — every section links to its live source.
        </p>
      </div>

      {/* ---------------- India, first ---------------- */}

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Nifty &amp; Bank Nifty — India
            </h2>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
              Snapshot: {fnoSnapshot.asOf}
            </span>
          </div>
          <SourceLink {...fnoSource} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-50">Nifty 50</span>
              <span
                className={`text-sm font-medium ${fnoSnapshot.nifty.change >= 0 ? "text-up" : "text-down"}`}
              >
                {fnoSnapshot.nifty.change >= 0 ? "+" : ""}
                {fnoSnapshot.nifty.change} ({fnoSnapshot.nifty.changePct}%)
              </span>
            </div>
            <div className="mt-1 text-2xl font-semibold text-slate-50">
              {fnoSnapshot.nifty.value.toLocaleString()}
            </div>
            {fnoSnapshot.nifty.low != null && fnoSnapshot.nifty.high != null ? (
              <RangeBar
                low={fnoSnapshot.nifty.low}
                high={fnoSnapshot.nifty.high}
                value={fnoSnapshot.nifty.value}
                positive={fnoSnapshot.nifty.change >= 0}
              />
            ) : (
              <p className="mt-2 text-[10px] text-faint">
                Intraday range not independently verified for today's session.
              </p>
            )}
          </div>
          <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-50">Bank Nifty</span>
              <span
                className={`text-sm font-medium ${fnoSnapshot.bankNifty.change >= 0 ? "text-up" : "text-down"}`}
              >
                {fnoSnapshot.bankNifty.change >= 0 ? "+" : ""}
                {fnoSnapshot.bankNifty.change} ({fnoSnapshot.bankNifty.changePct}%)
              </span>
            </div>
            <div className="mt-1 text-2xl font-semibold text-slate-50">
              {fnoSnapshot.bankNifty.value.toLocaleString()}
            </div>
            {fnoSnapshot.bankNifty.low != null && fnoSnapshot.bankNifty.high != null ? (
              <RangeBar
                low={fnoSnapshot.bankNifty.low}
                high={fnoSnapshot.bankNifty.high}
                value={fnoSnapshot.bankNifty.value}
                positive={fnoSnapshot.bankNifty.change >= 0}
              />
            ) : (
              <p className="mt-2 text-[10px] text-faint">
                Intraday range not independently verified for today's session.
              </p>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-faint">{fnoSnapshot.note}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-line bg-surface p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Nifty 50 — live chart
              </span>
              <a
                href="https://www.tradingview.com/symbols/NSE-NIFTY/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-faint hover:underline"
              >
                via TradingView ↗
              </a>
            </div>
            <TradingViewChart symbol="NSE:NIFTY" height={320} />
          </div>
          <div className="overflow-hidden rounded-xl border border-line bg-surface p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Bank Nifty — live chart
              </span>
              <a
                href="https://www.tradingview.com/symbols/NSE-BANKNIFTY/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-faint hover:underline"
              >
                via TradingView ↗
              </a>
            </div>
            <TradingViewChart symbol="NSE:BANKNIFTY" height={320} />
          </div>
        </div>
        <p className="mt-2 text-[10px] text-faint">
          Charts embedded live from TradingView — data timing depends on TradingView's own
          exchange licensing, not something we can verify or relabel ourselves.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Upcoming IPOs — India
            </h2>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
              As of {ASOF_DATE}
            </span>
          </div>
          <SourceLink {...ipoSource} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Open</th>
                <th className="px-4 py-3">Close</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Price / issue size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {upcomingIPOs.map((ipo) => (
                <tr key={ipo.name}>
                  <td className="px-4 py-3 font-medium text-slate-50">
                    <div className="flex items-center gap-2">
                      <BrandBadge name={ipo.name} size={24} />
                      {ipo.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        ipo.type === "Mainboard"
                          ? "bg-accent/10 text-accent"
                          : "bg-white/10 text-muted"
                      }`}
                    >
                      {ipo.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{ipo.openDate}</td>
                  <td className="px-4 py-3 text-muted">{ipo.closeDate}</td>
                  <td className="px-4 py-3 text-muted">{ipo.listingDate}</td>
                  <td className="px-4 py-3 text-muted">{ipo.issueSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Home loan rates — India
            </h2>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
              As of {ASOF_DATE}
            </span>
          </div>
          <SourceLink {...loanRatesSource} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-4 py-3">Bank</th>
                <th className="px-4 py-3">Rate from</th>
                <th className="px-4 py-3">Rate up to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {homeLoanRates.map((row) => (
                <tr key={row.bank}>
                  <td className="px-4 py-3 font-medium text-slate-50">
                    <div className="flex items-center gap-2">
                      <BrandBadge name={row.bank} size={24} />
                      {row.bank}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-up">{row.homeLoanFrom}</td>
                  <td className="px-4 py-3 text-muted">{row.homeLoanTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-faint">
          Reference rates only, not a quote — actual rate depends on credit score and loan amount.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Health insurance — India
            </h2>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
              As of {ASOF_DATE}
            </span>
          </div>
          <SourceLink {...insuranceSource} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-4 py-3">Insurer</th>
                <th className="px-4 py-3">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {healthInsurancePlans.map((row) => (
                <tr key={row.insurer}>
                  <td className="px-4 py-3 font-medium text-slate-50">
                    <div className="flex items-center gap-2">
                      <BrandBadge name={row.insurer} size={24} />
                      {row.insurer}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{row.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-faint">
          Informational only, not personalized insurance advice — see the source link for current claim-settlement ratios.
        </p>
      </section>

      {/* ---------------- Global crypto, second ---------------- */}

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
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
