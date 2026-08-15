import type { Metadata } from "next";
import { products, categories, brands, retailers, offers, priceHistory } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";

export const metadata: Metadata = {
  title: "Admin Dashboard | DealWise",
  description: "DealWise catalog stats, price intelligence diagnostics, and deal score monitoring.",
};

export default function AdminPage() {
  const productsWithDeals = products.map((p) => {
    const pOffers = offers.filter((o) => o.productSlug === p.slug);
    const pHistory = priceHistory.filter((ph) => ph.productSlug === p.slug);
    const deal = getDealScore(pHistory, pOffers, p.msrp);
    const lowest = getLowestEffectiveOffer(pOffers);
    const effective = lowest ? getEffectivePrice(lowest) : null;
    return { product: p, deal, offerCount: pOffers.length, effective };
  });

  const exceptionalDeals = productsWithDeals.filter((d) => d.deal.score >= 90);
  const excellentDeals = productsWithDeals.filter((d) => d.deal.score >= 80 && d.deal.score < 90);
  const goodDeals = productsWithDeals.filter((d) => d.deal.score >= 70 && d.deal.score < 80);
  const fairDeals = productsWithDeals.filter((d) => d.deal.score >= 50 && d.deal.score < 70);
  const overpricedDeals = productsWithDeals.filter((d) => d.deal.score < 50);

  const totalOffers = offers.length;
  const inStockOffers = offers.filter((o) => o.inStock).length;
  const outOfStockOffers = totalOffers - inStockOffers;

  return (
    <div className="space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Admin Dashboard" }]} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Catalog diagnostics, pricing pipeline health, and Deal Score analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Data Pipeline Active
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {[
          { label: "Products", val: products.length, icon: "📦" },
          { label: "Categories", val: categories.length, icon: "📁" },
          { label: "Brands", val: brands.length, icon: "🏷️" },
          { label: "Retailers", val: retailers.length, icon: "🏪" },
          { label: "Active Offers", val: totalOffers, icon: "💰" },
          { label: "In Stock Rate", val: `${Math.round((inStockOffers / totalOffers) * 100)}%`, icon: "✅" },
        ].map(({ label, val, icon }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xl">{icon}</span>
            <p className="mt-2 text-2xl font-black text-slate-900">{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Deal Score Distribution */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Deal Score Distribution across Catalog</h2>
        <p className="text-xs text-slate-500 mb-4">Breakdown of product catalog by algorithmic Deal Score rating.</p>

        <div className="grid gap-3 sm:grid-cols-5">
          {[
            { label: "Exceptional (90+)", count: exceptionalDeals.length, bg: "bg-green-100 border-green-300 text-green-800" },
            { label: "Excellent (80-89)", count: excellentDeals.length, bg: "bg-emerald-100 border-emerald-300 text-emerald-800" },
            { label: "Good (70-79)", count: goodDeals.length, bg: "bg-lime-100 border-lime-300 text-lime-800" },
            { label: "Fair (50-69)", count: fairDeals.length, bg: "bg-amber-100 border-amber-300 text-amber-800" },
            { label: "Overpriced (<50)", count: overpricedDeals.length, bg: "bg-red-100 border-red-300 text-red-800" },
          ].map(({ label, count, bg }) => (
            <div key={label} className={`rounded-lg border p-4 text-center ${bg}`}>
              <p className="text-2xl font-black">{count}</p>
              <p className="mt-1 text-xs font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Deal Score Health Table */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Product Deal Health Diagnostics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Product health table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">MSRP</th>
                <th className="px-4 py-3">Offers</th>
                <th className="px-4 py-3">Deal Score</th>
                <th className="px-4 py-3">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productsWithDeals.slice(0, 15).map(({ product, deal, offerCount }) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{product.title}</td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{product.categorySlug}</td>
                  <td className="px-4 py-3 text-slate-600">₹{product.msrp.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-slate-600">{offerCount} stores</td>
                  <td className="px-4 py-3 font-bold">{deal.score} / 100</td>
                  <td className="px-4 py-3">
                    <DealScoreBadge score={deal.score} size="sm" showLabel />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
