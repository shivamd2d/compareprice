import Link from "next/link";
import { offers, products } from "@/lib/catalog";
import { formatInr, getEffectivePrice } from "@/lib/pricing";

export default function DealsPage() {
  const rows = offers
    .map((offer) => ({
      offer,
      product: products.find((product) => product.slug === offer.productSlug),
      effective: getEffectivePrice(offer),
      discount: offer.couponDiscount + offer.bankOfferDiscount + offer.cashbackEstimate,
    }))
    .filter((row) => row.product)
    .sort((a, b) => b.discount - a.discount);

  return (
    <div>
      <h1 className="text-3xl font-bold">Today&apos;s best deals</h1>
      <div className="mt-6 grid gap-3">
        {rows.map(({ offer, product, effective, discount }) => (
          <article key={offer.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-indigo-600">{offer.merchantName}</p>
            <h2 className="text-lg font-semibold">{product?.title}</h2>
            <p className="text-sm text-slate-600">Savings factors total: {formatInr(discount)}</p>
            <p className="mt-1 text-base font-semibold">Effective price: {formatInr(effective)}</p>
            <Link href={`/go/${offer.id}`} className="mt-2 inline-flex text-sm font-medium text-indigo-600">
              Go to store
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
