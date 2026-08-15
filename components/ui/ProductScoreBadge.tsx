import { getProductScoreLabel } from "@/lib/scores";

type Props = {
  score: number;
  size?: "sm" | "md";
};

export function ProductScoreBadge({ score, size = "md" }: Props) {
  const { label, color } = getProductScoreLabel(score);
  const out10 = (score / 10).toFixed(1);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-medium ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"}`}
      style={{ borderColor: color, color }}
      aria-label={`Product Score: ${out10}/10 — ${label}`}
    >
      ★ {out10}
      {size === "md" && <span className="text-xs opacity-75 ml-0.5">/10</span>}
    </span>
  );
}
