import Link from "next/link";
import { products } from "@/lib/catalog";
import { formatInr, getEffectivePrice, getLowestEffectiveOffer } from "@/lib/pricing";
import { getOffersByProductSlug } from "@/lib/catalog";

type Props = {
  searchParams: Promise<{ items?: string }>;
};

export default async function ComparePage({ searchParams }: Props) {
  const slugs = ((await searchParams).items ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  const compared = slugs.length > 0 ? products.filter((product) => slugs.includes(product.slug)) : products.slice(0, 3);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compare products</h1>
      <p className="text-sm text-slate-600">Select up to 3 products. URL query is shareable for quick collaboration.</p>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Lowest effective price</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Best for</th>
            </tr>
          </thead>
          <tbody>
            {compared.map((product) => {
              const best = getLowestEffectiveOffer(getOffersByProductSlug(product.slug));
              return (
                <tr key={product.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/product/${product.slug}`} className="text-indigo-600 hover:underline">
                      {product.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{best ? formatInr(getEffectivePrice(best)) : "NA"}</td>
                  <td className="px-4 py-3">{product.rating}</td>
                  <td className="px-4 py-3">{product.categorySlug === "laptops" ? "Coding and portability" : "Balanced daily value"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {compared.length === 2 ? (
        <Link href={`/compare/${compared[0].slug}-vs-${compared[1].slug}`} className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Open SEO comparison page
        </Link>
      ) : null}
    </div>
  );
}
