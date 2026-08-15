import type { Offer, PricePoint } from "./catalog";

// ── Currency formatting ───────────────────────
export const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

// ── Effective Price ───────────────────────────
export const getEffectivePrice = (offer: Offer): number =>
  offer.price
  - offer.couponDiscount
  - offer.bankOfferDiscount
  - offer.cashbackEstimate
  + offer.shippingCost;

export const getLowestEffectiveOffer = (offerList: Offer[]): Offer | undefined =>
  [...offerList].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))[0];

// ── Price Stats ───────────────────────────────
export type PriceStats = {
  current: number;
  low: number;
  high: number;
  average: number;
  avg30: number;
  avg90: number;
  low30: number;
  low90: number;
  dateLow: string;
  dateHigh: string;
};

export const getPriceStats = (history: PricePoint[]): PriceStats | null => {
  if (history.length === 0) return null;

  const prices = history.map((p) => p.price);
  const now = Date.now();

  const last30 = history.filter((p) => now - new Date(p.recordedAt).getTime() < 30 * 24 * 3600 * 1000);
  const last90 = history.filter((p) => now - new Date(p.recordedAt).getTime() < 90 * 24 * 3600 * 1000);

  const avg = (arr: number[]) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

  const current = prices[prices.length - 1];
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const average = avg(prices);
  const avg30 = avg(last30.map((p) => p.price));
  const avg90 = avg(last90.map((p) => p.price));
  const low30 = last30.length ? Math.min(...last30.map((p) => p.price)) : low;
  const low90 = last90.length ? Math.min(...last90.map((p) => p.price)) : low;

  const lowEntry = history.find((p) => p.price === low);
  const highEntry = history.find((p) => p.price === high);

  return {
    current,
    low,
    high,
    average,
    avg30,
    avg90,
    low30,
    low90,
    dateLow: lowEntry?.recordedAt ?? "",
    dateHigh: highEntry?.recordedAt ?? "",
  };
};

// ── Price Freshness ───────────────────────────
export const getPriceFreshness = (lastChecked: string): { label: string; stale: boolean } => {
  const diffMs = Date.now() - new Date(lastChecked).getTime();
  const diffMin = diffMs / 60000;

  if (diffMin < 60) return { label: `Updated ${Math.round(diffMin)}m ago`, stale: false };
  if (diffMin < 1440) return { label: `Updated ${Math.round(diffMin / 60)}h ago`, stale: false };
  if (diffMin < 2880) return { label: "Updated yesterday", stale: true };
  return { label: `Updated ${Math.round(diffMin / 1440)}d ago — price may have changed`, stale: true };
};

// ── Price drop ───────────────────────────────
export const getPriceDrop = (history: PricePoint[]): { amount: number; pct: number } | null => {
  if (history.length < 2) return null;
  const len = history.length;
  const current = history[len - 1].price;
  const week = history[Math.max(0, len - 8)].price;
  if (week <= current) return null;
  const amount = week - current;
  const pct = (amount / week) * 100;
  return { amount, pct };
};
