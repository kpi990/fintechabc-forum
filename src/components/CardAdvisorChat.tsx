"use client";

import { useEffect, useRef, useState } from "react";
import BrandBadge from "@/components/BrandBadge";
import { creditCards } from "@/lib/creditCards";
import { creditCardApplyLinks } from "@/lib/affiliateLinks";

type ChatMessage = { role: "user" | "assistant"; content: string };

const OPENING_MESSAGE =
  "Hi! I'll ask a few quick questions to find the credit card that fits how you actually spend. First — what matters most to you: travel & lounge access, cashback, everyday shopping rewards, or fuel savings?";

export default function CardAdvisorChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedSlug, setRecommendedSlug] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function reset() {
    setMessages([{ role: "assistant", content: OPENING_MESSAGE }]);
    setInput("");
    setError(null);
    setRecommendedSlug(null);
    setLoading(false);
  }

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading || recommendedSlug) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed.slice(0, 500) }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/card-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.recommendedSlug) setRecommendedSlug(data.recommendedSlug);
    } catch {
      setError("Couldn't reach the advisor — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const recommendedCard = recommendedSlug
    ? creditCards.find((c) => c.slug === recommendedSlug) ?? null
    : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
      >
        <span aria-hidden>✨</span>
        Let me find the best card for you based on your needs
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex h-[100dvh] w-full flex-col bg-surface sm:h-[min(640px,90dvh)] sm:max-w-lg sm:rounded-2xl sm:border sm:border-line sm:shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3 sm:rounded-t-2xl">
              <div>
                <div className="text-sm font-semibold text-slate-50">Card advisor</div>
                <div className="text-xs text-faint">Powered by Claude — informational only</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1.5 text-muted transition hover:bg-white/5 hover:text-slate-50"
              >
                ✕
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-accent text-white"
                        : "bg-white/5 text-slate-200"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl bg-white/5 px-3 py-2 text-sm text-muted">
                    Thinking…
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
                  {error}
                </p>
              )}

              {recommendedCard && (
                <div className="mt-2 rounded-xl border border-accent/40 bg-accent/5 p-4">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Your match
                  </div>
                  <div className="flex items-center gap-2">
                    <BrandBadge name={recommendedCard.issuer} size={28} />
                    <div>
                      <div className="font-medium leading-tight text-slate-50">
                        {recommendedCard.name}
                      </div>
                      <div className="text-xs text-faint">{recommendedCard.issuer}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white/5 px-2.5 py-2">
                      <div className="text-faint">Joining fee</div>
                      <div className="mt-0.5 font-medium text-slate-50">
                        {recommendedCard.joiningFee}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/5 px-2.5 py-2">
                      <div className="text-faint">Annual fee</div>
                      <div className="mt-0.5 font-medium text-slate-50">
                        {recommendedCard.annualFee}
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted">
                    {recommendedCard.benefits.map((b) => (
                      <li key={b} className="flex gap-1.5">
                        <span className="text-accent">·</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={
                      creditCardApplyLinks[recommendedCard.slug]?.url ?? recommendedCard.sourceUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-violet-400"
                  >
                    {creditCardApplyLinks[recommendedCard.slug]?.label ?? "View details"} ↗
                  </a>
                  <button
                    onClick={reset}
                    className="mt-2 w-full text-center text-xs text-muted hover:text-slate-200"
                  >
                    Start over
                  </button>
                </div>
              )}
            </div>

            {!recommendedCard && (
              <div className="flex shrink-0 items-center gap-2 border-t border-line px-3 py-3 sm:rounded-b-2xl">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  maxLength={500}
                  disabled={loading}
                  placeholder="Type your answer…"
                  className="min-w-0 flex-1 rounded-lg border border-line-strong bg-transparent px-3 py-2 text-sm text-slate-50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-400 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            )}

            <p className="shrink-0 border-t border-line px-4 py-2 text-[10px] text-faint sm:rounded-b-2xl">
              Informational only, not personalized financial advice. Recommendation is limited to
              the {creditCards.length} cards on this page; verify current fees/terms on the
              issuer's page before applying.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
