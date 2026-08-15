import type { Offer } from "@/lib/catalog";
import { formatInr, getEffectivePrice, getPriceFreshness } from "@/lib/pricing";
import Link from "next/link";

type Props = {
  offers: Offer[];
};

export function PriceComparisonTable({ offers }: Props) {
  if (offers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">No retailer prices available yet.</p>
        <p className="mt-1 text-xs text-slate-400">Price tracking is in progress for this product.</p>
      </div>
    );
  }

  const sorted = [...offers].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
  const lowestId = sorted[0].id;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm" aria-label="Price comparison across stores">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Store</th>
            <th className="px-4 py-3">Listed</th>
            <th className="px-4 py-3 hidden sm:table-cell">Coupon</th>
            <th className="px-4 py-3 hidden sm:table-cell">Bank</th>
            <th className="px-4 py-3 hidden sm:table-cell">Cashback*</th>
            <th className="px-4 py-3 hidden sm:table-cell">Shipping</th>
            <th className="px-4 py-3 font-bold text-slate-700">Effective</th>
            <th className="px-4 py-3 hidden md:table-cell">Updated</th>
            <th className="px-4 py-3">Buy</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((offer) => {
            const effective = getEffectivePrice(offer);
            const isLowest = offer.id === lowestId;
            const { label: freshLabel, stale } = getPriceFreshness(offer.lastChecked);

            return (
              <tr
                key={offer.id}
                className={`border-b border-slate-100 transition ${isLowest ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                aria-label={isLowest ? `${offer.retailerName} — best price` : offer.retailerName}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{offer.retailerName}</span>
                    {isLowest && (
                      <span className="hidden sm:inline rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        Best
                      </span>
                    )}
                    {!offer.inStock && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                        OOS
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 font-mono tabular-nums">{formatInr(offer.price)}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-green-700 font-mono tabular-nums">
                  {offer.couponDiscount > 0 ? `−${formatInr(offer.couponDiscount)}` : "—"}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-blue-700 font-mono tabular-nums">
                  {offer.bankOfferDiscount > 0 ? `−${formatInr(offer.bankOfferDiscount)}` : "—"}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-purple-700 font-mono tabular-nums">
                  {offer.cashbackEstimate > 0 ? `~−${formatInr(offer.cashbackEstimate)}` : "—"}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-slate-600 font-mono tabular-nums">
                  {offer.shippingCost > 0 ? `+${formatInr(offer.shippingCost)}` : "Free"}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-bold text-base font-mono tabular-nums ${isLowest ? "text-indigo-700" : "text-slate-900"}`}>
                    {formatInr(effective)}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-xs ${stale ? "text-amber-600" : "text-slate-400"}`}>{freshLabel}</span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/go/${offer.id}`}
                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      isLowest
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                    } ${!offer.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    rel="nofollow sponsored"
                    aria-disabled={!offer.inStock}
                  >
                    {offer.inStock ? "Buy" : "OOS"}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="px-4 py-2 text-xs text-slate-400 border-t border-slate-100">
        *Cashback is estimated and may vary. Bank offers apply for eligible cards only.
        Effective price shown after all deductions.
      </p>
    </div>
  );
}
