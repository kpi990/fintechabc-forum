import { getTopMovers } from "@/lib/market";
import HomeCryptoPoller from "@/components/HomeCryptoPoller";

// Server half: fetches the initial snapshot (no loading flash on first
// paint), then hands off to HomeCryptoPoller (client) for 30s polling -
// same split as CryptoMovers/MoversPoller, applied to the homepage teaser
// so "Top cryptos" is actually live, not just fresh-at-request-time.
export default async function HomeCryptoCard({ limit = 2 }: { limit?: number }) {
  const { gainers, losers } = await getTopMovers(limit);
  return (
    <HomeCryptoPoller initialGainers={gainers} initialLosers={losers} limit={limit} />
  );
}
