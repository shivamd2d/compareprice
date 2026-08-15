import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/catalog";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const query = (await searchParams).q?.toLowerCase().trim() ?? "";
  const filtered = query
    ? products.filter((product) => `${product.title} ${product.brand}`.toLowerCase().includes(query))
    : products;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Search results</h1>
      <p className="mt-1 text-sm text-slate-600">{filtered.length} products matched {query ? `“${query}”` : "your query"}.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
