import Link from "next/link";
import { upcomingIPOs, ipoSource } from "@/lib/indiaMarkets";
import BrandBadge from "@/components/BrandBadge";

// Compact sidebar widget — just the single nearest IPO, not the full calendar.
export default function NextIPOCard() {
  const next = upcomingIPOs[0];
  if (!next) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Next IPO
        </h3>
        <a
          href={ipoSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:underline"
        >
          Source ↗
        </a>
      </div>
      <div className="flex items-center gap-2.5">
        <BrandBadge name={next.name} size={32} />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-slate-900">{next.name}</div>
          <div className="text-xs text-slate-500">
            Listing {next.listingDate} · {next.issueSize}
          </div>
        </div>
      </div>
      <Link href="/markets" className="mt-3 block text-xs font-medium text-violet-600 hover:underline">
        Full IPO calendar →
      </Link>
    </div>
  );
}
