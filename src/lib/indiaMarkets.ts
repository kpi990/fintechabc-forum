// ============================================================================
// Curated India market data, re-verified via web search on 14 July 2026.
// This is NOT a live feed — there is no free, publicly redistributable
// real-time API for NSE index levels, IPO calendars, bank loan rates, or
// insurer-level claim settlement ratios (these are commercial data products
// or annual regulatory disclosures, not real-time feeds anyone publishes for
// free). Every section below links to a real source so the reader can check
// the current live number themselves — that's the honest substitute for
// "real-time" here. Crypto data on this site (see market.ts) IS genuinely
// live; this file deliberately is not, and says so.
//
// Health insurance: earlier versions of this file asserted specific
// per-insurer claim-settlement percentages. On re-verification, search
// results for individual insurers were inconsistent across sources (no
// single authoritative table could be confirmed for all five insurers), so
// those numbers have been removed rather than published unverified. The
// insurer list now links out to a live comparison tool instead of stating a
// possibly-wrong number as fact.
// ============================================================================

export const ASOF_DATE = "14 July 2026";

export type SourceLink = { label: string; url: string };

export type IPOListing = {
  name: string;
  type: "Mainboard" | "SME";
  openDate: string;
  closeDate: string;
  listingDate: string;
  issueSize: string;
};

export const ipoSource: SourceLink = {
  label: "NSE — All Upcoming Issues (live)",
  url: "https://www.nseindia.com/market-data/all-upcoming-issues-ipo",
};

export const upcomingIPOs: IPOListing[] = [
  { name: "Kusumgar Corporates", type: "Mainboard", openDate: "8 Jul", closeDate: "10 Jul", listingDate: "15 Jul 2026", issueSize: "₹650 Cr" },
  { name: "SBI Funds Management", type: "Mainboard", openDate: "14 Jul", closeDate: "16 Jul", listingDate: "21 Jul 2026", issueSize: "₹545–₹574/share" },
  { name: "Alpine Texworld", type: "Mainboard", openDate: "14 Jul", closeDate: "16 Jul", listingDate: "21 Jul 2026", issueSize: "₹100–₹105/share" },
  { name: "IC Electricals", type: "SME", openDate: "3 Jul", closeDate: "7 Jul", listingDate: "10 Jul 2026", issueSize: "₹47.9 Cr" },
  { name: "Devson Catalyst", type: "SME", openDate: "9 Jul", closeDate: "13 Jul", listingDate: "16 Jul 2026", issueSize: "₹42.3 Cr" },
  { name: "Happy Steels", type: "SME", openDate: "9 Jul", closeDate: "13 Jul", listingDate: "16 Jul 2026", issueSize: "TBA" },
  { name: "Millworks Technologies", type: "SME", openDate: "14 Jul", closeDate: "16 Jul", listingDate: "21 Jul 2026", issueSize: "₹315–₹331/share" },
  { name: "Sotefin Bharat", type: "SME", openDate: "16 Jul", closeDate: "20 Jul", listingDate: "23 Jul 2026", issueSize: "TBA" },
];

export const fnoSource: SourceLink = {
  label: "NSE Nifty Bank — live index tracker",
  url: "https://www.nseindia.com/index-tracker/NIFTY%20BANK",
};

export const fnoSnapshot = {
  // 14 July 2026: re-verified after a reader flagged the previous number as
  // stale. Search results for "today's" Nifty figure were themselves
  // inconsistent (one source echoed yesterday's close mislabeled as today) —
  // exactly the free-data-source unreliability flagged elsewhere in this
  // file. Nifty's value/change below come from a live brokerage app
  // screenshot the reader shared (more trustworthy than the conflicting
  // search snippets); we don't have a verified intraday low/high for Nifty
  // today, so none is shown rather than guessing. Bank Nifty's full OHLC
  // was arithmetically consistent across sources, so its range is shown.
  asOf: "14 July 2026 (intraday, not closing)",
  nifty: { value: 24052.05, change: -158.95, changePct: -0.66, high: null as number | null, low: null as number | null },
  bankNifty: { value: 57492.3, change: -639.15, changePct: -1.1, high: 57840.05 as number | null, low: 57377.75 as number | null },
  topSectors: [
    { name: "Nifty IT", changePct: 3.59 },
    { name: "Nifty Media", changePct: 2.09 },
    { name: "Nifty Consumer Durables", changePct: 1.15 },
  ],
  note: "Point-in-time figures, not a live tick-by-tick feed — click the source link for the current value.",
};

export type LoanRate = {
  bank: string;
  homeLoanFrom: string;
  homeLoanTo: string;
};

export const loanRatesSource: SourceLink = {
  label: "Paisabazaar — home loan rate comparison (live)",
  url: "https://www.paisabazaar.com/home-loan/interest-rates/",
};

export const homeLoanRates: LoanRate[] = [
  { bank: "SBI", homeLoanFrom: "7.25%", homeLoanTo: "8.70%" },
  { bank: "HDFC Bank", homeLoanFrom: "7.20%", homeLoanTo: "13.20%" },
  { bank: "ICICI Bank", homeLoanFrom: "7.65%", homeLoanTo: "9.80%" },
  { bank: "Bank of India", homeLoanFrom: "8.60%", homeLoanTo: "10.85%" },
];

export type HealthInsurer = {
  insurer: string;
  plan: string;
};

export const insuranceSource: SourceLink = {
  label: "PolicyX — claim settlement ratio comparison (live)",
  url: "https://www.policyx.com/data-lab/claim-settlement-ratio-insurance-companies-India.php",
};

// Deliberately no claim-settlement-ratio column here — see file header note.
export const healthInsurancePlans: HealthInsurer[] = [
  { insurer: "HDFC ERGO", plan: "Optima Secure+" },
  { insurer: "Care Health", plan: "Care Supreme" },
  { insurer: "Aditya Birla Health", plan: "Activ One MAX" },
  { insurer: "Niva Bupa", plan: "ReAssure 2.0" },
  { insurer: "Star Health", plan: "Comprehensive" },
];
