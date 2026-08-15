import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryProducts = products.filter((product) => product.categorySlug === slug);

  return (
    <div>
      <h1 className="text-3xl font-bold">{category.name}</h1>
      <p className="mt-2 text-sm text-slate-600">{categoryProducts.length} tracked products with live effective pricing.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
