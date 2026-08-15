import type { PricePoint } from "@/lib/catalog";

export function PriceHistoryChart({ points }: { points: PricePoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-slate-500">No price history yet.</p>;
  }

  const prices = points.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = Math.max(max - min, 1);

  const path = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 100 - ((point.price - min) / span) * 100;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-40 w-full rounded-lg bg-slate-100 p-2" role="img" aria-label="Price trend">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600" />
    </svg>
  );
}
