import { getVerifiedNews } from "@/lib/news";
import { formatDistanceToNowStrict } from "date-fns";
import BrandBadge from "@/components/BrandBadge";

const SOURCE_DOMAIN: Record<string, string> = {
  CoinDesk: "coindesk.com",
  Cointelegraph: "cointelegraph.com",
  "Yahoo Finance": "finance.yahoo.com",
};

export default async function NewsFeed({
  limit = 6,
  showHeader = true,
}: {
  limit?: number;
  showHeader?: boolean;
}) {
  const news = await getVerifiedNews(limit);
  if (!news.length) return null;

  return (
    <div className="mb-8">
      {showHeader && (
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Verified news
          </h2>
          <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20">
            Live feed
          </span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50">
                  <BrandBadge name={item.source} size={40} />
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm backdrop-blur">
                {item.source}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-medium leading-snug text-slate-900 transition group-hover:text-violet-600">
                {item.title}
              </h3>
              {item.snippet && (
                <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{item.snippet}</p>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <BrandBadge name={item.source} size={16} />
                  <span className="font-medium text-slate-600">
                    {SOURCE_DOMAIN[item.source] ?? item.source}
                  </span>
                </span>
                {item.pubDate && (
                  <span>{formatDistanceToNowStrict(new Date(item.pubDate), { addSuffix: true })}</span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
