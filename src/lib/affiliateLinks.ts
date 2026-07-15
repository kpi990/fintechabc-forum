// ============================================================================
// Centralized outbound-link config for anything on the site that could
// become a monetized (affiliate) link later — credit cards today, and the
// same pattern is meant to extend to loans, insurance, and IPO listings on
// /markets when/if those get "Apply" or "Compare" CTAs.
//
// Every entry below is currently a plain, non-monetized link straight to the
// provider/aggregator's own real page — `isAffiliate: false` everywhere,
// because fintechabc has not joined any affiliate network or bank partner
// program yet. That requires the site owner's own application/KYC with a
// network (e.g. Admitad, vCommission, Cuelinks) or a bank's partner desk —
// not something that can be done on someone's behalf from inside a chat tool.
//
// Once a real program is joined: swap the `url` for the real tracking link
// and flip `isAffiliate` to true, here, in one place. Every "Apply"/"View"
// button that reads from this file picks up the change automatically, and
// AffiliateDisclosure.tsx will start rendering its ASCI/FTC-style disclosure
// banner on any page that has at least one `isAffiliate: true` link — this
// file is the single source of truth for "are we currently monetizing this."
// ============================================================================

export type OutboundLink = {
  label: string;
  url: string;
  isAffiliate: boolean;
};

// Keyed by CreditCard.slug (see creditCards.ts). Right now this just mirrors
// each card's sourceUrl — kept as a separate map (rather than only reading
// sourceUrl) specifically so the "Apply" link can diverge from the "read
// about it" source link once there's a real affiliate/apply link to send
// people to instead.
export const creditCardApplyLinks: Record<string, OutboundLink> = {
  "hdfc-diners-black": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/hdfc-bank/hdfc-diners-club-black-credit-card/",
    isAffiliate: false,
  },
  "axis-reserve": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/credit-card/axis-bank-reserve-credit-card/",
    isAffiliate: false,
  },
  "axis-atlas": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/axis-bank/atlas-credit-card/",
    isAffiliate: false,
  },
  "hdfc-regalia-gold": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/hdfc-bank/hdfc-regalia-gold-credit-card/",
    isAffiliate: false,
  },
  "yes-bank-paisasave": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/yes-bank/paisabazaar-paisasave-credit-card/",
    isAffiliate: false,
  },
  "sbi-cashback": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/sbi-bank/cashback-sbi-card/",
    isAffiliate: false,
  },
  "hsbc-travelone": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/hsbc-bank/travelone-credit-card/",
    isAffiliate: false,
  },
  "axis-select": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/axis-bank/select-credit-card/",
    isAffiliate: false,
  },
  "tata-neu-infinity-hdfc": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/hdfc-bank/tata-neu-infinity-hdfc-bank-credit-card/",
    isAffiliate: false,
  },
  "indianoil-rbl-xtra": {
    label: "View on Paisabazaar",
    url: "https://www.paisabazaar.com/rbl-bank/indianoil-rbl-xtra-credit-card/",
    isAffiliate: false,
  },
};

// Placeholders for the same pattern applied to /markets sections later.
// Empty until those sections actually grow "Apply"/"Compare" CTAs of their
// own — not wired into any page yet, so nothing changes by adding these.
export const loanApplyLinks: Record<string, OutboundLink> = {};
export const insuranceApplyLinks: Record<string, OutboundLink> = {};

export function hasAnyAffiliateLink(links: OutboundLink[]): boolean {
  return links.some((l) => l.isAffiliate);
}
