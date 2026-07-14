import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileTopBar from "@/components/MobileTopBar";

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
  "A community for crypto and financial markets discussion — live global crypto prices, verified news, and India market snapshots (IPOs, F&O, loan rates, insurance), built for Indian investors.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "fintechabc — crypto & finance community",
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
    title: "fintechabc — crypto & finance community",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "fintechabc — crypto & finance community",
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

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
      <body className="min-h-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <MobileTopBar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>
            <footer className="border-t border-slate-200 bg-white">
              <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="text-sm font-semibold text-slate-900">fintechabc</div>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500"><Link href="/markets" className="hover:text-violet-600">Markets</Link><Link href="/news" className="hover:text-violet-600">News</Link><Link href="/community" className="hover:text-violet-600">Community</Link><Link href="/about" className="hover:text-violet-600">About</Link></div>
                </div>
                <p className="mt-4 text-center text-xs text-slate-400">
                  fintechabc — community discussion and general market information. Not financial,
                  investment, or insurance advice.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
