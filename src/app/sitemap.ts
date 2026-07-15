import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://fintechabc.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/markets`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/news`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/community`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    // /login and /signup are intentionally excluded: they're disallowed in
    // robots.txt (no SEO value, private/auth surfaces) - listing a
    // disallowed URL in the sitemap is a contradictory signal to crawlers.
  ];

  try {
    const supabase = await createClient();
    const { data: boards } = await supabase.from("boards").select("slug, coin_id");

    // Coin-linked boards redirect board/[slug] -> coin/[id] (single canonical
    // URL for that content), so the sitemap should point straight at the
    // coin page rather than at a URL that immediately 307s away.
    const boardRoutes: MetadataRoute.Sitemap = (boards ?? [])
      .filter((b) => !b.coin_id)
      .map((b) => ({
        url: `${SITE_URL}/board/${b.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));

    const coinBoardRoutes: MetadataRoute.Sitemap = (boards ?? [])
      .filter((b): b is { slug: string; coin_id: string } => Boolean(b.coin_id))
      .map((b) => ({
        url: `${SITE_URL}/coin/${b.coin_id}`,
        changeFrequency: "hourly" as const,
        priority: 0.7,
      }));

    const { data: posts } = await supabase
      .from("posts")
      .select("id, created_at")
      .eq("is_removed", false)
      .order("created_at", { ascending: false })
      .limit(200);
    const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
      url: `${SITE_URL}/post/${p.id}`,
      lastModified: p.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...boardRoutes, ...coinBoardRoutes, ...postRoutes];
  } catch {
    // if Supabase is unreachable at build/request time, still serve the static routes
    return staticRoutes;
  }
}
