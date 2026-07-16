import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // img-src allows any https host because verified-news thumbnails come
    // from whichever publisher's own CDN served the RSS item — that list of
    // hosts is unbounded by design, so we can't allowlist it up front.
    // Every other directive is locked to same-origin, plus the specific
    // third-party hosts each integration actually needs: TradingView (chart
    // widget) and Google AdSense/ad-serving infra (site verification now,
    // ad units once approved). AdSense's own serving infrastructure spans
    // many googlesyndication.com/doubleclick.net/google.com subdomains that
    // aren't practical to enumerate individually, so those three are
    // wildcarded per Google's own CSP guidance rather than listed exactly.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://s3.tradingview.com https://*.googlesyndication.com https://*.doubleclick.net https://*.googleadservices.com https://*.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.coingecko.com https://*.supabase.co https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
      "frame-src https://s.tradingview.com https://www.tradingview.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withBotId(nextConfig);
