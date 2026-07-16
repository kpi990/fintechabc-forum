import Link from "next/link";
import { getTopMovers } from "@/lib/market";
import LiveBadge from "@/components/LiveBadge";

// Homepage teaser for the full Top Gainers/Losers section on /markets and
// the homepage's own "Global crypto" section further down - compact
// 2-up-per-column snapshot, genuinely live (CoinGecko, revalidate 120s via
// getTopMovers -> market.ts), just not polled client-side like the full
// MoversPoller widget since this card is a teaser, not the primary view.
export default async function HomeCryptoCard({ limit = 2 }: { limit?: number }) {
  const { gainers, losers } = await getTopMovers(limit);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Top cryptos</h3>
        <LiveBadge mode="live" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-up">
            Gainers
          </div>
          <div className="space-y-1.5">
            {gainers.map((c) => (
              <Link
                key={c.id}
                href={`/coin/${c.id}`}
                className="flex items-center justify-between gap-1 text-sm transition hover:text-accent"
              >
                <span className="truncate font-medium text-slate-50">{c.symbol}</span>
                <span className="shrink-0 text-xs font-medium text-up">
                  +{c.changePct24h.toFixed(1)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-down">
            Losers
          </div>
          <div className="space-y-1.5">
            {losers.map((c) => (
              <Link
                key={c.id}
                href={`/coin/${c.id}`}
                className="flex items-center justify-between gap-1 text-sm transition hover:text-accent"
              >
                <span className="truncate font-medium text-slate-50">{c.symbol}</span>
                <span className="shrink-0 text-xs font-medium text-down">
                  {c.changePct24h.toFixed(1)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link href="/markets" className="mt-3 block text-xs font-medium text-accent hover:underline">
        View all crypto →
      </Link>
    </div>
  );
}
