import type { Metadata } from "next";
import BrandBadge from "@/components/BrandBadge";
import CardAdvisorChat from "@/components/CardAdvisorChat";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import {
  CREDIT_CARDS_ASOF_DATE,
  creditCards,
  creditCardsSource,
  howToChoose,
  howToApplySteps,
  type CreditCardCategory,
} from "@/lib/creditCards";
import { creditCardApplyLinks } from "@/lib/affiliateLinks";

export const metadata: Metadata = {
  title: "Credit Cards — Compare fees, benefits & how to apply",
  description:
    "Compare 10 popular Indian credit cards — travel, cashback, shopping, and fuel — with joining/annual fees, key benefits, and links to each issuer's official page.",
  alternates: {
    canonical: "/credit-cards",
  },
};

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
    >
      Source: {label} ↗
    </a>
  );
}

const CATEGORIES: CreditCardCategory[] = [
  "Premium & Travel",
  "Cashback",
  "Shopping & Lifestyle",
  "Fuel",
];

export default function CreditCardsPage() {
  const allApplyLinks = Object.values(creditCardApplyLinks);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Credit cards</h1>
        <p className="mt-1 text-sm text-muted">
          A snapshot comparison of 10 popular Indian credit cards, grouped by what they're best
          for — not a live feed, and not personalized advice. Every card links to the issuer's own
          page for current terms.
        </p>
      </div>

      <AffiliateDisclosure links={allApplyLinks} />

      <CardAdvisorChat />

      <div className="flex items-center gap-2">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
          As of {CREDIT_CARDS_ASOF_DATE}
        </span>
        <SourceLink {...creditCardsSource} />
      </div>

      {CATEGORIES.map((category) => {
        const cards = creditCards.filter((c) => c.category === category);
        if (!cards.length) return null;
        return (
          <section key={category}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => {
                const applyLink = creditCardApplyLinks[card.slug];
                return (
                  <div
                    key={card.slug}
                    className="flex flex-col rounded-xl border border-line bg-surface p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <BrandBadge name={card.issuer} size={28} />
                      <div>
                        <div className="font-medium leading-tight text-slate-50">{card.name}</div>
                        <div className="text-xs text-faint">{card.issuer}</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-white/5 px-2.5 py-2">
                        <div className="text-faint">Joining fee</div>
                        <div className="mt-0.5 font-medium text-slate-50">{card.joiningFee}</div>
                      </div>
                      <div className="rounded-lg bg-white/5 px-2.5 py-2">
                        <div className="text-faint">Annual fee</div>
                        <div className="mt-0.5 font-medium text-slate-50">{card.annualFee}</div>
                      </div>
                    </div>

                    <ul className="mt-3 flex-1 space-y-1.5 text-xs text-muted">
                      {card.benefits.map((b) => (
                        <li key={b} className="flex gap-1.5">
                          <span className="text-accent">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={applyLink?.url ?? card.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-violet-400"
                    >
                      {applyLink?.label ?? "View details"} ↗
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          How to choose
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {howToChoose.map((item) => (
            <div key={item.title} className="rounded-xl border border-line bg-surface p-4 shadow-sm">
              <div className="font-medium text-slate-50">{item.title}</div>
              <p className="mt-1.5 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          How to apply
        </h2>
        <ol className="space-y-2 rounded-xl border border-line bg-surface p-4 shadow-sm">
          {howToApplySteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-muted">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-faint">
          Informational only, not personalized financial advice — eligibility, fees, and terms are
          set by each issuer and can change; confirm current details on their page before applying.
        </p>
      </section>
    </div>
  );
}
