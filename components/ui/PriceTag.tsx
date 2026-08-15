import { formatInr } from "@/lib/pricing";

type Props = {
  current: number;
  previous?: number;
  size?: "sm" | "md" | "lg" | "xl";
};

export function PriceTag({ current, previous, size = "md" }: Props) {
  const drop = previous && previous > current ? previous - current : 0;
  const dropPct = drop && previous ? Math.round((drop / previous) * 100) : 0;

  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className="inline-flex flex-wrap items-baseline gap-2 font-mono tabular-nums">
      <span className={`font-bold text-slate-900 ${sizeClasses[size]}`}>{formatInr(current)}</span>
      {previous && previous > current && (
        <>
          <span className="text-sm text-slate-400 line-through">{formatInr(previous)}</span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 font-sans">
            ↓ {dropPct}% · {formatInr(drop)}
          </span>
        </>
      )}
    </div>
  );
}
