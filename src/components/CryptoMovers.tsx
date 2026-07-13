import { getTopMovers } from "@/lib/market";

function MoverRow({ symbol, name, price, changePct24h }: { symbol: string; name: string; price: number; changePct24h: number }) {
  const isUp = changePct24h >= 0;
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="font-medium text-slate-900">{symbol}</span>
        <span className="ml-2 text-xs text-slate-400">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-700">
          ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
        <span
          className={`w-16 text-right text-sm font-medium ${isUp ? "text-emerald-600" : "text-rose-600"}`}
        >
          {isUp ? "+" : ""}
          {changePct24h.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export default async function CryptoMovers({
  limit = 5,
  layout = "grid",
}: {
  limit?: number;
  layout?: "grid" | "stack";
}) {
  const { gainers, losers } = await getTopMovers(limit);

  const gainersCard = (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Top gainers (24h)
      </h3>
      <div className="divide-y divide-slate-100">
        {gainers.map((c) => (
          <MoverRow key={c.id} {...c} />
        ))}
      </div>
    </div>
  );

  const losersCard = (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-700">
        Top losers (24h)
      </h3>
      <div className="divide-y divide-slate-100">
        {losers.map((c) => (
          <MoverRow key={c.id} {...c} />
        ))}
      </div>
    </div>
  );

  if (layout === "stack") {
    return (
      <div className="space-y-4">
        {gainersCard}
        {losersCard}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {gainersCard}
      {losersCard}
    </div>
  );
}
