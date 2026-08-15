import { getDealLabel } from "@/lib/scores";

type Props = {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

export function DealScoreBadge({ score, size = "md", showLabel = true }: Props) {
  const { label, labelClass, color } = getDealLabel(score);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]} ${labelClass}`}
      aria-label={`Deal Score: ${score}/100 — ${label}`}
    >
      <span
        className="inline-block h-2 w-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="font-bold">{score}</span>
      {showLabel && <span className="hidden sm:inline">{label}</span>}
    </span>
  );
}
