import type { ReviewSummary } from "@/lib/catalog";

type Props = {
  review: ReviewSummary;
};

export function ReviewSummaryCard({ review }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Review Summary</h2>
        <span className="text-xs text-slate-400">{review.verifiedCount.toLocaleString("en-IN")} verified reviews</span>
      </div>

      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{review.summary}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* What users love */}
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">What users love</p>
          <ul className="mt-2 space-y-1">
            {review.loves.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                <span className="mt-0.5 text-green-500 font-bold flex-shrink-0" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What users dislike */}
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Common complaints</p>
          <ul className="mt-2 space-y-1">
            {review.complaints.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                <span className="mt-0.5 text-red-400 font-bold flex-shrink-0" aria-hidden="true">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Aspect sentiment bars */}
      {Object.keys(review.aspectSentiment).length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Aspect Ratings</p>
          <div className="space-y-2">
            {Object.entries(review.aspectSentiment)
              .sort(([, a], [, b]) => b - a)
              .map(([aspect, score]) => (
                <div key={aspect} className="flex items-center gap-3">
                  <span className="w-20 text-xs capitalize text-slate-600 text-right flex-shrink-0">{aspect}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ width: `${score}%` }}
                      role="meter"
                      aria-valuenow={score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${aspect}: ${score}/100`}
                    />
                  </div>
                  <span className="w-8 text-xs font-semibold text-slate-700">{score}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
