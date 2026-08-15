import type { Metadata } from "next";
import Link from "next/link";
import { products, categories, getOffersByProductSlug, getHistoryByProductSlug } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr, getPriceDrop } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Today's Best Deals",
  description: "Browse today's best product deals ranked by Deal Score — our measure of current price vs. history.",
};

type Props = {
  searchParams: Promise<{ category?: string; sort?: string }>;
};

export default async function DealsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filterCategory = sp.category;
  const sortBy = sp.sort ?? "score";

  const rows = products
    .map((product) => {
      const productOffers = getOffersByProductSlug(product.slug);
      const history = getHistoryByProductSlug(product.slug);
      const { score, label: dealLabel, explanation } = getDealScore(history, productOffers, product.msrp);
      const lowest = getLowestEffectiveOffer(productOffers);
      const effectivePrice = lowest ? getEffectivePrice(lowest) : null;
      const totalSavings = lowest
        ? lowest.couponDiscount + lowest.bankOfferDiscount + lowest.cashbackEstimate
        : 0;
      const drop = getPriceDrop(history);
      return { product, score, dealLabel, explanation, lowest, effectivePrice, totalSavings, drop };
    })
    .filter((r) => r.effectivePrice !== null && r.lowest?.inStock)
    .filter((r) => !filterCategory || r.product.categorySlug === filterCategory);

  if (sortBy === "savings") rows.sort((a, b) => b.totalSavings - a.totalSavings);
  else if (sortBy === "price") rows.sort((a, b) => (a.effectivePrice ?? 0) - (b.effectivePrice ?? 0));
  else if (sortBy === "drop") rows.sort((a, b) => (b.drop?.amount ?? 0) - (a.drop?.amount ?? 0));
  else rows.sort((a, b) => b.score - a.score);

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { category: filterCategory, sort: sortBy, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/deals${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Deals" }]} />

      <div>
        <h1 className="text-3xl font-black text-slate-900">Today&apos;s Best Deals</h1>
        <p className="mt-1 text-slate-500">
          Ranked by Deal Score — how current prices compare to 90 days of history.
        </p>
      </div>

      {/* Filter + sort */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500 self-center">Category:</span>
          <a href={buildUrl({ category: undefined })} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${!filterCategory ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>All</a>
          {categories.map((cat) => (
            <a key={cat.slug} href={buildUrl({ category: cat.slug })} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${filterCategory === cat.slug ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {cat.icon} {cat.name}
            </a>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500 self-center">Sort:</span>
          {[
            { value: "score", label: "Deal Score" },
            { value: "savings", label: "Most Savings" },
            { value: "drop", label: "Biggest Drop" },
            { value: "price", label: "Lowest Price" },
          ].map(({ value, label }) => (
            <a key={value} href={buildUrl({ sort: value })} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${sortBy === value ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {label}
            </a>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">{rows.length} deals found</p>

      {/* Deals grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ product, score, dealLabel, explanation, lowest, effectivePrice, totalSavings, drop }) => (
          <article
            key={product.id}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-indigo-200"
          >
            <div className="flex items-start gap-4 p-5">
              <img
                src={product.image}
                alt={product.title}
                className="h-16 w-16 rounded-lg object-contain bg-slate-50 flex-shrink-0"
                width={64} height={64} loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-indigo-600">{product.brand}</p>
                <h2 className="line-clamp-2 text-sm font-bold text-slate-900 leading-snug">{product.title}</h2>
                <p className="mt-1 text-xs text-slate-400">{product.categorySlug}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                {effectivePrice && <span className="text-xl font-black text-slate-900">{formatInr(effectivePrice)}</span>}
                {totalSavings > 0 && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 rounded-full px-2 py-0.5">
                    Save {formatInr(totalSavings)}
                  </span>
                )}
              </div>
              {drop && (
                <p className="text-xs text-green-600 font-medium mb-2">
                  ↓ {formatInr(drop.amount)} ({drop.pct.toFixed(0)}%) this week
                </p>
              )}
              {lowest && <p className="text-xs text-slate-400">via {lowest.retailerName}</p>}
              <div className="mt-2">
                <DealScoreBadge score={score} size="sm" showLabel />
              </div>
              <p className="mt-2 text-xs text-slate-500 line-clamp-2">{explanation}</p>
            </div>

            <div className="border-t border-slate-100 flex">
              <Link
                href={`/product/${product.slug}`}
                className="flex-1 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
              >
                Details
              </Link>
              {lowest && (
                <Link
                  href={`/go/${lowest.id}`}
                  className="flex-1 py-3 text-center text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-br-xl"
                  rel="nofollow sponsored"
                >
                  Buy Now
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-4xl" aria-hidden="true">🎁</p>
          <h2 className="mt-4 text-xl font-semibold">No deals in this category yet</h2>
          <p className="mt-2 text-sm text-slate-500">Try removing the category filter.</p>
          <a href="/deals" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">Show all deals</a>
        </div>
      )}
    </div>
  );
}
