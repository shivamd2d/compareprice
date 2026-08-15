import type { BuyVerdict } from "@/lib/scores";

type Props = {
  verdict: BuyVerdict;
};

const decisionConfig = {
  BUY: {
    bg: "bg-green-50",
    border: "border-green-200",
    headingColor: "text-green-800",
    badgeBg: "bg-green-600",
    icon: "✓",
    iconBg: "bg-green-100 text-green-700",
  },
  WAIT: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    headingColor: "text-amber-800",
    badgeBg: "bg-amber-600",
    icon: "⏳",
    iconBg: "bg-amber-100 text-amber-700",
  },
  CONSIDER: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    headingColor: "text-slate-800",
    badgeBg: "bg-slate-600",
    icon: "?",
    iconBg: "bg-slate-100 text-slate-600",
  },
};

export function ShouldIBuyCard({ verdict }: Props) {
  const cfg = decisionConfig[verdict.decision];
  const label = { BUY: "Buy Now", WAIT: "Consider Waiting", CONSIDER: "It Depends" }[verdict.decision];

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-5`} role="region" aria-label="Buy recommendation">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Should you buy this?</h2>

      <div className="mt-3 flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${cfg.iconBg}`} aria-hidden="true">
          {cfg.icon}
        </span>
        <div>
          <p className={`text-xl font-bold ${cfg.headingColor}`}>{label}</p>
          <span className={`inline-block rounded-full ${cfg.badgeBg} px-2 py-0.5 text-xs font-semibold text-white`}>
            Deal Score: {verdict.score}/100
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {verdict.reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className={`mt-0.5 flex-shrink-0 text-xs font-bold ${cfg.headingColor}`} aria-hidden="true">
              {verdict.decision === "WAIT" ? "✗" : "✓"}
            </span>
            {reason}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-slate-400">
        Based on 90-day price history and retailer analysis. Not financial advice.
      </p>
    </div>
  );
}
