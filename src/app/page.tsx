import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import CommunityStatsBar from "@/components/CommunityStatsBar";
import TrendingPosts from "@/components/TrendingPosts";
import CryptoMovers from "@/components/CryptoMovers";
import IndiaSnapshotCard from "@/components/IndiaSnapshotCard";
import NewsFeed from "@/components/NewsFeed";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-600 to-fuchsia-500 p-6 text-white shadow-sm sm:p-7">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-100">
          Discuss · Share · Grow
        </p>
        <h1 className="max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
          Where India talks crypto, markets, and money.
        </h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-violet-700 shadow-sm transition hover:bg-violet-50"
          >
            Join the community
          </Link>
          <Link
            href="/markets"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            View markets
          </Link>
          <Link
            href="/community"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Browse boards
          </Link>
        </div>
      </section>

      {/* India first: snapshot up top, before global crypto */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            India markets
          </h2>
        </div>
        <IndiaSnapshotCard />
      </section>

      {/* Global crypto, second */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Global crypto — live
          </h2>
        </div>
        <MarketTicker />
        <a
          href="https://www.coingecko.com/en/api"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-block text-xs text-slate-400 hover:underline"
        >
          Source: CoinGecko (live) ↗
        </a>
      </section>

      {/* Core of the product: real community discussions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TrendingPosts />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Latest verified news
              </h3>
              <Link href="/news" className="text-xs font-medium text-violet-600 hover:underline">
                View all →
              </Link>
            </div>
            <NewsFeed limit={3} showHeader={false} />
          </div>

          <CryptoMovers limit={4} />
        </div>

        <div className="space-y-6">
          <CommunityStatsBar compact />
        </div>
      </div>
    </div>
  );
}
