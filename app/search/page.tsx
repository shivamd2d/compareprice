import type { Metadata } from "next";
import { categories, products, getOffersByProductSlug, getHistoryByProductSlug } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    min?: string;
    max?: string;
    sort?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search and compare products by name, brand, budget or specifications.",
};

// Simple natural-language parser
function parseQuery(raw: string) {
  const q = raw.toLowerCase().trim();
  const budgetMatch = q.match(/(under|below|less than|within)\s*₹?\s*([\d,]+)/i);
  const maxPrice = budgetMatch ? parseInt(budgetMatch[2].replace(/,/g, "")) : undefined;

  const ramMatch = q.match(/(\d+)\s*gb\s*ram/i);
  const minRam = ramMatch ? parseInt(ramMatch[1]) : undefined;

  const categoryMap: Record<string, string> = {
    laptop: "laptops", laptops: "laptops",
    phone: "smartphones", smartphone: "smartphones", mobile: "smartphones",
    tv: "televisions", television: "televisions",
    monitor: "monitors", display: "monitors",
    headphone: "headphones", earphone: "headphones", headset: "headphones",
    tablet: "tablets", ipad: "tablets",
    watch: "smartwatches", smartwatch: "smartwatches",
  };
  const detectedCategory = Object.entries(categoryMap).find(([kw]) => q.includes(kw))?.[1];

  return { maxPrice, minRam, detectedCategory };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const rawQuery = (sp.q ?? "").trim();
  const filterCategory = sp.category;
  const filterBrand = sp.brand;
  const filterMin = sp.min ? parseInt(sp.min) : undefined;
  const filterMax = sp.max ? parseInt(sp.max) : undefined;
  const sortBy = sp.sort ?? "relevance";

  const { maxPrice: nlpMax, minRam: nlpRam, detectedCategory } = parseQuery(rawQuery);

  // Effective max price
  const effectiveMax = filterMax ?? nlpMax;

  let filtered = products.filter((p) => {
    // Text match
    if (rawQuery) {
      const haystack = `${p.title} ${p.brand} ${p.modelNumber} ${p.categorySlug} ${p.tags.join(" ")}`.toLowerCase();
      const textMatch = rawQuery.toLowerCase().split(/\s+/).every((word) => {
        // skip filter words
        if (/under|below|₹|gb|ram/.test(word)) return true;
        return haystack.includes(word);
      });
      if (!textMatch) return false;
    }

    // Category filter
    const catFilter = filterCategory ?? detectedCategory;
    if (catFilter && p.categorySlug !== catFilter) return false;

    // Brand filter
    if (filterBrand && p.brandSlug !== filterBrand) return false;

    // Price range
    const productOffers = getOffersByProductSlug(p.slug);
    const lowest = getLowestEffectiveOffer(productOffers);
    const ep = lowest ? getEffectivePrice(lowest) : p.msrp;

    if (filterMin && ep < filterMin) return false;
    if (effectiveMax && ep > effectiveMax) return false;

    // RAM filter (NLP)
    if (nlpRam) {
      const ram = String(p.specs.ram ?? "");
      const ramNum = parseInt(ram);
      if (!isNaN(ramNum) && ramNum < nlpRam) return false;
    }

    return true;
  });

  // Sorting
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
  else if (sortBy === "deal") withScores.sort((a, b) => b.score - a.score);
  // default relevance: keep original order (text match quality)

  const finalProducts = withScores.map((x) => x.product);

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "deal", label: "Best Deal Score" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q: rawQuery, category: filterCategory, brand: filterBrand, sort: sortBy, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/search?${params.toString()}`;
  };

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {rawQuery ? `Results for "${rawQuery}"` : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {finalProducts.length} product{finalProducts.length !== 1 ? "s" : ""}
            {detectedCategory && ` in ${detectedCategory}`}
            {effectiveMax && ` under ₹${effectiveMax.toLocaleString("en-IN")}`}
          </p>
        </div>

        {/* Sort */}
        <form method="get" action="/search" className="flex items-center gap-2">
          {rawQuery && <input type="hidden" name="q" value={rawQuery} />}
          {filterCategory && <input type="hidden" name="category" value={filterCategory} />}
          <label htmlFor="sort-select" className="text-sm text-slate-600 whitespace-nowrap">Sort by:</label>
          <select
            id="sort-select"
            name="sort"
            defaultValue={sortBy}
            onChange={(e) => { (e.target as HTMLSelectElement).form?.submit(); }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </form>
      </div>

      {/* NLP interpretation banner */}
      {(detectedCategory || effectiveMax || nlpRam) && (
        <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">
          <span className="font-semibold">Interpreted as:</span>{" "}
          {detectedCategory && <span>Category: <strong>{detectedCategory}</strong>{" "}</span>}
          {effectiveMax && <span>Budget: <strong>under ₹{effectiveMax.toLocaleString("en-IN")}</strong>{" "}</span>}
          {nlpRam && <span>RAM: <strong>≥ {nlpRam}GB</strong></span>}
        </div>
      )}

      {/* Category quick filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={buildUrl({ category: undefined })}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition ${!filterCategory && !detectedCategory ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={buildUrl({ category: cat.slug })}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition ${(filterCategory ?? detectedCategory) === cat.slug ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {cat.icon} {cat.name}
          </a>
        ))}
      </div>

      {/* Results */}
      {finalProducts.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {finalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-5xl" aria-hidden="true">🔍</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">No products found</h2>
          <p className="mt-2 text-sm text-slate-500">Try a broader search or remove some filters.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <a href="/search" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              Clear all filters
            </a>
            <a href="/" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Browse homepage
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
