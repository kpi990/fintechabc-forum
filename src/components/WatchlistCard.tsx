import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getWatchlistCoinIds, getWatchlistCoins } from "@/lib/watchlist";
import { getAllTrackedCoins } from "@/lib/market";
import WatchlistButton from "@/components/WatchlistButton";
import WatchlistAddPicker from "@/components/WatchlistAddPicker";
import LiveBadge from "@/components/LiveBadge";

const SUGGESTED = ["bitcoin", "ethereum", "solana"];

export default async function WatchlistCard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
        <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
          Watchlist
        </h3>
        <p className="mb-3 text-sm text-slate-200">
          Sign in to track your favorite coins and see them move every time you open the app.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-400"
        >
          Get started
        </Link>
      </div>
    );
  }

  const [watchlistIds, allCoins] = await Promise.all([
    getWatchlistCoinIds(user.id),
    getAllTrackedCoins(),
  ]);
  const watchlistSet = new Set(watchlistIds);
  const coins = await getWatchlistCoins(user.id);
  const addOptions = allCoins
    .filter((c) => !watchlistSet.has(c.id))
    .slice(0, 40)
    .map((c) => ({ id: c.id, symbol: c.symbol, name: c.name }));

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Watchlist</h3>
        {coins.length > 0 && <LiveBadge mode="live" />}
      </div>

      {coins.length === 0 ? (
        <div>
          <p className="mb-2 text-sm text-slate-200">
            Nothing tracked yet — add a coin to see it move every time you open the app.
          </p>
          <div className="space-y-1.5">
            {SUGGESTED.map((id) => {
              const coin = allCoins.find((c) => c.id === id);
              if (!coin) return null;
              return (
                <div key={id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">
                    {coin.symbol} · {coin.name}
                  </span>
                  <WatchlistButton coinId={id} initialInWatchlist={false} isLoggedIn />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {coins.map((c) => {
            const isUp = c.changePct24h >= 0;
            return (
              <div key={c.id} className="flex items-center justify-between gap-2 py-2">
                <Link
                  href={`/coin/${c.id}`}
                  className="flex min-w-0 items-center gap-2 transition hover:text-accent"
                >
                  {c.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt="" width={18} height={18} className="shrink-0 rounded-full" />
                  )}
                  <span className="truncate text-sm font-medium text-slate-50">{c.symbol}</span>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="tabular text-sm text-slate-200">
                    ${c.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span className={`tabular text-xs font-medium ${isUp ? "text-up" : "text-down"}`}>
                    {isUp ? "+" : ""}
                    {c.changePct24h.toFixed(2)}%
                  </span>
                  <WatchlistButton coinId={c.id} initialInWatchlist isLoggedIn />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <WatchlistAddPicker options={addOptions} />
    </div>
  );
}
