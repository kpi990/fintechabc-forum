// Server-only helpers for the credit card AI advisor chat.
//
// Design goal: let the model run a genuinely free-form conversation (per
// product decision), while keeping every *fact* the user ultimately sees
// (fees, benefits, apply links) sourced from our own verified creditCards.ts
// data rather than the model's own words. The model is only ever allowed to
// pick a slug from the real list and write qualitative reasoning around it —
// never state a specific fee/benefit figure itself. The frontend renders the
// real card object by slug, not anything the model typed.

import { creditCards } from "@/lib/creditCards";

export const ADVISOR_MODEL = "claude-haiku-4-5-20251001";

// Hard caps to bound cost/abuse on a public, unauthenticated endpoint.
export const MAX_TURNS = 8; // messages (user+assistant combined) per conversation
export const MAX_MESSAGE_LENGTH = 500;

const CARD_SUMMARY = creditCards.map((c) => ({
  slug: c.slug,
  name: c.name,
  issuer: c.issuer,
  category: c.category,
  joiningFee: c.joiningFee,
  annualFee: c.annualFee,
  benefits: c.benefits,
}));

// The model must end its recommendation message with this exact marker so
// the frontend/backend can deterministically detect completion and extract
// a slug — plain text parsing of prose is unreliable, a fixed marker isn't.
export const RECOMMEND_MARKER_RE = /\[\[RECOMMEND:([a-z0-9-]+)\]\]\s*$/i;

export function buildSystemPrompt(forceRecommendationNow: boolean): string {
  return `You are fintechabc's credit card advisor. You help Indian users pick the best-fit credit card from a FIXED list of exactly ${CARD_SUMMARY.length} real cards — you may never mention, imply, or invent any other card.

Here is the complete, verified card list (this is the only data you may reference; do not restate specific fee or benefit figures yourself — the app will display the real numbers to the user once you recommend, so keep your own messages qualitative, e.g. "a premium travel card with a higher annual fee" rather than quoting a number):

${JSON.stringify(CARD_SUMMARY, null, 2)}

Conversation rules:
- Ask short, friendly, ONE-question-at-a-time discovery questions (max 3-4 total) covering: primary spend category (travel, dining, fuel, everyday shopping, or general/no strong preference), comfort with paying an annual fee (fee-free preferred vs. willing to pay for stronger rewards), and whether airport lounge/travel perks matter to them.
- Do not ask for any personal identifying information (name, income figures, account numbers, etc.) — only spending habits and preferences.
- Once you have enough signal (or the user seems unsure/wants a quick answer), make a final recommendation. Your final message must: (1) briefly explain in plain, qualitative language why this card fits what they told you, in 1-3 sentences, and (2) end with the exact marker [[RECOMMEND:<slug>]] using one of the exact slugs from the list above, with nothing after the marker.
- The marker must ONLY appear when you are making your final recommendation, never in a question message.
- If the user asks something unrelated to choosing a card, gently redirect to the wizard questions.
${forceRecommendationNow ? "\n- IMPORTANT: This conversation has reached its question limit. You MUST make your final recommendation right now, using your best judgement from whatever you've learned so far, ending with the [[RECOMMEND:<slug>]] marker." : ""}`;
}

export function extractRecommendation(text: string): { displayText: string; slug: string | null } {
  const match = text.match(RECOMMEND_MARKER_RE);
  if (!match) return { displayText: text.trim(), slug: null };

  const slug = match[1].toLowerCase();
  const displayText = text.slice(0, match.index).trim();
  const isValidSlug = creditCards.some((c) => c.slug === slug);
  return { displayText, slug: isValidSlug ? slug : null };
}
