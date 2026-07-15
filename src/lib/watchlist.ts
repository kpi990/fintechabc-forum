import { createClient } from "@/lib/supabase/server";
import { getCoinsByIds, type CoinPrice } from "@/lib/market";

export async function getWatchlistCoinIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlist_items")
    .select("coin_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((row) => row.coin_id);
}

export async function getWatchlistCoins(userId: string): Promise<CoinPrice[]> {
  const ids = await getWatchlistCoinIds(userId);
  return getCoinsByIds(ids);
}
