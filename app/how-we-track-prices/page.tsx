import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Price Tracking & Verification Methodology | DealWise",
  description: "Learn how DealWise monitors retail prices, effective price formulas (coupons + bank offers), and freshness indicators.",
};

export default function HowWeTrackPricesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Price Tracking Methodology" }]} />

      <header>
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">Price Tracking Methodology</h1>
        <p className="mt-2 text-lg text-slate-600">
          How DealWise calculates Effective Price, verifies retailer data, and ensures accuracy.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Effective Price Formula</h2>
        <p className="text-sm text-slate-600">
          The price listed on a store page is rarely what you actually pay. DealWise calculates the <strong>Effective Price</strong> using:
        </p>
        <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 font-mono text-sm text-indigo-900">
          Effective Price = Listed Price − Coupon Discounts − Instant Bank Discounts − Estimated Cashback + Shipping Costs
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Price Freshness & Update Frequencies</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <span className="text-xs font-bold uppercase text-indigo-600">Top 50 Trending</span>
            <p className="mt-1 text-lg font-bold text-slate-900">Every 15 Minutes</p>
            <p className="mt-1 text-xs text-slate-500">High-demand items (iPhone, MacBooks, flagship TVs) are checked multiple times an hour.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <span className="text-xs font-bold uppercase text-indigo-600">Standard Catalog</span>
            <p className="mt-1 text-lg font-bold text-slate-900">Every 2 Hours</p>
            <p className="mt-1 text-xs text-slate-500">Regular electronics and gadgets are refreshed throughout the day.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <span className="text-xs font-bold uppercase text-indigo-600">Sale Events</span>
            <p className="mt-1 text-lg font-bold text-slate-900">Real-Time Webhooks</p>
            <p className="mt-1 text-xs text-slate-500">During major sales, inventory and price drops are synced in near real-time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
