import type { OutboundLink } from "@/lib/affiliateLinks";

// Renders nothing unless at least one of the links passed in is actually
// flagged `isAffiliate: true` in src/lib/affiliateLinks.ts. Today that's
// none of them (no affiliate program has been joined yet), so this component
// is inert on every page that uses it — it's here so the disclosure appears
// automatically the moment a real affiliate link is wired in, rather than
// needing someone to remember to add it by hand later.
export default function AffiliateDisclosure({ links }: { links: OutboundLink[] }) {
  if (!links.some((l) => l.isAffiliate)) return null;

  return (
    <div className="rounded-lg border border-warn/30 bg-warn/10 px-4 py-3 text-xs text-muted">
      <span className="font-semibold text-slate-50">Advertising disclosure: </span>
      Some links on this page are affiliate links — fintechabc may earn a commission if you apply
      through them, at no extra cost to you. This never affects which products we list or how we
      describe them.
    </div>
  );
}
