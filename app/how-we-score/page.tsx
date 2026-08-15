import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "How We Calculate Deal Score | DealWise",
  description: "Learn how DealWise algorithmically calculates the 0-100 Deal Score using historical price data, MSRP discounts, and store competition.",
};

export default function HowWeScorePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "How We Score" }]} />

      <header>
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">How We Calculate Deal Score</h1>
        <p className="mt-2 text-lg text-slate-600">
          Unlike platforms that show misleading "fake discounts", DealWise uses a 6-factor algorithmic score (0–100) based on verified historical price trends.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">The 6 Components of Deal Score</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { pct: "30%", title: "vs 30-Day Moving Average", desc: "Compares current price against the average price over the last 30 days." },
            { pct: "20%", title: "vs 90-Day Trend", desc: "Checks longer-term price trends to rule out temporary artificially inflated prices." },
            { pct: "20%", title: "vs All-Time Historical Low", desc: "Rewards prices that are at or near the absolute lowest recorded price in our database." },
            { pct: "15%", title: "vs Official MSRP", desc: "Measures true discount off the manufacturer's suggested retail price." },
            { pct: "10%", title: "Retailer Competition", desc: "Bonus score when multiple verified retailers compete for the lowest price." },
            { pct: "5%", title: "Stock & Availability", desc: "Ensures the item is in stock and ready to ship at the listed price." },
          ].map(({ pct, title, desc }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="inline-block rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-700">{pct} Weight</span>
              <h3 className="mt-2 text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-slate-900 p-6 text-white space-y-4">
        <h2 className="text-lg font-bold">Deal Score Tiers</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3"><span className="rounded-full bg-green-600 px-3 py-1 font-bold text-white">90 - 100</span><span>Exceptional Deal — Historic price low. Buy immediately.</span></div>
          <div className="flex items-center gap-3"><span className="rounded-full bg-emerald-600 px-3 py-1 font-bold text-white">80 - 89</span><span>Excellent Deal — Significantly lower than average price.</span></div>
          <div className="flex items-center gap-3"><span className="rounded-full bg-lime-600 px-3 py-1 font-bold text-white">70 - 79</span><span>Good Deal — Below average, fair purchase window.</span></div>
          <div className="flex items-center gap-3"><span className="rounded-full bg-amber-600 px-3 py-1 font-bold text-white">50 - 69</span><span>Fair Price — Market average price.</span></div>
          <div className="flex items-center gap-3"><span className="rounded-full bg-red-600 px-3 py-1 font-bold text-white">&lt; 50</span><span>Overpriced — Above historical average. Consider waiting.</span></div>
        </div>
      </section>
    </div>
  );
}
