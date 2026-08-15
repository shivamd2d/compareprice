import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";

type Props = {
  params: Promise<{ comparison: string }>;
};

export default async function ComparisonSeoPage({ params }: Props) {
  const [slug1, slug2] = (await params).comparison.split("-vs-");
  const first = getProductBySlug(slug1);
  const second = getProductBySlug(slug2);

  if (!first || !second) notFound();

  return (
    <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-3xl font-bold">{first.title} vs {second.title}</h1>
      <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">AI verdict: {first.rating >= second.rating ? `${first.title} wins on all-round value.` : `${second.title} is a stronger value option.`}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {[first, second].map((product) => (
          <div key={product.slug} className="rounded-lg border border-slate-200 p-4">
            <h2 className="font-semibold">{product.title}</h2>
            <p className="text-sm text-slate-600">{product.brand} · ⭐ {product.rating}</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key}><span className="font-medium">{key}:</span> {value}</li>
              ))}
            </ul>
            <Link className="mt-4 inline-flex text-sm font-medium text-indigo-600" href={`/product/${product.slug}`}>View full analysis</Link>
          </div>
        ))}
      </div>
    </article>
  );
}
