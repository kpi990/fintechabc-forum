"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkLimit } from "@/lib/rateLimit";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

export async function addToWatchlist(coinId: string) {
  const ctx = await requireUser();
  if (!ctx) return { error: "Sign in to build a watchlist." };
  if (!checkLimit(`watchlist:${ctx.user.id}`, 30, 60 * 1000)) {
    return { error: "Too many changes. Try again in a minute." };
  }
  const { error } = await ctx.supabase
    .from("watchlist_items")
    .insert({ user_id: ctx.user.id, coin_id: coinId });
  if (error && error.code !== "23505") {
    // 23505 = unique violation (already watchlisted) - not a real error to surface
    return { error: "Couldn't add that to your watchlist." };
  }
  revalidatePath("/");
  return { success: true };
}

export async function removeFromWatchlist(coinId: string) {
  const ctx = await requireUser();
  if (!ctx) return { error: "Sign in to build a watchlist." };
  if (!checkLimit(`watchlist:${ctx.user.id}`, 30, 60 * 1000)) {
    return { error: "Too many changes. Try again in a minute." };
  }
  await ctx.supabase
    .from("watchlist_items")
    .delete()
    .eq("user_id", ctx.user.id)
    .eq("coin_id", coinId);
  revalidatePath("/");
  return { success: true };
}
