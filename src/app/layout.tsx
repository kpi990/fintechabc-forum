import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import TopNav from "@/components/TopNav";
import LogoIcon from "@/components/LogoIcon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://fintechabc.com";
const SITE_NAME = "fintechabc";
const SITE_DESCRIPTION =
  "Ask better. Build better. Compound better. Where India's financial community grows together — live global crypto prices, verified news, and India market snapshots (IPOs, F&O, loan rates, insurance).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "fintechabc — Where India's Financial Community Grows Together",
    template: "%s | fintechabc",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "crypto community",
    "India stock market",
    "Nifty",
    "Bank Nifty",
    "IPO calendar India",
    "crypto prices",
    "finance forum",
    "personal finance India",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "fintechabc — Where India's Financial Community Grows Together",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "fintechabc — Where India's Financial Community Grows Together",
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

const FOOTER_COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { href: "/markets", label: "Markets" },
      { href: "/news", label: "News" },
      { href: "/community", label: "Community" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/signup", label: "Join" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
  const year = new Date().getFullYear();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col">
          <TopNav />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>

          <footer className="border-t border-line bg-surface">
              <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="grid gap-8 sm:grid-cols-[2fr_1fr_1fr]">
                  <div>
                    <div className="flex items-center gap-2">
                      <LogoIcon size={28} />
                      <span className="text-[15px] font-semibold tracking-tight">
                        <span className="text-slate-50">fintech</span>
                        <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">abc</span>
                      </span>
                    </div>
                    <p className="mt-3 max-w-xs text-sm text-muted">
                      Ask better. Build better. Compound better. Where India&apos;s financial
                      community grows together.
                    </p>
                  </div>

                  {FOOTER_COLUMNS.map((col) => (
                    <div key={col.heading}>
                      <div className="text-xs font-semibold uppercase tracking-wide text-faint">
                        {col.heading}
                      </div>
                      <ul className="mt-3 space-y-2">
                        {col.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="text-sm text-muted transition hover:text-accent"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
                  <span>© {year} fintechabc. Not financial, investment, or insurance advice.</span>
                  <span>
                    Contact:{" "}
                    <a href="mailto:hello@fintechabc.com" className="hover:text-accent hover:underline">
                      hello@fintechabc.com
                    </a>
                  </span>
                </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
