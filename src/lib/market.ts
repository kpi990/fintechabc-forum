// Live global crypto data via CoinGecko's free public API (no key required).
// This is genuinely live — unlike the India markets snapshot in indiaMarkets.ts.

export type CoinPrice = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePct24h: number;
};

const COINGECKO_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=24h";

async function fetchTopCoins(): Promise<CoinPrice[]> {
  try {
    const res = await fetch(COINGECKO_MARKETS, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data as any[]).map((c) => ({
      id: c.id,
      symbol: String(c.symbol).toUpperCase(),
      name: c.name,
      price: c.current_price,
      changePct24h: c.price_change_percentage_24h ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function getTickerCoins(): Promise<CoinPrice[]> {
  const all = await fetchTopCoins();
  const wanted = ["bitcoin", "ethereum", "solana", "tether", "ripple", "binancecoin"];
  const byId = new Map(all.map((c) => [c.id, c]));
  return wanted.map((id) => byId.get(id)).filter((c): c is CoinPrice => Boolean(c));
}

export async function getTopMovers(limit = 5): Promise<{ gainers: CoinPrice[]; losers: CoinPrice[] }> {
  const all = await fetchTopCoins();
  const sorted = [...all].sort((a, b) => b.changePct24h - a.changePct24h);
  return {
    gainers: sorted.slice(0, limit),
    losers: sorted.slice(-limit).reverse(),
  };
}
