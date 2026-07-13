"use client";

import { useEffect, useRef, useState } from "react";
import type { CoinPrice } from "@/lib/market";

const POLL_MS = 30_000; // refresh from /api/ticker every 30s

function TickerItem({ coin }: { coin: CoinPrice }) {
  const isUp = coin.changePct24h >= 0;
  return (
    <div className="flex shrink-0 items-center gap-2 px-4 py-3">
      <span className="text-xs font-semibold text-slate-500">{coin.symbol}</span>
      <span className="text-sm font-medium text-slate-900">
        $
        {coin.price.toLocaleString(undefined, {
          minimumFractionDigits: coin.price < 1 ? 4 : 2,
          maximumFractionDigits: coin.price < 1 ? 4 : 2,
        })}
      </span>
      <span className={`text-xs font-medium ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
        {isUp ? "▲" : "▼"} {Math.abs(coin.changePct24h).toFixed(2)}%
      </span>
    </div>
  );
}

export default function TickerScroller({ initialCoins }: { initialCoins: CoinPrice[] }) {
  const [coins, setCoins] = useState(initialCoins);
  const paused = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/ticker", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.coins) && data.coins.length) {
          setCoins(data.coins);
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
  }, []);

  if (!coins.length) return null;

  // Render the row twice back-to-back so the CSS animation can loop seamlessly
  // from -0% to -50% and restart without a visible jump.
  return (
    <div
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="ticker-track flex w-max divide-x divide-slate-100 [animation-play-state:running] group-hover:[animation-play-state:paused]">
        <div className="flex divide-x divide-slate-100">
          {coins.map((coin) => (
            <TickerItem key={`a-${coin.id}`} coin={coin} />
          ))}
        </div>
        <div className="flex divide-x divide-slate-100" aria-hidden="true">
          {coins.map((coin) => (
            <TickerItem key={`b-${coin.id}`} coin={coin} />
          ))}
        </div>
      </div>
    </div>
  );
}
