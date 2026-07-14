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
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/signup`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const supabase = await createClient();
    const { data: boards } = await supabase.from("boards").select("slug");
    const boardRoutes: MetadataRoute.Sitemap = (boards ?? []).map((b) => ({
      url: `${SITE_URL}/board/${b.slug}`,
      changeFrequency: "daily" as const,
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

    return [...staticRoutes, ...boardRoutes, ...postRoutes];
  } catch {
    // if Supabase is unreachable at build/request time, still serve the static routes
    return staticRoutes;
  }
}
