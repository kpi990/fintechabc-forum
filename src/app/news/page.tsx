import type { Metadata } from "next";
import NewsFeed from "@/components/NewsFeed";

export const metadata: Metadata = {
  title: "Verified crypto & markets news",
  description:
    "Live headlines from CoinDesk, Cointelegraph, and Yahoo Finance — with source attribution and links to the original article.",
  alternates: {
    canonical: "/news",
  },
};

export default function NewsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Verified news</h1>
        <p className="mt-1 text-sm text-muted">
          Headlines pulled live from CoinDesk, Cointelegraph, and Yahoo Finance. Every card links
          straight to the original article on the publisher's site — we don't republish full
          articles, only headlines and a short excerpt.
        </p>
      </div>
      <NewsFeed limit={18} showHeader={false} />
    </div>
  );
}
