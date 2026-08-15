import type { Offer, PricePoint, Product } from "./catalog";
import { getEffectivePrice, getPriceStats } from "./pricing";

// ── Deal Score ────────────────────────────────
// 0–100 score measuring how good the current price is.

export type DealScoreResult = {
  score: number;
  label: string;
  labelClass: string;
  color: string;
  explanation: string;
};

export function getDealScore(history: PricePoint[], offers: Offer[], msrp: number): DealScoreResult {
  const stats = getPriceStats(history);

  if (!stats || offers.length === 0) {
    return {
      score: 50,
      label: "Insufficient Data",
      labelClass: "deal-fair",
      color: "#d97706",
      explanation: "Not enough price history to generate a reliable score.",
    };
  }

  const lowestOffer = [...offers].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))[0];
  const current = getEffectivePrice(lowestOffer);

  // Component 1: vs 30-day average (30%)
  const diffVs30 = stats.avg30 > 0 ? (stats.avg30 - current) / stats.avg30 : 0;
  const score30 = Math.min(100, Math.max(0, 50 + diffVs30 * 500));

  // Component 2: vs 90-day average (20%)
  const diffVs90 = stats.avg90 > 0 ? (stats.avg90 - current) / stats.avg90 : 0;
  const score90 = Math.min(100, Math.max(0, 50 + diffVs90 * 400));

  // Component 3: vs all-time low (20%)
  const diffVsLow = stats.low > 0 ? (current - stats.low) / stats.low : 0;
  const scoreLow = Math.min(100, Math.max(0, 100 - diffVsLow * 500));

  // Component 4: vs MSRP — discount percentage (15%)
  const discountPct = msrp > 0 ? ((msrp - current) / msrp) : 0;
  const scoreMsrp = Math.min(100, Math.max(0, discountPct * 200));

  // Component 5: retailer competition (10%)
  const inStockOffers = offers.filter((o) => o.inStock);
  const scoreRetailers = Math.min(100, inStockOffers.length * 25);

  // Component 6: availability (5%)
  const scoreAvailability = inStockOffers.length > 0 ? 100 : 0;

  const total = Math.round(
    score30 * 0.30 +
    score90 * 0.20 +
    scoreLow * 0.20 +
    scoreMsrp * 0.15 +
    scoreRetailers * 0.10 +
    scoreAvailability * 0.05,
  );

  return { ...getDealLabel(total), score: total };
}

export function getDealLabel(score: number): Omit<DealScoreResult, "score" | "explanation"> & { explanation: string } {
  if (score >= 90) return { label: "Exceptional Deal", labelClass: "deal-exceptional", color: "#15803d", explanation: "Price is at or near its historical low. This is an excellent time to buy." };
  if (score >= 80) return { label: "Excellent Deal", labelClass: "deal-excellent", color: "#16a34a", explanation: "Price is significantly below its average. A great time to buy." };
  if (score >= 70) return { label: "Good Deal", labelClass: "deal-good", color: "#65a30d", explanation: "Price is below average. Good value right now." };
  if (score >= 50) return { label: "Fair Price", labelClass: "deal-fair", color: "#d97706", explanation: "Price is around the historical average. Acceptable but not exceptional." };
  if (score >= 30) return { label: "Overpriced", labelClass: "deal-expensive", color: "#ea580c", explanation: "Price is above the historical average. Consider waiting for a sale." };
  return { label: "Poor Deal", labelClass: "deal-poor", color: "#dc2626", explanation: "Price is well above average. This is not a good time to buy." };
}

// ── Should I Buy? ─────────────────────────────
export type BuyVerdict = {
  decision: "BUY" | "WAIT" | "CONSIDER";
  reasons: string[];
  score: number;
};

export function getShouldBuyVerdict(history: PricePoint[], offers: Offer[], msrp: number): BuyVerdict {
  const { score } = getDealScore(history, offers, msrp);
  const stats = getPriceStats(history);
  const reasons: string[] = [];

  if (!stats || offers.length === 0) {
    return { decision: "CONSIDER", reasons: ["Insufficient price data to give a reliable recommendation."], score };
  }

  const lowestOffer = [...offers].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))[0];
  const current = getEffectivePrice(lowestOffer);

  const vsAvg30 = ((stats.avg30 - current) / stats.avg30) * 100;
  const vsLow = ((current - stats.low) / stats.low) * 100;
  const inStockCount = offers.filter((o) => o.inStock).length;

  if (vsAvg30 > 5) reasons.push(`Price is ${vsAvg30.toFixed(0)}% below its 30-day average`);
  if (vsLow < 5) reasons.push("Current price is very close to the all-time low");
  if (score >= 80) reasons.push("Deal Score is strong — excellent pricing window");
  if (inStockCount >= 3) reasons.push("Multiple retailers competing — good availability");
  if (msrp > 0 && current < msrp) reasons.push(`₹${(msrp - current).toLocaleString("en-IN")} off MRP`);

  const waitReasons: string[] = [];
  if (vsAvg30 < -5) waitReasons.push(`Price is ${Math.abs(vsAvg30).toFixed(0)}% above its 30-day average`);
  if (vsLow > 15) waitReasons.push("Price is above the historical low — could drop further");
  if (score < 50) waitReasons.push("Deal Score is below average — better deals likely available");

  if (score >= 75) {
    reasons.push(...waitReasons.slice(0, 0)); // only show buy reasons
    return { decision: "BUY", reasons, score };
  }

  if (score < 50) {
    return { decision: "WAIT", reasons: waitReasons.length ? waitReasons : ["Price is not at its best. Historical data suggests waiting for a better deal."], score };
  }

  return { decision: "CONSIDER", reasons: [...reasons, ...waitReasons], score };
}

// ── Product Score ─────────────────────────────
// 0–100 quality score (independent of price)

export function getProductScore(product: Product): number {
  return product.productScore;
}

export function getProductScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Outstanding", color: "#15803d" };
  if (score >= 80) return { label: "Excellent", color: "#16a34a" };
  if (score >= 70) return { label: "Good", color: "#65a30d" };
  if (score >= 60) return { label: "Average", color: "#d97706" };
  return { label: "Below Average", color: "#dc2626" };
}
