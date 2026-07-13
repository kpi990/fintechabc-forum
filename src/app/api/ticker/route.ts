import { NextResponse } from "next/server";
import { getTickerCoins } from "@/lib/market";

// Polled by the client-side ticker scroller so the strip can refresh without a full
// page reload. getTickerCoins()/CoinGecko is still capped to a 2-minute upstream
// refresh (see market.ts), this just gives the client a lightweight JSON endpoint
// to poll on its own short interval.
export async function GET() {
  const coins = await getTickerCoins();
  return NextResponse.json({ coins, fetchedAt: new Date().toISOString() });
}
