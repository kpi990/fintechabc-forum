import LogoIcon from "@/components/LogoIcon";

// Brand hero banner, styled after the dark "logo + tagline + feature icons"
// panel from the brand sheet. Deliberately does NOT reproduce that sheet's
// phone-mockup or its numbers (fake individual India-stock tickers we don't
// track, and vanity stats like "500K+ Members" this site doesn't have) -
// same mark, same gradient/tagline treatment, but the content stays honest
// about what the product actually does.
const FEATURES = [
  {
    label: "Real-time Markets",
    sub: "Live crypto prices, honest India snapshots.",
    icon: (
      <path
        d="M4 17l5-5 4 4 7-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    label: "Community Discussions",
    sub: "Ask, debate, and learn with other members.",
    icon: (
      <>
        <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M14.5 20c.3-2.6 2.2-4.3 4.5-4.3s4.2 1.7 4.5 4.3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    label: "Smart Tools",
    sub: "Watchlists, movers, and per-coin boards.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  {
    label: "Financial Growth",
    sub: "Better decisions, made together.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </>
    ),
  },
];

export default function PromoBanner() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-[#0d0b1f] via-[#1a1235] to-[#2a1a4a] p-6 sm:p-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <LogoIcon size={56} />
          <div>
            <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
              <span className="text-slate-50">fintech</span>
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                abc
              </span>
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-accent-2 sm:text-sm">
              Ask Better · Build Better · Compound Better
            </div>
            <div className="mt-1 text-xs text-faint">
              Where India&apos;s financial community grows together.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-1 sm:gap-3">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  {f.icon}
                </svg>
              </span>
              <div>
                <div className="text-sm font-medium text-slate-50">{f.label}</div>
                <div className="text-xs text-faint">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
