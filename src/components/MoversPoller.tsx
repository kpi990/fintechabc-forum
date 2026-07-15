"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CoinPrice } from "@/lib/market";
import Sparkline from "@/components/Sparkline";
import WatchlistButton from "@/components/WatchlistButton";

const POLL_MS = 30_000;

function MoverRow({
  coin,
  isLoggedIn,
  inWatchlist,
}: {
  coin: CoinPrice;
  isLoggedIn: boolean;
  inWatchlist: boolean;
}) {
  const isUp = coin.changePct24h >= 0;
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        {coin.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coin.image} alt="" width={20} height={20} className="shrink-0 rounded-full" />
        )}
        <Link href={`/coin/${coin.id}`} className="min-w-0 transition hover:text-accent">
          <div className="font-medium text-slate-50">{coin.symbol}</div>
          <div className="truncate text-xs text-faint">{coin.name}</div>
        </Link>
      </div>
      <Sparkline points={coin.sparkline} positive={isUp} />
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex flex-col items-end">
          <span className="tabular text-sm text-slate-200">
            ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className={`tabular text-sm font-medium ${isUp ? "text-up" : "text-down"}`}>
            {isUp ? "+" : ""}
            {coin.changePct24h.toFixed(2)}%
          </span>
        </div>
        <WatchlistButton coinId={coin.id} initialInWatchlist={inWatchlist} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

// Client half of CryptoMovers: takes the server-fetched initial snapshot (so
// there's no loading flash on first paint) and polls /api/movers every 30s
// after that, same interval as TickerScroller. watchlistIds/isLoggedIn are
// captured once at page load and passed down unchanged - WatchlistButton
// keeps its own toggle state internally, so re-polled price data never
// clobbers a watchlist add/remove the user just made.
export default function MoversPoller({
  initialGainers,
  initialLosers,
  limit,
  watchlistIds,
  isLoggedIn,
}: {
  initialGainers: CoinPrice[];
  initialLosers: CoinPrice[];
  limit: number;
  watchlistIds: string[];
  isLoggedIn: boolean;
}) {
  const [gainers, setGainers] = useState(initialGainers);
  const [losers, setLosers] = useState(initialLosers);
  const watchlistSet = new Set(watchlistIds);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/movers?limit=${limit}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          if (Array.isArray(data.gainers)) setGainers(data.gainers);
          if (Array.isArray(data.losers)) setLosers(data.losers);
        }
      } catch {
        // silent — keep showing the last good values until the next poll succeeds
      }
    }

    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [limit]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-up">
          Top gainers (24h)
        </h3>
        <div className="divide-y divide-line">
          {gainers.map((c) => (
            <MoverRow key={c.id} coin={c} isLoggedIn={isLoggedIn} inWatchlist={watchlistSet.has(c.id)} />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-down">
          Top losers (24h)
        </h3>
        <div className="divide-y divide-line">
          {losers.map((c) => (
            <MoverRow key={c.id} coin={c} isLoggedIn={isLoggedIn} inWatchlist={watchlistSet.has(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
