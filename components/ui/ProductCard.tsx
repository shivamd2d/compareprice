import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { getOffersByProductSlug, getHistoryByProductSlug } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr, getPriceDrop } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { DealScoreBadge } from "./DealScoreBadge";
import { RatingStars } from "./RatingStars";

type Props = {
  product: Product;
  showCompare?: boolean;
};

export function ProductCard({ product, showCompare = true }: Props) {
  const productOffers = getOffersByProductSlug(product.slug);
  const history = getHistoryByProductSlug(product.slug);
  const lowestOffer = getLowestEffectiveOffer(productOffers);
  const effectivePrice = lowestOffer ? getEffectivePrice(lowestOffer) : null;
  const { score } = getDealScore(history, productOffers, product.msrp);
  const drop = getPriceDrop(history);

  return (
    <article className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-indigo-200">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl bg-slate-50">
        <img
          src={product.image}
          alt={product.title}
          className="h-44 w-full object-contain p-4 transition group-hover:scale-105"
          loading="lazy"
          width={280}
          height={176}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">New</span>
          )}
          {product.isTrending && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">🔥 Trending</span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <DealScoreBadge score={score} size="sm" showLabel={false} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {product.title}
        </h3>

        <div className="mt-1.5">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        {/* Price */}
        <div className="mt-3">
          {effectivePrice ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900">{formatInr(effectivePrice)}</span>
                {lowestOffer && lowestOffer.price > effectivePrice && (
                  <span className="text-xs text-slate-400 line-through">{formatInr(lowestOffer.price)}</span>
                )}
              </div>
              {drop && (
                <p className="mt-0.5 text-xs font-medium text-green-600">
                  ↓ {formatInr(drop.amount)} ({drop.pct.toFixed(0)}%) this week
                </p>
              )}
              {lowestOffer && (
                <p className="mt-0.5 text-xs text-slate-400">via {lowestOffer.retailerName}</p>
              )}
            </>
          ) : (
            <span className="text-sm text-slate-400">Price unavailable</span>
          )}
        </div>

        {/* Deal score row */}
        <div className="mt-3 flex items-center gap-2">
          <DealScoreBadge score={score} size="sm" />
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            View Details
          </Link>
          {showCompare && (
            <Link
              href={`/compare?items=${product.slug}`}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              title="Add to compare"
              aria-label={`Compare ${product.title}`}
            >
              ⚖
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
