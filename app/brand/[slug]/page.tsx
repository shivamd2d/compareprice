import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { brands, getBrandBySlug, getProductsByBrand } from "@/lib/catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Products — Price Comparison & Deals`,
    description: `Compare prices, deals, and specifications for ${brand.name} products across Indian retailers.`,
  };
}

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const brandProducts = getProductsByBrand(slug);

  return (
    <div className="space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Brands", href: "/search" }, { label: brand.name }]} />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{brand.logo}</span>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{brand.name}</h1>
            <p className="mt-1 text-sm text-slate-500">Origin: {brand.country} · {brandProducts.length} products tracked</p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">{brand.name} Products</h2>
        {brandProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brandProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            No products found for this brand yet.
          </div>
        )}
      </section>
    </div>
  );
}
