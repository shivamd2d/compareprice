import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import {
  getHistoryByProductSlug,
  getOffersByProductSlug,
  getProductBySlug,
  getReviewSummaryByProductSlug,
} from "@/lib/catalog";
import { formatInr, getDealVerdict, getEffectivePrice, getLowestEffectiveOffer, getPriceStats } from "@/lib/pricing";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productOffers = getOffersByProductSlug(slug);
  const history = getHistoryByProductSlug(slug);
  const review = getReviewSummaryByProductSlug(slug);
  const lowest = getLowestEffectiveOffer(productOffers);
  const stats = getPriceStats(history);
  const verdict = getDealVerdict(history);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    brand: product.brand,
    aggregateOffer: {
      "@type": "AggregateOffer",
      lowPrice: lowest ? getEffectivePrice(lowest) : undefined,
      highPrice:
        productOffers.length > 0
          ? Math.max(...productOffers.map((offer) => getEffectivePrice(offer)))
          : undefined,
      priceCurrency: "INR",
      offerCount: productOffers.length,
    },
  };

  return (
    <div className="space-y-8">
      <Script
        id={`product-schema-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-indigo-600">{product.brand}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.title}</h1>
        <p className="mt-2 text-sm text-slate-600">⭐ {product.rating} ({product.reviewCount.toLocaleString("en-IN")} reviews)</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-2xl font-semibold">{lowest ? formatInr(getEffectivePrice(lowest)) : "No offers"}</p>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Deal score {verdict.score}/100</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{verdict.badge}</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">{verdict.explanation}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Favorite</button>
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">Set alert</button>
          <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium" href={`/compare?items=${product.slug}`}>
            Compare
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Merchant comparison matrix</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-4">Store</th>
                <th className="py-2 pr-4">Base</th>
                <th className="py-2 pr-4">Coupon</th>
                <th className="py-2 pr-4">Bank</th>
                <th className="py-2 pr-4">Cashback*</th>
                <th className="py-2 pr-4">Delivery</th>
                <th className="py-2 pr-4">Effective</th>
                <th className="py-2 pr-4">Rating</th>
                <th className="py-2 pr-4">Updated</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {productOffers.map((offer) => (
                <tr key={offer.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{offer.merchantName}</td>
                  <td className="py-2 pr-4">{formatInr(offer.price)}</td>
                  <td className="py-2 pr-4">-{formatInr(offer.couponDiscount)}</td>
                  <td className="py-2 pr-4">-{formatInr(offer.bankOfferDiscount)}</td>
                  <td className="py-2 pr-4">-{formatInr(offer.cashbackEstimate)}</td>
                  <td className="py-2 pr-4">{formatInr(offer.shippingCost)}</td>
                  <td className="py-2 pr-4 font-semibold">{formatInr(getEffectivePrice(offer))}</td>
                  <td className="py-2 pr-4">{offer.sellerRating}</td>
                  <td className="py-2 pr-4">{new Date(offer.lastChecked).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="py-2">
                    <Link href={`/go/${offer.id}`} className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                      Buy
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">*Cashback shown as estimated where applicable.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Price history</h2>
          <PriceHistoryChart points={history} />
          {stats ? (
            <p className="mt-3 text-sm text-slate-600">
              Current {formatInr(stats.current)} · Avg {formatInr(Math.round(stats.average))} · Low {formatInr(stats.low)} · High {formatInr(stats.high)}
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">AI review intelligence</h2>
          {review ? (
            <>
              <p className="mt-3 text-sm text-slate-700">{review.summary}</p>
              <p className="mt-3 text-sm font-medium">What buyers love</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                {review.loves.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-600">Review summary is generating from verified reviews.</p>
          )}
        </div>
      </section>
    </div>
  );
}
