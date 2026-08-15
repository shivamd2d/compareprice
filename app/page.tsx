import Link from "next/link";
import type { Metadata } from "next";
import {
  categories,
  products,
  offers,
  priceHistory,
  buyingGuides,
  getTrendingProducts,
  getNewArrivals,
  getOffersByProductSlug,
  getHistoryByProductSlug,
} from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr, getPriceDrop } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { ProductCard } from "@/components/ui/ProductCard";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";

export const metadata: Metadata = {
  title: "DealWise — Find the Right Product at the Right Price",
  description:
    "Compare prices, specifications, reviews and price history before you buy. India's smartest product comparison platform.",
};

// ── Helper: compute deal score for a product ─
function productWithScore(slug: string) {
  const product = products.find((p) => p.slug === slug)!;
  const productOffers = getOffersByProductSlug(slug);
  const history = getHistoryByProductSlug(slug);
  const { score } = getDealScore(history, productOffers, product.msrp);
  const lowestOffer = getLowestEffectiveOffer(productOffers);
  const effective = lowestOffer ? getEffectivePrice(lowestOffer) : null;
  const drop = getPriceDrop(history);
  return { product, score, effective, lowestOffer, drop };
}

// ── Best deals (top 6 by deal score) ─────────
const topDeals = products
  .map((p) => productWithScore(p.slug))
  .filter((x) => x.effective !== null)
  .sort((a, b) => b.score - a.score)
  .slice(0, 6);

// ── Price drops ────────────────────────────────
const priceDrops = products
  .map((p) => productWithScore(p.slug))
  .filter((x) => x.drop !== null && x.effective !== null)
  .sort((a, b) => (b.drop?.amount ?? 0) - (a.drop?.amount ?? 0))
  .slice(0, 6);

// ── Budget tiers ──────────────────────────────
const BUDGETS = [
  { label: "Under ₹20K", max: 20000 },
  { label: "Under ₹30K", max: 30000 },
  { label: "Under ₹50K", max: 50000 },
  { label: "Under ₹70K", max: 70000 },
  { label: "Under ₹1L", max: 100000 },
];

const popularSearches = [
  "Laptops",
  "Smartphones",
  "TVs",
  "Headphones",
  "Monitors",
  "Tablets",
  "Smartwatches",
];

