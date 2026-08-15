import type { Metadata } from "next";
import Link from "next/link";
import { buyingGuides, categories } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Buying Guides",
  description: "Expert buying guides to help you choose the right product. Updated regularly with current prices.",
};

export default function GuidesPage() {
  const grouped = categories
    .map((cat) => ({
      category: cat,
      guides: buyingGuides.filter((g) => g.categorySlug === cat.slug),
    }))
    .filter((g) => g.guides.length > 0);

  return (
    <div className="space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Buying Guides" }]} />

      <div>
        <h1 className="text-3xl font-black text-slate-900">Buying Guides</h1>
        <p className="mt-1 text-slate-500">Expert recommendations updated with current price data. Find the best product for your needs.</p>
      </div>

      {grouped.map(({ category, guides }) => (
        <section key={category.slug}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl" aria-hidden="true">{category.icon}</span>
            <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition leading-snug">{guide.title}</h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{guide.intro}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>{guide.productSlugs.length} products compared</span>
                  <span className="font-semibold text-indigo-600 group-hover:underline">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {buyingGuides.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-4xl" aria-hidden="true">📖</p>
          <p className="mt-3 text-sm text-slate-500">Buying guides are coming soon. Check back later!</p>
        </div>
      )}
    </div>
  );
}
