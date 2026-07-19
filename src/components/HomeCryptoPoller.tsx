"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CoinPrice } from "@/lib/market";
import LiveBadge from "@/components/LiveBadge";

const POLL_MS = 30_000;

function CryptoColumn({
  label,
  coins,
  positive,
}: {
  label: string;
  coins: CoinPrice[];
  positive: boolean;
}) {
  return (
    <div>
      <div
        className={`mb-1 text-[10px] font-semibold uppercase tracking-wide ${positive ? "text-up" : "text-down"}`}
      >
        {label}
      </div>
      <div className="space-y-1.5">
        {coins.map((c) => (
          <Link
            key={c.id}
            href={`/coin/${c.id}`}
            className="flex items-center justify-between gap-1 text-sm transition hover:text-accent"
          >
            <span className="truncate font-medium text-slate-50">{c.symbol}</span>
            <span className={`shrink-0 text-xs font-medium ${positive ? "text-up" : "text-down"}`}>
              {positive ? "+" : ""}
              {c.changePct24h.toFixed(1)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Client half of HomeCryptoCard - same 30s-poll pattern as MoversPoller, so
// the homepage teaser is genuinely live (not just fresh-at-page-load) like
// every other crypto surface on the site. Hits the same /api/movers route,
// which sits behind market.ts's shared 120s upstream CoinGecko cache, so
// polling here doesn't add extra load on CoinGecko's rate limit.
export default function HomeCryptoPoller({
  initialGainers,
  initialLosers,
  limit,
}: {
  initialGainers: CoinPrice[];
  initialLosers: CoinPrice[];
  limit: number;
}) {
  const [gainers, setGainers] = useState(initialGainers);
  const [losers, setLosers] = useState(initialLosers);

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
        // silent - keep showing the last good values until the next poll succeeds
      }
    }

    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [limit]);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Top cryptos</h3>
        <LiveBadge mode="live" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <CryptoColumn label="Gainers" coins={gainers} positive />
        <CryptoColumn label="Losers" coins={losers} positive={false} />
      </div>
      <Link href="/markets" className="mt-3 block text-xs font-medium text-accent hover:underline">
        View all crypto →
      </Link>
    </div>
  );
}
