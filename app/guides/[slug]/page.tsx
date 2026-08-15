import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  buyingGuides,
  getGuideBySlug,
  getProductBySlug,
  getOffersByProductSlug,
  getHistoryByProductSlug,
  getCategoryBySlug,
} from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr } from "@/lib/pricing";
import { getDealScore } from "@/lib/scores";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DealScoreBadge } from "@/components/ui/DealScoreBadge";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.intro };
}

export function generateStaticParams() {
  return buyingGuides.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const category = getCategoryBySlug(guide.categorySlug);

  const guideProducts = guide.productSlugs
    .map((s) => {
      const product = getProductBySlug(s);
      if (!product) return null;
      const productOffers = getOffersByProductSlug(s);
      const history = getHistoryByProductSlug(s);
      const { score } = getDealScore(history, productOffers, product.msrp);
      const lowest = getLowestEffectiveOffer(productOffers);
      const effectivePrice = lowest ? getEffectivePrice(lowest) : null;
      return { product, score, lowest, effectivePrice };
    })
    .filter(Boolean) as Array<{ product: NonNullable<ReturnType<typeof getProductBySlug>>; score: number; lowest: ReturnType<typeof getLowestEffectiveOffer>; effectivePrice: number | null }>;

  const bestPick = [...guideProducts].sort((a, b) => b.score - a.score)[0];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best ${category?.name ?? guide.categorySlug} right now?`,
        acceptedAnswer: { "@type": "Answer", text: bestPick ? `${bestPick.product.title} is our top pick with Deal Score ${bestPick.score}/100.` : "Check our latest rankings." },
      },
    ],
  };

  return (
    <div className="space-y-8">
      <Script id={`guide-faq-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Buying Guides", href: "/guides" }, { label: guide.title }]} />

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-slate-50 p-8">
        {category && <div className="flex items-center gap-2 mb-3"><span className="text-2xl">{category.icon}</span><span className="text-sm font-semibold text-indigo-600">{category.name} Guide</span></div>}
        <h1 className="text-3xl font-black text-slate-900">{guide.title}</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">{guide.intro}</p>
        <p className="mt-2 text-xs text-slate-400">Updated: {new Date(guide.updatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })} · {guideProducts.length} products</p>
      </div>

      {bestPick && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-3">🏆 Our Top Pick</p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img src={bestPick.product.image} alt={bestPick.product.title} className="h-20 w-20 rounded-xl object-contain bg-white border border-amber-100" width={80} height={80} />
            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-900">{bestPick.product.title}</h2>
              <div className="mt-1 flex flex-wrap gap-2 items-center">
                {bestPick.effectivePrice && <span className="text-xl font-bold">{formatInr(bestPick.effectivePrice)}</span>}
                <DealScoreBadge score={bestPick.score} size="md" showLabel />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/product/${bestPick.product.slug}`} className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition text-center">View Details →</Link>
              {bestPick.lowest && <Link href={`/go/${bestPick.lowest.id}`} className="rounded-lg border border-amber-300 px-5 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition text-center" rel="nofollow sponsored">Buy Now</Link>}
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Comparison</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Product", "Price", "Rating", "Deal Score", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guideProducts.map(({ product, score, lowest, effectivePrice }, i) => (
                <tr key={product.id} className={`border-b border-slate-100 ${i === 0 ? "bg-amber-50" : "hover:bg-slate-50"}`}>
                  <td className="px-5 py-4 font-semibold">
                    {i === 0 && <span className="mr-1">🏆</span>}
                    <Link href={`/product/${product.slug}`} className="text-indigo-600 hover:underline">{product.title}</Link>
                  </td>
                  <td className="px-5 py-4">{effectivePrice ? <><span className="font-bold">{formatInr(effectivePrice)}</span>{lowest && <div className="text-xs text-slate-400">{lowest.retailerName}</div>}</> : "—"}</td>
                  <td className="px-5 py-4">⭐ {product.rating} <span className="text-xs text-slate-400">({product.reviewCount.toLocaleString("en-IN")})</span></td>
                  <td className="px-5 py-4"><DealScoreBadge score={score} size="sm" showLabel /></td>
                  <td className="px-5 py-4"><Link href={`/product/${product.slug}`} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Detailed Picks</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guideProducts.map(({ product }) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: `What is the best ${category?.name ?? ""} for most people?`, a: bestPick ? `${bestPick.product.title} is our top pick with a Deal Score of ${bestPick.score}/100 and strong user ratings.` : "Check our top pick above." },
            { q: "How often are prices updated?", a: "Prices are updated multiple times daily from Amazon, Flipkart, Croma and other retailers." },
            { q: "What is the Deal Score?", a: "Deal Score is a 0–100 score measuring how good the current price is vs. 90-day history. Score 80+ = excellent time to buy." },
          ].map(({ q, a }) => (
            <details key={q} className="rounded-lg border border-slate-100">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition list-none flex justify-between">{q}<span aria-hidden="true" className="text-slate-400">▾</span></summary>
              <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
