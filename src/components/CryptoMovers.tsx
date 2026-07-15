import { getTopMovers } from "@/lib/market";
import { createClient } from "@/lib/supabase/server";
import { getWatchlistCoinIds } from "@/lib/watchlist";
import Sparkline from "@/components/Sparkline";
import WatchlistButton from "@/components/WatchlistButton";

function MoverRow({
  id,
  symbol,
  name,
  price,
  changePct24h,
  image,
  sparkline,
  isLoggedIn,
  inWatchlist,
}: {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePct24h: number;
  image: string;
  sparkline: number[];
  isLoggedIn: boolean;
  inWatchlist: boolean;
}) {
  const isUp = changePct24h >= 0;
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={20} height={20} className="shrink-0 rounded-full" />
        )}
        <div className="min-w-0">
          <div className="font-medium text-slate-50">{symbol}</div>
          <div className="truncate text-xs text-faint">{name}</div>
        </div>
      </div>
      <Sparkline points={sparkline} positive={isUp} />
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex flex-col items-end">
          <span className="tabular text-sm text-slate-200">
            ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className={`tabular text-sm font-medium ${isUp ? "text-up" : "text-down"}`}>
            {isUp ? "+" : ""}
            {changePct24h.toFixed(2)}%
          </span>
        </div>
        <WatchlistButton coinId={id} initialInWatchlist={inWatchlist} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

export default async function CryptoMovers({
  limit = 5,
  layout = "grid",
}: {
  limit?: number;
  layout?: "grid" | "stack";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ gainers, losers }, watchlistIds] = await Promise.all([
    getTopMovers(limit),
    user ? getWatchlistCoinIds(user.id) : Promise.resolve([] as string[]),
  ]);
  const watchlistSet = new Set(watchlistIds);

  const gainersCard = (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-up">
        Top gainers (24h)
      </h3>
      <div className="divide-y divide-line">
        {gainers.map((c) => (
          <MoverRow
            key={c.id}
            {...c}
            isLoggedIn={!!user}
            inWatchlist={watchlistSet.has(c.id)}
          />
        ))}
      </div>
    </div>
  );

  const losersCard = (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-down">
        Top losers (24h)
      </h3>
      <div className="divide-y divide-line">
        {losers.map((c) => (
          <MoverRow
            key={c.id}
            {...c}
            isLoggedIn={!!user}
            inWatchlist={watchlistSet.has(c.id)}
          />
        ))}
      </div>
    </div>
  );

  if (layout === "stack") {
    return (
      <div className="space-y-4">
        {gainersCard}
        {losersCard}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {gainersCard}
      {losersCard}
    </div>
  );
}
