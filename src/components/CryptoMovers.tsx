import { getTopMovers } from "@/lib/market";
import { createClient } from "@/lib/supabase/server";
import { getWatchlistCoinIds } from "@/lib/watchlist";
import MoversPoller from "@/components/MoversPoller";

// Server component: fetches the initial snapshot (no loading flash) then
// hands off to MoversPoller (client) for 30s polling - same pattern as
// MarketTicker/TickerScroller, so Top Gainers/Losers actually update live
// like the ticker strip above it, matching the "Live" badge over both.
export default async function CryptoMovers({ limit = 5 }: { limit?: number }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ gainers, losers }, watchlistIds] = await Promise.all([
    getTopMovers(limit),
    user ? getWatchlistCoinIds(user.id) : Promise.resolve([] as string[]),
  ]);

  return (
    <MoversPoller
      initialGainers={gainers}
      initialLosers={losers}
      limit={limit}
      watchlistIds={watchlistIds}
      isLoggedIn={!!user}
    />
  );
}
