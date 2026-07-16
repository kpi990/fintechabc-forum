import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import CommunityStatsBar from "@/components/CommunityStatsBar";
import TrendingPosts from "@/components/TrendingPosts";
import CryptoMovers from "@/components/CryptoMovers";
import IndiaSnapshotCard from "@/components/IndiaSnapshotCard";
import HomeIPOCard from "@/components/HomeIPOCard";
import HomeCryptoCard from "@/components/HomeCryptoCard";
import HomeLoanRatesCard from "@/components/HomeLoanRatesCard";
import HomeInsuranceCard from "@/components/HomeInsuranceCard";
import NewsFeed from "@/components/NewsFeed";
import LiveBadge from "@/components/LiveBadge";
import WatchlistCard from "@/components/WatchlistCard";

export default function HomePage() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-line bg-gradient-to-br from-violet-600 to-fuchsia-500 p-6 text-white shadow-sm sm:p-7">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-100">
          Ask Better. Build Better. Compound Better.
        </p>
        <h1 className="max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
          Where India&apos;s Financial Community Grows Together.
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

      {/* At a glance: IPOs, today's trade, top cryptos, loan rates, insurance
          and (for signed-in users) their watchlist - one 3x2 dashboard grid
          so the highest-value data on the site is visible without a click.
          Each card teasers real data already backing /markets, no
          fabricated numbers. grid-cols-1 base is required here (see the
          site-wide mobile-overflow fix) - relying only on a breakpoint-
          prefixed grid-cols-N lets the implicit auto track blow out on
          narrow screens. */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            At a glance
          </h2>
          <Link href="/markets" className="text-xs font-medium text-accent hover:underline">
            Full markets data →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <HomeIPOCard />
          <IndiaSnapshotCard />
          <HomeCryptoCard />
          <HomeLoanRatesCard />
          <HomeInsuranceCard />
          <WatchlistCard />
        </div>
      </div>

      {/* Core of the product: community + news + global crypto, full width
          now that the market-data teasers live in the grid above (avoids
          duplicating IPO/Nifty content in a side rail). */}
      <div className="space-y-5">
        <TrendingPosts />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Latest verified news
            </h3>
            <Link href="/news" className="text-xs font-medium text-accent hover:underline">
              View all →
            </Link>
          </div>
          <NewsFeed limit={3} showHeader={false} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Global crypto
              </h3>
              <LiveBadge mode="live" />
            </div>
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-faint hover:underline"
            >
              Source: CoinGecko ↗
            </a>
          </div>
          <MarketTicker />
          <div className="mt-4">
            <CryptoMovers limit={4} />
          </div>
        </div>

        <CommunityStatsBar />
      </div>
    </div>
  );
}
