import { createClient } from "@/lib/supabase/server";
import type { Board } from "@/lib/types";

// Per-coin community boards are created lazily: there is no pre-seeded row
// per coin (the tracked universe is the top 100 by market cap and pre-seeding
// all of them would mean creating discussion boards nobody has used yet).
// A board row for a coin is only created the first time someone actually
// posts in it. Looking up a coin's page/posts never creates a row - a coin
// with zero discussion simply has no board yet, which is a real, honest state.

export async function getCoinBoard(coinId: string): Promise<Board | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("boards")
    .select("*")
    .eq("coin_id", coinId)
    .maybeSingle<Board>();
  return data ?? null;
}

// Called only from the "new post" server action, i.e. only when a real,
// authenticated, rate-limited user is about to post. Race-safe: the unique
// constraint on coin_id means a concurrent double-create resolves to the
// same row via onConflict + re-select.
export async function getOrCreateCoinBoard(
  coinId: string,
  coinName: string,
  coinSymbol: string
): Promise<Board | null> {
  const existing = await getCoinBoard(coinId);
  if (existing) return existing;

  const supabase = await createClient();
  const { error } = await supabase.from("boards").upsert(
    {
      slug: coinId,
      name: `${coinName} (${coinSymbol})`,
      description: `Community discussion for ${coinName}. Not financial advice.`,
      coin_id: coinId,
    },
    { onConflict: "coin_id", ignoreDuplicates: true }
  );
  if (error) return null;

  return getCoinBoard(coinId);
}
