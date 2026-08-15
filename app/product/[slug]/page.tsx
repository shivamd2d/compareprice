import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import type { Metadata } from "next";
import {
  products,
  getProductBySlug,
  getOffersByProductSlug,
  getHistoryByProductSlug,
  getReviewSummaryByProductSlug,
  getQAByProductSlug,
  getProductsByCategory,
} from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr, getPriceStats, getPriceDrop } from "@/lib/pricing";
import { getDealScore, getShouldBuyVerdict, getProductScoreLabel } from "@/lib/scores";
import { PriceHistoryChart } from "@/components/ui/PriceHistoryChart";
import { PriceComparisonTable } from "@/components/ui/PriceComparisonTable";
import { ReviewSummaryCard } from "@/components/ui/ReviewSummaryCard";
import { ShouldIBuyCard } from "@/components/ui/ShouldIBuyCard";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";
import { ProductScoreBadge } from "@/components/ui/ProductScoreBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { PriceTag } from "@/components/ui/PriceTag";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/ui/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const productOffers = getOffersByProductSlug(slug);
  const lowest = getLowestEffectiveOffer(productOffers);
  const price = lowest ? getEffectivePrice(lowest) : product.msrp;

  return {
    title: `${product.title} — Price, Specs & Reviews`,
    description: `Compare ${product.title} prices across Amazon, Flipkart and more. Best price: ${formatInr(price)}. Read reviews and check price history.`,
    openGraph: {
      title: product.title,
      images: [{ url: product.image }],
    },
  };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productOffers = getOffersByProductSlug(slug);
  const history = getHistoryByProductSlug(slug);
  const review = getReviewSummaryByProductSlug(slug);
  const qaEntries = getQAByProductSlug(slug);
  const lowest = getLowestEffectiveOffer(productOffers);
  const stats = getPriceStats(history);
  const drop = getPriceDrop(history);
  const { score: dealScore, label: dealLabel, color: dealColor, explanation: dealExplanation } = getDealScore(history, productOffers, product.msrp);
  const buyVerdict = getShouldBuyVerdict(history, productOffers, product.msrp);
  const { label: productScoreLabel } = getProductScoreLabel(product.productScore);

  const effectivePrice = lowest ? getEffectivePrice(lowest) : null;
  const prevPrice = stats?.avg30 && effectivePrice ? Math.round(stats.avg30) : undefined;

  // Related products (same category, different slug)
  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image,
    brand: { "@type": "Brand", name: product.brand },
    description: `${product.title} — Compare prices across Indian retailers.`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: productOffers.filter((o) => o.inStock).map((o) => ({
      "@type": "Offer",
      url: o.affiliateUrl,
      priceCurrency: "INR",
      price: getEffectivePrice(o),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: o.retailerName },
    })),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Script
        id={`product-schema-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: product.categorySlug.charAt(0).toUpperCase() + product.categorySlug.slice(1), href: `/category/${product.categorySlug}` },
          { label: product.title },
        ]}
      />

      {/* ── Product Hero ─── */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Left: Image */}
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 min-h-72">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-80 w-full object-contain"
            width={400}
            height={320}
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-4">
          {/* Brand + badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/brands/${product.brandSlug}`}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              {product.brand}
            </Link>
            {product.isNewArrival && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">New</span>
            )}
            {product.isTrending && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">🔥 Trending</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{product.title}</h1>

          {/* Rating */}
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />

          {/* Scores */}
          <div className="flex flex-wrap items-center gap-3">
            <DealScoreBadge score={dealScore} size="md" showLabel />
            <ProductScoreBadge score={product.productScore} size="md" />
          </div>

          {/* Price */}
          {effectivePrice ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-xs font-semibold text-indigo-600 mb-2">LOWEST EFFECTIVE PRICE</p>
              <PriceTag current={effectivePrice} previous={prevPrice} size="xl" />
              {drop && (
                <p className="mt-1 text-sm font-medium text-green-600">
                  ↓ {formatInr(drop.amount)} ({drop.pct.toFixed(0)}%) price drop this week
                </p>
              )}
              {lowest && (
                <p className="mt-2 text-sm text-slate-600">
                  Best price at <span className="font-semibold">{lowest.retailerName}</span>
                  {lowest.bankOfferDiscount > 0 && (
                    <span className="ml-2 text-blue-600 text-xs">(incl. {formatInr(lowest.bankOfferDiscount)} bank offer)</span>
                  )}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              Price unavailable. Check back soon.
            </div>
          )}

          {/* Deal explanation */}
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold" style={{ color: dealColor }}>
              {dealLabel}:
            </span>{" "}
            {dealExplanation}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {lowest && (
              <Link
                href={`/go/${lowest.id}`}
                className="flex-1 min-w-36 rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white transition hover:bg-indigo-700"
                rel="nofollow sponsored"
              >
                Buy at {lowest.retailerName}
              </Link>
            )}
            <Link
              href={`/compare?items=${product.slug}`}
              className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              aria-label="Compare this product"
            >
              ⚖ Compare
            </Link>
            <Link
              href={`/alerts?product=${product.slug}`}
              className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              aria-label="Set price alert"
            >
              🔔 Alert
            </Link>
            <Link
              href={`/favorites?add=${product.slug}`}
              className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-rose-50 hover:border-rose-300"
              aria-label="Add to favorites"
            >
              ♡
            </Link>
          </div>

          {/* Model number */}
          <p className="text-xs text-slate-400">Model: {product.modelNumber}</p>
        </div>
      </section>

      {/* ── Should I Buy? + Price History ─── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ShouldIBuyCard verdict={buyVerdict} />

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Price History</h2>
          <PriceHistoryChart points={history} />
        </div>
      </div>

      {/* ── Price Comparison ──────────────── */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Compare Prices Across Stores</h2>
        <PriceComparisonTable offers={productOffers} />
      </section>

      {/* ── Specifications ────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Specifications</h2>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="min-w-full text-sm" aria-label={`${product.title} specifications`}>
            <tbody>
              {Object.entries(product.specs).map(([key, value], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <th className="w-40 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {key}
                  </th>
                  <td className="px-5 py-3 text-slate-800 font-medium">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Review Summary ────────────────── */}
      {review ? (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Review Intelligence</h2>
          <ReviewSummaryCard review={review} />
        </section>
      ) : (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Review Intelligence</h2>
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">Review summary is being compiled from verified reviews.</p>
            <p className="mt-1 text-xs text-slate-400">Check back soon for a full analysis.</p>
          </div>
        </section>
      )}

      {/* ── Q&A ───────────────────────────── */}
      {qaEntries.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Questions & Answers</h2>
          <div className="space-y-3">
            {qaEntries.map((qa, i) => (
              <details
                key={i}
                className="rounded-xl border border-slate-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition list-none">
                  <span>❓ {qa.question}</span>
                  <span className="text-indigo-500 flex-shrink-0 ml-2" aria-hidden="true">▾</span>
                </summary>
                <div className="border-t border-slate-100 px-5 py-4">
                  <p className="text-sm text-slate-700">{qa.answer}</p>
                  <p className="mt-2 text-xs text-slate-400">{qa.helpful} people found this helpful</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Products ──────────────── */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Similar Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Affiliate disclosure */}
      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        ⚠ DealWise may earn a commission when you click retailer links. Prices and availability are updated regularly but may differ at checkout.
        <Link href="/how-we-track-prices" className="ml-1 underline hover:text-indigo-600">Learn how we track prices.</Link>
      </p>
    </div>
  );
}
