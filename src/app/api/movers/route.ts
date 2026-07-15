import { NextResponse } from "next/server";
import { getTopMovers } from "@/lib/market";

// Polled by the client-side movers list (see MoversPoller.tsx) so Top
// Gainers/Losers refresh in place, same as the ticker strip - keeps the
// "Live" badge over this whole section honest instead of only covering the
// ticker. Same 2-minute upstream CoinGecko cache as everything else in
// market.ts; this just exposes a lightweight endpoint for the client interval.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(10, Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10) || 5));
  const { gainers, losers } = await getTopMovers(limit);
  return NextResponse.json({ gainers, losers, fetchedAt: new Date().toISOString() });
}
