import Link from "next/link";
import { healthInsurancePlans, insuranceSource, ASOF_DATE } from "@/lib/indiaMarkets";
import BrandBadge from "@/components/BrandBadge";

// Homepage teaser for the health insurance comparison on /markets. No
// claim-settlement-ratio numbers here by design - see indiaMarkets.ts header
// for why those were removed rather than published unverified.
export default function HomeInsuranceCard() {
  const items = healthInsurancePlans.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Health insurance plans
        </h3>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
          As of {ASOF_DATE}
        </span>
      </div>
      <div className="divide-y divide-line">
        {items.map((row) => (
          <div key={row.insurer} className="flex items-center justify-between gap-2 py-2 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <BrandBadge name={row.insurer} size={22} />
              <span className="truncate font-medium text-slate-50">{row.insurer}</span>
            </div>
            <span className="shrink-0 truncate text-muted">{row.plan}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Link href="/markets" className="text-xs font-medium text-accent hover:underline">
          View all plans →
        </Link>
        <a
          href={insuranceSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-faint hover:underline"
        >
          Live data ↗
        </a>
      </div>
      <p className="mt-2 text-[10px] text-faint">
        Informational only, not personalized insurance advice.
      </p>
    </div>
  );
}
