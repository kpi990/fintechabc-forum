import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCoinsByIds } from "@/lib/market";
import { getCoinBoard } from "@/lib/coinBoards";
import { getWatchlistCoinIds } from "@/lib/watchlist";
import Sparkline from "@/components/Sparkline";
import LiveBadge from "@/components/LiveBadge";
import WatchlistButton from "@/components/WatchlistButton";
import VoteButtons from "@/components/VoteButtons";
import Avatar from "@/components/Avatar";
import type { Post } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [coin] = await getCoinsByIds([id]);
  if (!coin) return { title: "Coin not found" };
  return {
    title: `${coin.name} (${coin.symbol}) — Price & Community`,
    description: `Live ${coin.name} price, 24h change, and community discussion on fintechabc.`,
  };
}

export default async function CoinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Only coins in the tracked top-100 universe get a page - same universe
  // already used for the ticker, movers, and watchlist picker. Not fabricating
  // pages for coins we have no real price data for.
  const [coin] = await getCoinsByIds([id]);
  if (!coin) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [board, watchlistIds] = await Promise.all([
    getCoinBoard(id),
    user ? getWatchlistCoinIds(user.id) : Promise.resolve([] as string[]),
  ]);

  let posts: Post[] = [];
  if (board) {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles(username, avatar_url)")
      .eq("board_id", board.id)
      .eq("is_removed", false)
      .order("created_at", { ascending: false });
    posts = (data as Post[] | null) ?? [];
  }

  const isUp = coin.changePct24h >= 0;
  const inWatchlist = watchlistIds.includes(id);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {coin.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coin.image} alt="" width={40} height={40} className="rounded-full" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-slate-50">{coin.name}</h1>
              <span className="text-sm text-faint">{coin.symbol}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <LiveBadge mode="live" />
              <WatchlistButton coinId={id} initialInWatchlist={inWatchlist} isLoggedIn={!!user} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Sparkline points={coin.sparkline} positive={isUp} width={100} height={32} />
          <div className="flex flex-col items-end">
            <span className="tabular text-lg font-semibold text-slate-50">
              ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className={`tabular text-sm font-medium ${isUp ? "text-up" : "text-down"}`}>
              {isUp ? "+" : ""}
              {coin.changePct24h.toFixed(2)}% (24h)
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          {coin.name} discussion
        </h2>
        <Link
          href={`/coin/${id}/new`}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-400"
        >
          New post
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <VoteButtons targetType="post" targetId={post.id} initialScore={post.score} />
            <div className="flex-1">
              <Link
                href={`/post/${post.id}`}
                className="font-medium text-slate-50 transition hover:text-accent"
              >
                {post.title}
              </Link>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-faint">
                <Avatar username={post.profiles?.username ?? "?"} />
                <span>{post.profiles?.username ?? "[deleted]"}</span>
              </div>
            </div>
          </div>
        ))}
        {!posts.length && (
          <p className="rounded-xl border border-dashed border-line-strong bg-surface p-8 text-center text-sm text-muted">
            No discussion yet for {coin.name} — be the first.
          </p>
        )}
      </div>
    </div>
  );
}
