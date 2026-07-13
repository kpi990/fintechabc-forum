import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fintechabc — crypto & finance community",
  description: "Discussion community for crypto and financial markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-sm font-semibold text-slate-900">fintechabc</div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                <Link href="/markets" className="hover:text-violet-600">Markets</Link>
                <Link href="/news" className="hover:text-violet-600">News</Link>
                <Link href="/community" className="hover:text-violet-600">Community</Link>
                <Link href="/about" className="hover:text-violet-600">About</Link>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">
              fintechabc — community discussion and general market information. Not financial,
              investment, or insurance advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
