import NewsFeed from "@/components/NewsFeed";

export default function NewsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Verified news</h1>
        <p className="mt-1 text-sm text-slate-500">
          Headlines pulled live from CoinDesk, Cointelegraph, and Yahoo Finance. We link out to
          the original source rather than republishing full articles.
        </p>
      </div>
      <NewsFeed limit={18} showHeader={false} />
    </div>
  );
}
