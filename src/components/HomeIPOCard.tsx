import Link from "next/link";
import { upcomingIPOs, ipoSource, ASOF_DATE } from "@/lib/indiaMarkets";
import BrandBadge from "@/components/BrandBadge";

// Homepage teaser for the full IPO calendar on /markets - top 3 by list
// order (already earliest-first in indiaMarkets.ts), not a live feed, same
// as-of-date discipline as the rest of indiaMarkets.ts.
export default function HomeIPOCard() {
  const items = upcomingIPOs.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Upcoming IPOs
        </h3>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
          As of {ASOF_DATE}
        </span>
      </div>
      <div className="divide-y divide-line">
        {items.map((ipo) => (
          <div key={ipo.name} className="flex items-center justify-between gap-2 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <BrandBadge name={ipo.name} size={24} />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-50">{ipo.name}</div>
                <div className="text-xs text-muted">Listing {ipo.listingDate}</div>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
              {ipo.type}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Link href="/markets" className="text-xs font-medium text-accent hover:underline">
          View all IPOs →
        </Link>
        <a
          href={ipoSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-faint hover:underline"
        >
          Source ↗
        </a>
      </div>
    </div>
  );
}
