// Pulls headlines from a fixed list of reputable finance/crypto outlets via
// their public RSS feeds. We only ever show a headline + short snippet + a
// link back to the original source — never the full article text — both
// for copyright reasons and because we're not the publisher of record.

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null;
  snippet: string;
};

const FEEDS: { source: string; url: string }[] = [
  { source: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { source: "Cointelegraph", url: "https://cointelegraph.com/rss" },
  { source: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" },
];

function decodeEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : null;
}

function parseFeed(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const block of itemBlocks) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    if (!title || !link) continue;

    const rawSnippet = extractTag(block, "description") ?? "";
    items.push({
      title,
      link,
      source,
      pubDate: extractTag(block, "pubDate"),
      snippet: rawSnippet.slice(0, 160),
    });
  }

  return items;
}

export async function getVerifiedNews(limit = 6): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    FEEDS.map(async ({ source, url }) => {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; fintechabc-bot/1.0)" },
        next: { revalidate: 1800 },
      });
      if (!res.ok) return [];
      const xml = await res.text();
      return parseFeed(xml, source);
    })
  );

  const all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  all.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  return all.slice(0, limit);
}
