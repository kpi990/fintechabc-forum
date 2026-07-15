// Curated India credit-card comparison data, sourced from Paisabazaar's
// "Compare Top 10 Credit Cards in India" page (re-verified 15 July 2026 —
// see CREDIT_CARDS_ASOF_DATE). Same discipline as indiaMarkets.ts: this is a
// snapshot, not a live feed (no free, publicly redistributable real-time API
// exists for Indian bank card fees/benefits), every card links to its real
// source, and every fee/benefit figure below is taken directly from that
// source rather than estimated or rounded for effect.
//
// Fees are shown as quoted by the source, i.e. "+ Taxes" — GST (currently
// 18%) applies on top of the joining/annual fee banks charge, same as any
// other financial product in India. We show the base fee as quoted rather
// than pre-computing a tax-inclusive number we haven't independently verified.

export type SourceLink = { label: string; url: string };

export const CREDIT_CARDS_ASOF_DATE = "15 July 2026";

export const creditCardsSource: SourceLink = {
  label: "Paisabazaar — Compare Top 10 Credit Cards in India",
  url: "https://www.paisabazaar.com/credit-card/25-best-credit-cards-india/",
};

export type CreditCardCategory =
  | "Premium & Travel"
  | "Cashback"
  | "Shopping & Lifestyle"
  | "Fuel";

export type CreditCard = {
  slug: string;
  name: string;
  issuer: string;
  category: CreditCardCategory;
  joiningFee: string;
  annualFee: string;
  benefits: string[];
  sourceUrl: string;
};

export const creditCards: CreditCard[] = [
  {
    slug: "hdfc-diners-black",
    name: "HDFC Diners Club Black Metal Edition",
    issuer: "HDFC Bank",
    category: "Premium & Travel",
    joiningFee: "₹10,000 + Taxes",
    annualFee: "₹10,000 + Taxes",
    benefits: [
      "3.33% value-back across all spends",
      "Unlimited domestic and international airport lounge visits",
      "Complimentary memberships to Marriott Bonvoy, Amazon Prime & more",
    ],
    sourceUrl: "https://www.paisabazaar.com/hdfc-bank/hdfc-diners-club-black-credit-card/",
  },
  {
    slug: "axis-reserve",
    name: "Axis Bank Reserve",
    issuer: "Axis Bank",
    category: "Premium & Travel",
    joiningFee: "₹50,000 + Taxes",
    annualFee: "₹50,000 + Taxes",
    benefits: [
      "Low 1.5% foreign currency markup fee",
      "Unlimited lounge access in India and abroad",
      "15 EDGE reward points for every ₹200 spent",
    ],
    sourceUrl: "https://www.paisabazaar.com/credit-card/axis-bank-reserve-credit-card/",
  },
  {
    slug: "axis-atlas",
    name: "Axis Atlas",
    issuer: "Axis Bank",
    category: "Premium & Travel",
    joiningFee: "₹5,000 + Taxes",
    annualFee: "₹5,000 + Taxes",
    benefits: [
      "Up to 10% value-back on travel spends",
      "Complimentary lounge access worldwide",
      "1:2 redemption ratio on partner airlines & hotels",
    ],
    sourceUrl: "https://www.paisabazaar.com/axis-bank/atlas-credit-card/",
  },
  {
    slug: "hdfc-regalia-gold",
    name: "HDFC Regalia Gold",
    issuer: "HDFC Bank",
    category: "Shopping & Lifestyle",
    joiningFee: "₹2,500 + Taxes",
    annualFee: "₹2,500 + Taxes",
    benefits: [
      "5X reward points on Nykaa, Myntra & more",
      "Vouchers worth up to ₹16,000 every year",
      "12 domestic + 6 international lounge visits per year",
    ],
    sourceUrl: "https://www.paisabazaar.com/hdfc-bank/hdfc-regalia-gold-credit-card/",
  },
  {
    slug: "yes-bank-paisasave",
    name: "YES BANK PaisaSave",
    issuer: "YES Bank",
    category: "Cashback",
    joiningFee: "₹0 + Taxes (free for a limited time)",
    annualFee: "₹0 + Taxes (free for a limited time)",
    benefits: [
      "6% cashback across all travel spends",
      "6% cashback on all dining spends",
      "1% unlimited cashback on UPI transactions",
    ],
    sourceUrl: "https://www.paisabazaar.com/yes-bank/paisabazaar-paisasave-credit-card/",
  },
  {
    slug: "sbi-cashback",
    name: "Cashback SBI Card",
    issuer: "SBI Card",
    category: "Cashback",
    joiningFee: "₹999 + Taxes",
    annualFee: "₹999 + Taxes",
    benefits: [
      "5% cashback on online spends",
      "Up to ₹48,000 cashback in a year",
      "Annual fee waived on ₹2 lakh+ spends in a year",
    ],
    sourceUrl: "https://www.paisabazaar.com/sbi-bank/cashback-sbi-card/",
  },
  {
    slug: "hsbc-travelone",
    name: "HSBC TravelOne",
    issuer: "HSBC Bank",
    category: "Premium & Travel",
    joiningFee: "₹4,999 + Taxes",
    annualFee: "₹4,999 + Taxes",
    benefits: [
      "Up to 15% off on top travel booking platforms",
      "Up to 12% back as reward points",
      "6 domestic + 4 international lounge visits",
    ],
    sourceUrl: "https://www.paisabazaar.com/hsbc-bank/travelone-credit-card/",
  },
  {
    slug: "axis-select",
    name: "Axis Bank SELECT",
    issuer: "Axis Bank",
    category: "Shopping & Lifestyle",
    joiningFee: "₹3,000 + Taxes",
    annualFee: "₹3,000 + Taxes",
    benefits: [
      "Discounts on Swiggy, BigBasket & District app orders",
      "Complimentary lounge access worldwide",
      "2X reward points across all retail spends",
    ],
    sourceUrl: "https://www.paisabazaar.com/axis-bank/select-credit-card/",
  },
  {
    slug: "tata-neu-infinity-hdfc",
    name: "Tata Neu Infinity HDFC Bank",
    issuer: "HDFC Bank",
    category: "Shopping & Lifestyle",
    joiningFee: "₹1,499 + Taxes",
    annualFee: "₹1,499 + Taxes",
    benefits: [
      "Up to 10% savings on Tata Neu app spends",
      "Up to 5% value-back on other spends",
      "Complimentary airport lounge access",
    ],
    sourceUrl: "https://www.paisabazaar.com/hdfc-bank/tata-neu-infinity-hdfc-bank-credit-card/",
  },
  {
    slug: "indianoil-rbl-xtra",
    name: "IndianOil RBL Bank XTRA",
    issuer: "RBL Bank",
    category: "Fuel",
    joiningFee: "₹1,500 + Taxes",
    annualFee: "₹1,500 + Taxes",
    benefits: [
      "Up to 8.5% savings on fuel spends",
      "Accelerated value-back at IndianOil petrol pumps",
      "Up to 15 reward points per ₹100 spent",
    ],
    sourceUrl: "https://www.paisabazaar.com/rbl-bank/indianoil-rbl-xtra-credit-card/",
  },
];

