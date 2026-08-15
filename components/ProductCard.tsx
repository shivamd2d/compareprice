import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { getLowestEffectiveOffer } from "@/lib/pricing";
import { formatInr } from "@/lib/pricing";
import { getOffersByProductSlug } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const lowestOffer = getLowestEffectiveOffer(getOffersByProductSlug(product.slug));

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">{product.brand}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{product.title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        ⭐ {product.rating} · {product.reviewCount.toLocaleString("en-IN")} reviews
      </p>
      <p className="mt-3 text-base font-semibold text-slate-900">
        {lowestOffer ? formatInr(lowestOffer.price) : "No active offers"}
      </p>
      <p className="text-xs text-slate-500">
        {lowestOffer ? `${lowestOffer.merchantName} effective ${formatInr(lowestOffer ? lowestOffer.price - lowestOffer.couponDiscount - lowestOffer.bankOfferDiscount - lowestOffer.cashbackEstimate + lowestOffer.shippingCost : 0)}` : ""}
      </p>
      <div className="mt-4 flex gap-2 text-sm">
        <Link href={`/product/${product.slug}`} className="rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-700">
          View product
        </Link>
        <Link href={`/compare?items=${product.slug}`} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50">
          Compare
        </Link>
      </div>
    </article>
  );
}
