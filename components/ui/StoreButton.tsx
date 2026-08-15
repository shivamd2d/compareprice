import Link from "next/link";
import type { Offer } from "@/lib/catalog";
import { formatInr, getEffectivePrice, getPriceFreshness } from "@/lib/pricing";

type Props = {
  offer: Offer;
  isLowest?: boolean;
};

export function StoreButton({ offer, isLowest }: Props) {
  const { label: freshLabel, stale } = getPriceFreshness(offer.lastChecked);

  return (
    <Link
      href={`/go/${offer.id}`}
      className={`group flex items-center justify-between rounded-lg border px-4 py-3 transition hover:shadow-md ${
        isLowest
          ? "border-indigo-300 bg-indigo-50 hover:bg-indigo-100"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
      rel="nofollow sponsored"
      aria-label={`Buy at ${offer.retailerName} for ${formatInr(getEffectivePrice(offer))}`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${isLowest ? "text-indigo-700" : "text-slate-800"}`}>
            {offer.retailerName}
          </span>
          {isLowest && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
              Best Price
            </span>
          )}
        </div>
        <span className={`text-xs ${stale ? "text-amber-600" : "text-slate-400"}`}>{freshLabel}</span>
      </div>
      <div className="flex items-center gap-3 text-right">
        <div>
          <div className={`font-bold ${isLowest ? "text-indigo-700" : "text-slate-900"}`}>
            {formatInr(getEffectivePrice(offer))}
          </div>
          {!offer.inStock && <div className="text-xs text-red-500 font-medium">Out of stock</div>}
        </div>
        <svg
          className={`h-4 w-4 transition group-hover:translate-x-0.5 ${isLowest ? "text-indigo-500" : "text-slate-400"}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
