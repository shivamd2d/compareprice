import type { Metadata } from "next";
import Link from "next/link";
import { products, getOffersByProductSlug, getHistoryByProductSlug } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare products side-by-side by price, specs, ratings and Deal Score.",
};

type Props = {
  searchParams: Promise<{ items?: string }>;
};

export default async function ComparePage({ searchParams }: Props) {
  const slugs = ((await searchParams).items ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const compared = slugs.length > 0
    ? products.filter((p) => slugs.includes(p.slug))
    : [];

  // Get data for each product
  const productData = compared.map((product) => {
    const productOffers = getOffersByProductSlug(product.slug);
    const history = getHistoryByProductSlug(product.slug);
    const { score } = getDealScore(history, productOffers, product.msrp);
    const lowest = getLowestEffectiveOffer(productOffers);
    const effectivePrice = lowest ? getEffectivePrice(lowest) : null;
    return { product, score, lowest, effectivePrice };
  });

  // Winner: highest deal score among in-stock products
  const winner = productData.reduce<typeof productData[0] | null>((best, cur) => {
    if (!cur.lowest?.inStock) return best;
    if (!best) return cur;
    return cur.score > best.score ? cur : best;
  }, null);

  // Get all spec keys across all products
  const allSpecKeys = [...new Set(compared.flatMap((p) => Object.keys(p.specs)))];

  return (
    <div className="space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Compare" }]} />

      <div>
        <h1 className="text-3xl font-black text-slate-900">Compare Products</h1>
        <p className="mt-1 text-slate-500">Add up to 4 products to compare side-by-side.</p>
      </div>

      {/* Product picker */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900 mb-3">Add products to compare</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 12).map((p) => {
            const isSelected = slugs.includes(p.slug);
            const newSlugs = isSelected
              ? slugs.filter((s) => s !== p.slug)
              : [...slugs, p.slug].slice(0, 4);
            return (
              <Link
                key={p.slug}
                href={`/compare?items=${newSlugs.join(",")}`}
                className={`rounded-lg border px-3 py-2 text-sm transition ${isSelected ? "border-indigo-500 bg-indigo-50 font-semibold text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {isSelected ? "✓ " : ""}{p.title}
              </Link>
            );
          })}
        </div>
      </div>

      {compared.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-4xl" aria-hidden="true">⚖️</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Select products to compare</h2>
          <p className="mt-2 text-sm text-slate-500">Click products above to add them to your comparison.</p>
        </div>
      ) : (
        <>
          {/* Winner card */}
          {winner && compared.length >= 2 && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <p className="text-sm font-bold uppercase tracking-wide text-green-700">🏆 Our Recommendation</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{winner.product.title}</h2>
              <p className="mt-1 text-slate-600">
                Best overall value based on Deal Score ({winner.score}/100),
                {winner.effectivePrice && ` effective price ${formatInr(winner.effectivePrice)},`}
                and product rating ({winner.product.rating}/5).
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href={`/product/${winner.product.slug}`}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition"
                >
                  View Full Details
                </Link>
                {winner.lowest && (
                  <Link
                    href={`/go/${winner.lowest.id}`}
                    className="rounded-lg border border-green-300 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-100 transition"
                    rel="nofollow sponsored"
                  >
                    Buy at {winner.lowest.retailerName} for {winner.effectivePrice && formatInr(winner.effectivePrice)}
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm" aria-label="Product comparison">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 bg-slate-50 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 min-w-36 z-10">
                    Feature
                  </th>
                  {productData.map(({ product, score }) => (
                    <th
                      key={product.id}
                      className={`px-5 py-4 text-left min-w-44 ${winner?.product.id === product.id ? "bg-green-50" : "bg-white"}`}
                    >
                      <div>
                        {winner?.product.id === product.id && (
                          <span className="text-xs font-bold text-green-700 block mb-1">🏆 Best Choice</span>
                        )}
                        <Link href={`/product/${product.slug}`} className="font-semibold text-indigo-600 hover:underline text-sm leading-snug block">
                          {product.title}
                        </Link>
                        <DealScoreBadge score={score} size="sm" showLabel />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price row */}
                <tr className="border-b border-slate-100 bg-indigo-50">
                  <td className="sticky left-0 bg-indigo-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-indigo-700 z-10">
                    Effective Price
                  </td>
                  {productData.map(({ product, effectivePrice, lowest }) => {
                    const isWinner = winner?.product.id === product.id;
                    return (
                      <td key={product.id} className={`px-5 py-3 ${isWinner ? "bg-green-50" : ""}`}>
                        <span className={`font-bold text-base ${isWinner ? "text-green-700" : "text-slate-900"}`}>
                          {effectivePrice ? formatInr(effectivePrice) : "—"}
                        </span>
                        {lowest && <div className="text-xs text-slate-400">{lowest.retailerName}</div>}
                      </td>
                    );
                  })}
                </tr>

                {/* Rating row */}
                <tr className="border-b border-slate-100">
                  <td className="sticky left-0 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 z-10">
                    Rating
                  </td>
                  {productData.map(({ product }) => (
                    <td key={product.id} className={`px-5 py-3 ${winner?.product.id === product.id ? "bg-green-50" : ""}`}>
                      <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                    </td>
                  ))}
                </tr>

                {/* Deal Score row */}
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="sticky left-0 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 z-10">
                    Deal Score
                  </td>
                  {productData.map(({ product, score }) => (
                    <td key={product.id} className={`px-5 py-3 ${winner?.product.id === product.id ? "bg-green-50" : ""}`}>
                      <DealScoreBadge score={score} size="sm" showLabel />
                    </td>
                  ))}
                </tr>

                {/* Product Score row */}
                <tr className="border-b border-slate-100">
                  <td className="sticky left-0 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 z-10">
                    Product Score
                  </td>
                  {productData.map(({ product }) => (
                    <td key={product.id} className={`px-5 py-3 ${winner?.product.id === product.id ? "bg-green-50" : ""}`}>
                      <span className="font-bold text-slate-800">{(product.productScore / 10).toFixed(1)}</span>
                      <span className="text-xs text-slate-400">/10</span>
                    </td>
                  ))}
                </tr>

                {/* Spec rows */}
                {allSpecKeys.map((key, i) => (
                  <tr key={key} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                    <td className={`sticky left-0 px-5 py-3 text-xs font-semibold capitalize text-slate-600 z-10 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                      {key}
                    </td>
                    {productData.map(({ product }) => {
                      const val = product.specs[key];
                      const isWinner = winner?.product.id === product.id;
                      return (
                        <td key={product.id} className={`px-5 py-3 text-slate-700 ${isWinner ? "bg-green-50" : ""}`}>
                          {val !== undefined ? String(val) : <span className="text-slate-300">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Buy row */}
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="sticky left-0 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 z-10">
                    Buy
                  </td>
                  {productData.map(({ product, lowest }) => {
                    const isWinner = winner?.product.id === product.id;
                    return (
                      <td key={product.id} className={`px-5 py-3 ${isWinner ? "bg-green-50" : ""}`}>
                        {lowest ? (
                          <Link
                            href={`/go/${lowest.id}`}
                            className={`inline-block rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isWinner ? "bg-green-600 text-white hover:bg-green-700" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                            rel="nofollow sponsored"
                          >
                            Buy at {lowest.retailerName}
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">Unavailable</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Choose X if... */}
          {compared.length >= 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {productData.slice(0, 2).map(({ product, score }) => (
                <div key={product.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="font-bold text-slate-900">Choose {product.title} if…</h3>
                  <ul className="mt-3 space-y-2">
                    {product.tags.map((tag) => (
                      <li key={tag} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-indigo-500 flex-shrink-0 mt-0.5">→</span>
                        You care about <strong>{tag.replace(/-/g, " ")}</strong>
                      </li>
                    ))}
                    {score >= 75 && (
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-green-500 flex-shrink-0 mt-0.5">→</span>
                        You want the best price right now (Deal Score: {score})
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
