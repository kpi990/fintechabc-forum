import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import CommunityStatsBar from "@/components/CommunityStatsBar";
import TrendingPosts from "@/components/TrendingPosts";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-600 to-fuchsia-500 p-8 text-white shadow-sm sm:p-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-100">
          Discuss · Share · Grow
        </p>
        <h1 className="max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
          Where India talks crypto, markets, and money.
        </h1>
        <p className="mt-3 max-w-md text-violet-100">
          Live market data, verified news, and a community built for Indian investors —
          with global crypto coverage.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-5 py-2.5 font-medium text-violet-700 shadow-sm transition hover:bg-violet-50"
          >
            Join the community
          </Link>
          <Link
            href="/markets"
            className="rounded-lg border border-white/40 px-5 py-2.5 font-medium text-white transition hover:bg-white/10"
          >
            View markets
          </Link>
        </div>
      </section>

      <section>
        <MarketTicker />
      </section>

      <section>
        <CommunityStatsBar />
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <TrendingPosts />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Latest verified news
            </h3>
            <Link href="/news" className="text-xs font-medium text-violet-600 hover:underline">
              View all →
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            Headlines from CoinDesk, Cointelegraph, and Yahoo Finance —{" "}
            <Link href="/news" className="text-violet-600 hover:underline">
              see the full feed
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Ready to join the conversation?</h2>
        <p className="mt-1 text-sm text-slate-500">
          Browse community boards on crypto, markets, and personal finance.
        </p>
        <Link
          href="/community"
          className="mt-4 inline-block rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-violet-500"
        >
          Browse boards
        </Link>
      </section>
    </div>
  );
}
