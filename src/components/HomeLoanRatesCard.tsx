import Link from "next/link";
import { homeLoanRates, loanRatesSource, ASOF_DATE } from "@/lib/indiaMarkets";
import BrandBadge from "@/components/BrandBadge";

// Homepage teaser for the home loan rate comparison on /markets - reference
// rates only (see indiaMarkets.ts header), not a quote.
export default function HomeLoanRatesCard() {
  const items = homeLoanRates.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Home loan rates
        </h3>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
          As of {ASOF_DATE}
        </span>
      </div>
      <div className="divide-y divide-line">
        {items.map((row) => (
          <div key={row.bank} className="flex items-center justify-between gap-2 py-2 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <BrandBadge name={row.bank} size={22} />
              <span className="truncate font-medium text-slate-50">{row.bank}</span>
            </div>
            <span className="shrink-0 text-up">{row.homeLoanFrom}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Link href="/markets" className="text-xs font-medium text-accent hover:underline">
          Compare all loans →
        </Link>
        <a
          href={loanRatesSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-faint hover:underline"
        >
          Source ↗
        </a>
      </div>
      <p className="mt-2 text-[10px] text-faint">
        Reference rates only, not a quote — actual rate depends on credit score and loan amount.
      </p>
    </div>
  );
}
