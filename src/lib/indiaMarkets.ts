export const ASOF_DATE = "13 July 2026";

export type IPOListing = {
  name: string;
  type: "Mainboard" | "SME";
  openDate: string;
  closeDate: string;
  listingDate: string;
  issueSize: string;
};

export const upcomingIPOs: IPOListing[] = [
  { name: "Kusumgar Corporates", type: "Mainboard", openDate: "8 Jul", closeDate: "10 Jul", listingDate: "15 Jul 2026", issueSize: "₹650 Cr" },
  { name: "SBI Funds Management", type: "Mainboard", openDate: "14 Jul", closeDate: "16 Jul", listingDate: "21 Jul 2026", issueSize: "TBA" },
  { name: "Alpine Texworld", type: "Mainboard", openDate: "14 Jul", closeDate: "16 Jul", listingDate: "21 Jul 2026", issueSize: "TBA" },
  { name: "IC Electricals", type: "SME", openDate: "3 Jul", closeDate: "7 Jul", listingDate: "10 Jul 2026", issueSize: "₹47.9 Cr" },
  { name: "Devson Catalyst", type: "SME", openDate: "9 Jul", closeDate: "13 Jul", listingDate: "16 Jul 2026", issueSize: "₹42.3 Cr" },
  { name: "Happy Steels", type: "SME", openDate: "9 Jul", closeDate: "13 Jul", listingDate: "16 Jul 2026", issueSize: "TBA" },
  { name: "Millworks Technologies", type: "SME", openDate: "14 Jul", closeDate: "16 Jul", listingDate: "21 Jul 2026", issueSize: "TBA" },
  { name: "Sotefin Bharat", type: "SME", openDate: "16 Jul", closeDate: "20 Jul", listingDate: "23 Jul 2026", issueSize: "TBA" },
];

export const fnoSnapshot = {
  asOf: "13 July 2026 (close)",
  nifty: { value: 24211.0, change: 4.1, changePct: 0.02, high: 24259, low: 24039 },
  bankNifty: { value: 58131.45, change: 85.55, changePct: 0.15, high: 58219, low: 57616 },
  topSectors: [
    { name: "Nifty IT", changePct: 3.59 },
    { name: "Nifty Media", changePct: 2.09 },
    { name: "Nifty Consumer Durables", changePct: 1.15 },
  ],
  note: "Cash/index close levels for context — not a live F&O order book or open-interest feed. For actual F&O trading data (OI, volumes, option chains), NSE's licensed real-time feed is the authoritative source.",
};

export type LoanRate = {
  bank: string;
  homeLoanFrom: string;
  homeLoanTo: string;
};

export const homeLoanRates: LoanRate[] = [
  { bank: "SBI", homeLoanFrom: "7.25%", homeLoanTo: "8.45%" },
  { bank: "HDFC Bank", homeLoanFrom: "7.20%", homeLoanTo: "13.20%" },
  { bank: "ICICI Bank", homeLoanFrom: "7.65%", homeLoanTo: "9.80%" },
  { bank: "Bank of India", homeLoanFrom: "8.60%", homeLoanTo: "10.85%" },
];

export type HealthInsurancePlan = {
  insurer: string;
  plan: string;
  claimSettlementRatio: string;
  rating: string;
};

export const healthInsurancePlans: HealthInsurancePlan[] = [
  { insurer: "HDFC ERGO", plan: "Optima Secure+", claimSettlementRatio: "97.6%", rating: "4.6 / 5" },
  { insurer: "Care Health", plan: "Care Supreme", claimSettlementRatio: "~96%", rating: "4.5 / 5" },
  { insurer: "Aditya Birla Health", plan: "Activ One MAX", claimSettlementRatio: "~95%", rating: "4.4 / 5" },
  { insurer: "Niva Bupa", plan: "ReAssure 2.0", claimSettlementRatio: "100%", rating: "4.3 / 5" },
  { insurer: "Star Health", plan: "Comprehensive", claimSettlementRatio: "99.1%", rating: "4.2 / 5" },
];
