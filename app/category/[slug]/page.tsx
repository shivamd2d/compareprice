import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
  getOffersByProductSlug,
  getHistoryByProductSlug,
} from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; min?: string; max?: string; sort?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Compare Prices & Specs`,
    description: category.description,
  };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const allProducts = getProductsByCategory(slug);
  const filterBrand = sp.brand;
  const filterMin = sp.min ? parseInt(sp.min) : undefined;
  const filterMax = sp.max ? parseInt(sp.max) : undefined;
  const sortBy = sp.sort ?? "deal";

  // All brands in this category
  const brandNames = [...new Set(allProducts.map((p) => p.brand))];

  // Filter
  let filtered = allProducts.filter((p) => {
    if (filterBrand && p.brand !== filterBrand) return false;
    const productOffers = getOffersByProductSlug(p.slug);
    const lowest = getLowestEffectiveOffer(productOffers);
    const ep = lowest ? getEffectivePrice(lowest) : p.msrp;
    if (filterMin && ep < filterMin) return false;
    if (filterMax && ep > filterMax) return false;
    return true;
  });

  // Sort
  const withScores = filtered.map((p) => {
    const productOffers = getOffersByProductSlug(p.slug);
    const history = getHistoryByProductSlug(p.slug);
    const { score } = getDealScore(history, productOffers, p.msrp);
    const lowest = getLowestEffectiveOffer(productOffers);
    const ep = lowest ? getEffectivePrice(lowest) : Infinity;
    return { product: p, score, ep };
  });

  if (sortBy === "price-asc") withScores.sort((a, b) => a.ep - b.ep);
  else if (sortBy === "price-desc") withScores.sort((a, b) => b.ep - a.ep);
  else if (sortBy === "rating") withScores.sort((a, b) => b.product.rating - a.product.rating);
  else withScores.sort((a, b) => b.score - a.score); // deal score

  filtered = withScores.map((x) => x.product);

  const bestDeal = withScores[0];
  const popular = allProducts.filter((p) => p.isTrending).slice(0, 3);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 3);

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { brand: filterBrand, min: sp.min, max: sp.max, sort: sortBy, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return `/category/${slug}${qs ? `?${qs}` : ""}`;
  };

  const budgets = [
    { label: "Under ₹20K", max: "20000" },
    { label: "Under ₹30K", max: "30000" },
    { label: "Under ₹50K", max: "50000" },
    { label: "Under ₹70K", max: "70000" },
    { label: "Under ₹1L", max: "100000" },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: category.name }]} />

      {/* Category hero */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-slate-50 border border-slate-200 p-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{category.name}</h1>
            <p className="mt-1 text-slate-600">{category.description}</p>
            <p className="mt-1 text-sm text-slate-400">{allProducts.length} products tracked</p>
          </div>
        </div>
      </div>

      {/* Filters + sort bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        {/* Brand filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500 self-center">Brand:</span>
          <a
            href={buildUrl({ brand: undefined })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${!filterBrand ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            All
          </a>
          {brandNames.map((brand) => (
            <a
              key={brand}
              href={buildUrl({ brand })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${filterBrand === brand ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {brand}
            </a>
          ))}
        </div>

        {/* Budget filter */}
        <div className="flex flex-wrap gap-2 border-l border-slate-200 pl-3">
          <span className="text-xs font-semibold text-slate-500 self-center">Budget:</span>
          {budgets.map(({ label, max }) => (
            <a
              key={max}
              href={buildUrl({ max })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${filterMax?.toString() === max ? "border-amber-500 bg-amber-500 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {label}
            </a>
          ))}
          {filterMax && (
            <a href={buildUrl({ max: undefined })} className="text-xs text-red-500 hover:underline self-center">
              ✕ Clear
            </a>
          )}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Sort:</span>
          {[
            { value: "deal", label: "Best Deal" },
            { value: "price-asc", label: "Cheapest" },
            { value: "rating", label: "Highest Rated" },
          ].map(({ value, label }) => (
            <a
              key={value}
              href={buildUrl({ sort: value })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${sortBy === value ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Best deal highlight */}
      {bestDeal && !filterBrand && !filterMax && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">🏆 Editor&apos;s Top Pick</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{bestDeal.product.title}</p>
            <p className="text-sm text-slate-600">Deal Score: {bestDeal.score}/100 · Best value {category.name.toLowerCase()} right now</p>
          </div>
          <Link
            href={`/product/${bestDeal.product.slug}`}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition whitespace-nowrap"
          >
            View Details →
          </Link>
        </div>
      )}

      {/* All products grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {filtered.length} {category.name}
            {filterBrand && ` by ${filterBrand}`}
            {filterMax && ` under ₹${filterMax.toLocaleString("en-IN")}`}
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-4xl" aria-hidden="true">📦</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">No {category.name} found</h3>
            <p className="mt-1 text-sm text-slate-500">Try removing some filters.</p>
            <a href={`/category/${slug}`} className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
              Show all {category.name}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
