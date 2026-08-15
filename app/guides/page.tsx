import Link from "next/link";

const guides = [
  { slug: "how-dealmatrix-deal-score-works", title: "How DealMatrix deal score works" },
  { slug: "best-laptop-under-70000-coding-india", title: "Best laptop under ₹70,000 for coding in India" },
];

export default function GuidesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Buying guides</h1>
      <ul className="mt-4 space-y-3">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link className="text-indigo-600 hover:underline" href={`/guides/${guide.slug}`}>
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
