import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What fintechabc is, what you'll find here, and how to reach us.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          About fintechabc
        </h1>
        <p className="mt-2 text-muted">
          Ask better. Build better. Compound better. fintechabc is where India&apos;s financial
          community grows together — built for Indian investors first, with global crypto
          coverage from day one.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
        <h2 className="mb-2 font-medium text-slate-50">What you'll find here</h2>
        <ul className="space-y-1.5 text-sm text-muted">
          <li>Live global crypto prices and 24h top gainers/losers</li>
          <li>Verified news from CoinDesk, Cointelegraph, and Yahoo Finance</li>
          <li>India market snapshots — Nifty/Bank Nifty, upcoming IPOs, loan rates, insurance</li>
          <li>Community boards to discuss it all with other members</li>
        </ul>
      </div>

      <div className="rounded-xl border border-warn/30 bg-warn/10 p-5">
        <h2 className="mb-2 font-medium text-warn">Not financial advice</h2>
        <p className="text-sm text-warn">
          Content on fintechabc — including market data, news, and community posts — is for
          general information and discussion only. It is not personalized investment, loan, or
          insurance advice. Always do your own research and consult a licensed professional
          before making financial decisions.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
        <h2 className="mb-2 font-medium text-slate-50">Contact</h2>
        <p className="text-sm text-muted">
          Questions or feedback? Reach out at{" "}
          <a href="mailto:hello@fintechabc.com" className="text-accent hover:underline">
            hello@fintechabc.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
