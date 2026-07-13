import { getTickerCoins } from "@/lib/market";
import TickerScroller from "@/components/TickerScroller";

// Server component: fetches the initial snapshot so the ticker renders
// immediately with data (no client-side loading flash), then hands off to
// TickerScroller (client component) for the auto-scroll animation + polling.
export default async function MarketTicker() {
  const coins = await getTickerCoins();
  return <TickerScroller initialCoins={coins} />;
}
