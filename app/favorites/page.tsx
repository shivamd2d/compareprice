import type { Metadata } from "next";
import Link from "next/link";
import { products, getOffersByProductSlug, getHistoryByProductSlug } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr, getPriceDrop } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "Your saved products with current prices and price changes.",
};

// Seed mock favorites (in production, this comes from user's session/DB)
const mockFavoritesSlugs = [
  "apple-iphone-16",
  "lenovo-ideapad-slim-5",
  "sony-wh1000xm5",
  "samsung-galaxy-s25",
];

export default function FavoritesPage() {
  const favorites = mockFavoritesSlugs.map((slug) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return null;
    const productOffers = getOffersByProductSlug(slug);
    const history = getHistoryByProductSlug(slug);
    const { score } = getDealScore(history, productOffers, product.msrp);
    const lowest = getLowestEffectiveOffer(productOffers);
    const currentPrice = lowest ? getEffectivePrice(lowest) : null;
    const drop = getPriceDrop(history);
    // Simulate price when saved (slightly higher)
    const savedPrice = currentPrice ? Math.round(currentPrice * 1.03) : null;
    const savedDiff = currentPrice && savedPrice ? savedPrice - currentPrice : null;
    return { product, score, lowest, currentPrice, savedPrice, savedDiff, drop };
  }).filter(Boolean) as NonNullable<{ product: typeof products[0]; score: number; lowest: ReturnType<typeof getLowestEffectiveOffer>; currentPrice: number | null; savedPrice: number | null; savedDiff: number | null; drop: ReturnType<typeof getPriceDrop> }>[];

  return (
    <div className="space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "My Favorites" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Favorites</h1>
          <p className="mt-1 text-slate-500">{favorites.length} saved products. Sign in to sync across devices.</p>
        </div>
        <Link href="/account" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
          Sign In to Sync
        </Link>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-semibold">⚠ Demo mode:</span> These are sample saved products. Sign in to save your own favorites.
      </div>

      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map(({ product, score, lowest, currentPrice, savedPrice, savedDiff, drop }) => (
            <article
              key={product.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <img src={product.image} alt={product.title} className="h-20 w-20 rounded-xl object-contain bg-slate-50 flex-shrink-0" width={80} height={80} loading="lazy" />

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-indigo-600">{product.brand}</p>
                <Link href={`/product/${product.slug}`} className="text-base font-bold text-slate-900 hover:text-indigo-700 transition">
                  {product.title}
                </Link>
                <div className="mt-1 flex flex-wrap gap-2 items-center">
                  <RatingStars rating={product.rating} size="sm" />
                  <DealScoreBadge score={score} size="sm" showLabel={false} />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="text-right">
                  {currentPrice && (
                    <div className="text-xl font-black text-slate-900">{formatInr(currentPrice)}</div>
                  )}
                  {lowest && <div className="text-xs text-slate-400">{lowest.retailerName}</div>}
                </div>

                {savedDiff !== null && savedDiff > 0 && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    ↓ {formatInr(savedDiff)} since saved
                  </span>
                )}
                {drop && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    ↓ {formatInr(drop.amount)} this week
                  </span>
                )}

                <div className="flex gap-2">
                  <Link href={`/product/${product.slug}`} className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition">
                    View
                  </Link>
                  <Link href={`/alerts?product=${product.slug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                    🔔 Alert
                  </Link>
                  <button className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition">
                    ♡ Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-5xl" aria-hidden="true">♡</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">No favorites yet</h2>
          <p className="mt-2 text-sm text-slate-500">Browse products and click the heart icon to save them here.</p>
          <Link href="/" className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
