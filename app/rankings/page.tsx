import type { Metadata } from "next";
import Link from "next/link";
import { products, getOffersByProductSlug, getHistoryByProductSlug } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr, getPriceDrop } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Product Rankings",
  description: "Browse DealWise rankings: popular, best rated, best deals, price drops, and trending products.",
};

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

function getAllProductData() {
  return products.map((product) => {
    const productOffers = getOffersByProductSlug(product.slug);
    const history = getHistoryByProductSlug(product.slug);
    const { score } = getDealScore(history, productOffers, product.msrp);
    const lowest = getLowestEffectiveOffer(productOffers);
    const effectivePrice = lowest ? getEffectivePrice(lowest) : null;
    const drop = getPriceDrop(history);
    const valueScore = effectivePrice ? (product.productScore * 10) / effectivePrice * 100000 : 0;
    return { product, score, lowest, effectivePrice, drop, valueScore };
  });
}

export default async function RankingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const activeTab = sp.tab ?? "popular";

  const allData = getAllProductData().filter((d) => d.effectivePrice !== null);

  const tabs: { id: string; label: string; icon: string }[] = [
    { id: "popular", label: "Popular", icon: "🔥" },
    { id: "rated", label: "Best Rated", icon: "⭐" },
    { id: "deals", label: "Best Deals", icon: "🏷️" },
    { id: "value", label: "Best Value", icon: "💎" },
    { id: "trending", label: "Trending", icon: "📈" },
    { id: "drops", label: "Price Drops", icon: "📉" },
  ];

  let ranked = [...allData];
  if (activeTab === "popular") ranked.sort((a, b) => b.product.reviewCount - a.product.reviewCount);
  else if (activeTab === "rated") ranked.sort((a, b) => b.product.rating - a.product.rating);
  else if (activeTab === "deals") ranked.sort((a, b) => b.score - a.score);
  else if (activeTab === "value") ranked.sort((a, b) => b.valueScore - a.valueScore);
  else if (activeTab === "trending") ranked = ranked.filter((d) => d.product.isTrending).sort((a, b) => b.score - a.score);
  else if (activeTab === "drops") ranked = ranked.filter((d) => d.drop !== null).sort((a, b) => (b.drop?.amount ?? 0) - (a.drop?.amount ?? 0));

  ranked = ranked.slice(0, 20);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Rankings" }]} />

      <div>
        <h1 className="text-3xl font-black text-slate-900">Product Rankings</h1>
        <p className="mt-1 text-slate-500">Data-driven rankings based on price intelligence, reviews and trends.</p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Ranking tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/rankings?tab=${tab.id}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.icon} {tab.label}
          </Link>
        ))}
      </nav>

      {ranked.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-xl font-semibold text-slate-900">No products in this ranking yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ranked.map(({ product, score, lowest, effectivePrice, drop }, i) => (
            <article
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-indigo-200"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <img src={product.image} alt={product.title} className="h-14 w-14 flex-shrink-0 rounded-lg object-contain bg-slate-50" width={56} height={56} loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-indigo-600">{product.brand}</p>
                <Link href={`/product/${product.slug}`} className="line-clamp-1 text-sm font-bold text-slate-900 hover:text-indigo-700 transition">
                  {product.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RatingStars rating={product.rating} size="sm" />
                  <DealScoreBadge score={score} size="sm" showLabel={false} />
                  {drop && <span className="text-xs font-semibold text-green-600">↓ {formatInr(drop.amount)}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {effectivePrice && <div className="text-lg font-black text-slate-900">{formatInr(effectivePrice)}</div>}
                {lowest && <div className="text-xs text-slate-400 mb-2">{lowest.retailerName}</div>}
                <Link href={`/product/${product.slug}`} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition">
                  View →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
