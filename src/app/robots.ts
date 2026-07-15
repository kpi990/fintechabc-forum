import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api/ is data plumbing, not content. /admin, /login, /signup, and
      // /auth/ are private/auth surfaces with no SEO value — kept out of the
      // index as defense-in-depth alongside the noindex meta tag already on
      // /admin and the auth checks that gate it server-side either way.
      // Note: robots.txt is advisory only — well-behaved crawlers (Google,
      // Bing) respect it, but it does not stop scrapers or bots that ignore
      // it. That enforcement comes from BotID + auth/RLS, not this file.
      disallow: ["/api/", "/admin", "/login", "/signup", "/auth/"],
    },
    sitemap: "https://fintechabc.com/sitemap.xml",
  };
}