export const howToChoose: { title: string; body: string }[] = [
  {
    title: "Match the card to how you actually spend",
    body: "A premium travel card's lounge access and airline transfers are wasted if you rarely fly. Look at last year's spending by category — travel, dining, groceries, fuel, online shopping — and shortlist cards that reward whichever category dominates.",
  },
  {
    title: "Weigh the fee against realistic annual value-back",
    body: "A ₹10,000 annual fee only makes sense if the card's rewards and complimentary memberships genuinely exceed that in a normal year for you — not a best-case year. Free or low-fee cards are usually the safer default unless you can already see the higher-fee card paying for itself.",
  },
  {
    title: "Check eligibility before applying",
    body: "Card issuers publish minimum income and credit score criteria (most premium cards expect a CIBIL score above 750). Applying for a card you're unlikely to qualify for creates a hard inquiry on your credit report for no benefit.",
  },
  {
    title: "Read the fine print on fee waivers",
    body: "Several cards above waive their annual fee above a spending threshold (e.g. the Cashback SBI Card waives its fee above ₹2 lakh/year in spends). Confirm the exact threshold and renewal terms on the issuer's own page before applying — thresholds and terms change and the issuer's page is always the authoritative source.",
  },
];

export const howToApplySteps: string[] = [
  "Check your credit score first (available free from CIBIL, Experian, or your bank/aggregator app) — most well-rewarding cards expect 750+.",
  "Compare 2–3 shortlisted cards' fees, benefits, and eligibility criteria on the issuer's own page (linked below for each card).",
  "Apply directly on the issuer's website or app, or through an aggregator like Paisabazaar/BankBazaar, which can show a pre-approval likelihood before you submit a full application.",
  "Have PAN, address proof, and income proof (salary slips or ITR for self-employed) ready — exact document requirements vary by issuer and are listed on their application page.",
  "A hard credit inquiry is recorded when you formally apply, which can briefly affect your credit score — this is why comparing and checking eligibility first (steps 1–2) matters.",
];