export default function HomePage() {
  const trending = getTrendingProducts().slice(0, 6);
  const newArrivals = getNewArrivals().slice(0, 3);

  return (
    <div className="space-y-14">
      {/* ── Hero ───────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 px-6 py-14 sm:px-10 text-white">
        {/* Decorative bg pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white" />
        </div>

        <div className="relative max-w-3xl">
          <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            🇮🇳 India's Decision-First Price Comparison
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl text-balance">
            Find the right product at the right price.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-indigo-100">
            Compare prices, specifications, reviews and price history before you buy.
          </p>

          {/* Search bar */}
          <form action="/search" className="mt-8 flex flex-col gap-3 sm:flex-row" role="search">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400" aria-hidden="true">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="What are you looking for? e.g. laptop under ₹70,000"
                className="w-full rounded-xl border-0 bg-white pl-12 pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                aria-label="Search products, brands or model numbers"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-8 py-4 font-bold text-slate-900 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 whitespace-nowrap"
            >
              Search →
            </button>
          </form>

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-indigo-200">Popular:</span>
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white hover:bg-white/25 transition"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────── */}
      <section aria-label="Platform statistics">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Products Tracked", value: `${products.length}+` },
            { label: "Retailers Monitored", value: "5" },
            { label: "Categories", value: categories.length.toString() },
            { label: "Price Updates Today", value: "1,240+" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <dt className="text-xs font-medium text-slate-500">{label}</dt>
              <dd className="mt-1 text-2xl font-black text-indigo-600">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Today's Best Deals ─────────────── */}
      <section aria-labelledby="deals-heading">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="deals-heading" className="text-2xl font-bold text-slate-900">Today&apos;s Best Deals</h2>
            <p className="mt-1 text-sm text-slate-500">Ranked by Deal Score — our measure of current price vs. history</p>
          </div>
          <Link href="/deals" className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topDeals.map(({ product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Price Drops ────────────────────── */}
      <section aria-labelledby="drops-heading">
        <div className="flex items-center justify-between">
          <h2 id="drops-heading" className="text-2xl font-bold text-slate-900">Recent Price Drops</h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {priceDrops.map(({ product, effective, lowestOffer, drop }) => {
            const prev = effective && drop ? effective + drop.amount : null;
            return (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-300 hover:shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-14 w-14 rounded-lg object-contain bg-slate-50 flex-shrink-0"
                  width={56} height={56} loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-indigo-600">{product.brand}</p>
                  <p className="line-clamp-1 text-sm font-semibold text-slate-900">{product.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {effective && <span className="text-base font-bold text-slate-900">{formatInr(effective)}</span>}
                    {prev && <span className="text-xs text-slate-400 line-through">{formatInr(prev)}</span>}
                    {drop && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        ↓ {formatInr(drop.amount)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Best By Budget ─────────────────── */}
      <section aria-labelledby="budget-heading">
        <h2 id="budget-heading" className="text-2xl font-bold text-slate-900">Best Products By Budget</h2>
        <p className="mt-1 text-sm text-slate-500">Filter by your budget to find the best value products</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {BUDGETS.map(({ label, max }) => {
            const budgetProducts = products
              .map((p) => productWithScore(p.slug))
              .filter((x) => x.effective !== null && x.effective! <= max)
              .sort((a, b) => b.score - a.score)
              .slice(0, 1);

            if (budgetProducts.length === 0) return null;
            const { product, effective, score } = budgetProducts[0];

            return (
              <div key={max} className="flex-1 min-w-64 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 line-clamp-1">Top: {product.title}</p>
                {effective && (
                  <p className="mt-1 text-lg font-bold text-slate-900">{formatInr(effective)}</p>
                )}
                <DealScoreBadge score={score} size="sm" />
                <Link
                  href={`/search?max=${max}`}
                  className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline"
                >
                  See all {label} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Trending Products ───────────────── */}
      {trending.length > 0 && (
        <section aria-labelledby="trending-heading">
          <div className="flex items-center justify-between">
            <h2 id="trending-heading" className="text-2xl font-bold text-slate-900">🔥 Trending Now</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Popular Categories ──────────────── */}
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-2xl font-bold text-slate-900">Popular Categories</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden="true">{cat.icon}</span>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 transition">{cat.name}</span>
              <span className="text-xs text-slate-400">{cat.productCount}+ products</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ────────────────────── */}
      {newArrivals.length > 0 && (
        <section aria-labelledby="new-heading">
          <div className="flex items-center justify-between">
            <h2 id="new-heading" className="text-2xl font-bold text-slate-900">✨ New Arrivals</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Buying Guides ───────────────────── */}
      <section aria-labelledby="guides-heading">
        <div className="flex items-center justify-between">
          <h2 id="guides-heading" className="text-2xl font-bold text-slate-900">Best Buying Guides</h2>
          <span className="text-sm text-slate-500">Expert recommendations, updated regularly</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buyingGuides.map((guide) => {
            const category = categories.find((c) => c.slug === guide.categorySlug);
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {category && <span className="text-xl" aria-hidden="true">{category.icon}</span>}
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {category?.name}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition leading-snug">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{guide.intro}</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {guide.productSlugs.length} products compared
                  </span>
                  <span className="ml-auto text-xs font-semibold text-indigo-600 group-hover:underline">
                    Read guide →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Trust bar ──────────────────────── */}
      <section className="rounded-xl bg-slate-900 px-8 py-10 text-white" aria-label="Why trust DealWise">
        <h2 className="text-center text-xl font-bold">Why trust DealWise?</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "📊", title: "90-Day Price History", desc: "Track real price trends to know if a deal is actually good." },
            { icon: "🧮", title: "Effective Price", desc: "We calculate real cost including bank discounts, cashback and shipping." },
            { icon: "🎯", title: "Deal Score", desc: "Every product gets a 0–100 score based on pricing intelligence." },
            { icon: "✅", title: "Data Transparency", desc: "Every data point shows when it was last verified." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <span className="text-3xl" aria-hidden="true">{icon}</span>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
