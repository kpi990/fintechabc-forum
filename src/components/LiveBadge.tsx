// Freshness label, per the site-wide "Data Freshness & Credibility Contract":
// every number-bearing widget must say whether it's live, recently polled,
// or a point-in-time snapshot - never an unlabeled figure. Pure presentational,
// safe in server components; the pulsing dot is CSS-only.
type Props =
  | { mode: "live"; label?: string }
  | { mode: "updated"; label: string }
  | { mode: "asof"; label: string; interval: string }
  | { mode: "delayed"; minutes: string };

export default function LiveBadge(props: Props) {
  if (props.mode === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-up/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-up">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-up" />
        </span>
        {props.label ?? "Live"}
      </span>
    );
  }

  if (props.mode === "updated") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-faint" />
        Updated {props.label} ago
      </span>
    );
  }

  if (props.mode === "asof") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-faint">
        As of {props.label} · refreshes every {props.interval}
      </span>
    );
  }

  // "delayed": genuinely polling/updating data, but sourced from a free feed
  // that lags the real market (see indiaLive.ts) - deliberately NOT styled
  // like "live" (no pulsing dot) since claiming otherwise would be exactly
  // the kind of unlabeled-number problem this component exists to prevent.
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warn/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warn">
      <span className="h-1.5 w-1.5 rounded-full bg-warn" />
      Delayed ~{props.minutes}
    </span>
  );
}
