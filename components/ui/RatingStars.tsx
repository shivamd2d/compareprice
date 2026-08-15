type Props = {
  rating: number; // 0–5
  reviewCount?: number;
  size?: "sm" | "md";
};

export function RatingStars({ rating, reviewCount, size = "md" }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className={`inline-flex items-center gap-1 ${size === "sm" ? "text-xs" : "text-sm"}`} aria-label={`Rating: ${rating} out of 5 stars`}>
      <span className="text-amber-400" aria-hidden="true">
        {"★".repeat(fullStars)}
        {hasHalf ? "½" : ""}
        <span className="text-slate-300">{"★".repeat(emptyStars)}</span>
      </span>
      <span className="font-semibold text-slate-800">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-slate-400">({reviewCount.toLocaleString("en-IN")})</span>
      )}
    </span>
  );
}
