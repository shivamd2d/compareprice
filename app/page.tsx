import Link from "next/link";
import { categories, products } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-indigo-600">AI-first price intelligence for India</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Find the right product. At the right price.</h1>
        <p className="mt-3 max-w-2xl text-slate-600">DealMatrix combines real-time price tracking, effective-price math, and AI guidance so you can decide faster and buy smarter.</p>
        <form action="/search" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input name="q" placeholder="Best laptop under ₹70,000 for coding" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          <button className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700">Search</button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Popular categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 font-medium hover:border-indigo-500">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Today&apos;s best tracked deals</h2>
          <Link href="/deals" className="text-sm font-medium text-indigo-600">View all deals</Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
