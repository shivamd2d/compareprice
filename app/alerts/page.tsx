import type { Metadata } from "next";
import Link from "next/link";
import { products, getOffersByProductSlug } from "@/lib/catalog";
import { getEffectivePrice, getLowestEffectiveOffer, formatInr } from "@/lib/pricing";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Price Alerts",
  description: "Set price alerts for products and get notified when prices drop.",
};

type Props = {
  searchParams: Promise<{ product?: string }>;
};

// Mock alerts for demonstration
const mockAlerts = [
  { id: "a1", productSlug: "apple-iphone-16", targetPrice: 70000, alertType: "target" as const, createdAt: "2026-08-10" },
  { id: "a2", productSlug: "sony-wh1000xm5", targetPrice: 20000, alertType: "historical-low" as const, createdAt: "2026-08-12" },
];

export default async function AlertsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const preselectedSlug = sp.product ?? "";

  const alertsWithProduct = mockAlerts.map((alert) => {
    const product = products.find((p) => p.slug === alert.productSlug);
    if (!product) return null;
    const productOffers = getOffersByProductSlug(product.slug);
    const lowest = getLowestEffectiveOffer(productOffers);
    const currentPrice = lowest ? getEffectivePrice(lowest) : null;
    const triggered = currentPrice !== null && alert.alertType === "target" && currentPrice <= alert.targetPrice;
    return { alert, product, currentPrice, triggered };
  }).filter(Boolean) as NonNullable<{ alert: typeof mockAlerts[0]; product: typeof products[0]; currentPrice: number | null; triggered: boolean }>[];

  const preselectedProduct = preselectedSlug ? products.find((p) => p.slug === preselectedSlug) : null;

  return (
    <div className="space-y-8">
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Price Alerts" }]} />

      <div>
        <h1 className="text-3xl font-black text-slate-900">Price Alerts</h1>
        <p className="mt-1 text-slate-500">Get notified when products reach your target price or hit new lows.</p>
      </div>

      {/* Create alert form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Create a New Alert</h2>
        <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 mb-5 text-sm text-indigo-800">
          <span className="font-semibold">Note:</span> Sign in to receive email notifications. Alerts are saved to your account.
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="alert-product" className="block text-sm font-semibold text-slate-700 mb-1">
              Product
            </label>
            <select
              id="alert-product"
              name="product"
              defaultValue={preselectedSlug}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select a product…</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </select>
            {preselectedProduct && (
              <p className="mt-1 text-xs text-indigo-600">Pre-selected: {preselectedProduct.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Alert Type</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "target", label: "Target Price", desc: "Alert when price falls below my target", icon: "🎯" },
                { id: "any-drop", label: "Any Price Drop", desc: "Alert on any meaningful price decrease", icon: "📉" },
                { id: "historical-low", label: "Historical Low", desc: "Alert when price reaches all-time low", icon: "🏆" },
                { id: "deal-score", label: "Deal Score 80+", desc: "Alert when Deal Score is 80 or higher", icon: "⚡" },
              ].map(({ id, label, desc, icon }) => (
                <label key={id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 transition has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                  <input type="radio" name="alertType" value={id} defaultChecked={id === "target"} className="mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{icon} {label}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="target-price" className="block text-sm font-semibold text-slate-700 mb-1">
              Target Price (₹)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">₹</span>
              <input
                id="target-price"
                type="number"
                name="targetPrice"
                placeholder="e.g. 70000"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="alert-email" className="block text-sm font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="alert-email"
              type="email"
              name="email"
              placeholder="your@email.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 transition"
          >
            🔔 Create Alert
          </button>
        </form>
      </div>

      {/* Existing alerts */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Active Alerts</h2>

        {alertsWithProduct.length > 0 ? (
          <div className="space-y-3">
            {alertsWithProduct.map(({ alert, product, currentPrice, triggered }) => (
              <div
                key={alert.id}
                className={`flex items-center gap-4 rounded-xl border p-4 ${triggered ? "border-green-300 bg-green-50" : "border-slate-200 bg-white"}`}
              >
                <img src={product.image} alt={product.title} className="h-14 w-14 rounded-lg object-contain bg-slate-50 flex-shrink-0" width={56} height={56} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-indigo-600">{product.brand}</p>
                  <Link href={`/product/${product.slug}`} className="text-sm font-bold text-slate-900 hover:text-indigo-700 transition line-clamp-1">
                    {product.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-2 items-center text-xs text-slate-500">
                    {alert.alertType === "target" && (
                      <span>Target: <strong className="text-slate-800">{formatInr(alert.targetPrice)}</strong></span>
                    )}
                    {alert.alertType === "historical-low" && <span>Alert: Historical Low</span>}
                    {currentPrice && <span>Current: <strong>{formatInr(currentPrice)}</strong></span>}
                    {triggered && <span className="text-green-700 font-bold">✅ Alert triggered!</span>}
                  </div>
                </div>
                <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition flex-shrink-0" aria-label="Delete alert">
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-4xl" aria-hidden="true">🔔</p>
            <p className="mt-3 text-sm text-slate-500">No active alerts. Create one above to get notified of price drops.</p>
          </div>
        )}
      </div>
    </div>
  );
}
