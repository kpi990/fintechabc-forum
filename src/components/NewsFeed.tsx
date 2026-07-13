import { getVerifiedNews } from "@/lib/news";
import { formatDistanceToNowStrict } from "date-fns";

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
      <div className="grid gap-3 sm:grid-cols-2">
        {news.map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-violet-700">{item.source}</span>
              {item.pubDate && (
                <span>{formatDistanceToNowStrict(new Date(item.pubDate), { addSuffix: true })}</span>
              )}
            </div>
            <h3 className="font-medium text-slate-900 transition group-hover:text-violet-600">
              {item.title}
            </h3>
            {item.snippet && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.snippet}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
