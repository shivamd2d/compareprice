import type { Offer, PricePoint } from "./catalog";

export const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export const getEffectivePrice = (offer: Offer) =>
  offer.price - offer.couponDiscount - offer.bankOfferDiscount - offer.cashbackEstimate + offer.shippingCost;

export const getLowestEffectiveOffer = (offerList: Offer[]) =>
  [...offerList].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))[0];

export const getPriceStats = (history: PricePoint[]) => {
  if (history.length === 0) {
    return null;
  }

  const prices = history.map((point) => point.price);
  const current = prices[prices.length - 1];
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const average = prices.reduce((sum, value) => sum + value, 0) / prices.length;
  return { current, low, high, average };
};

export const getDealVerdict = (history: PricePoint[]) => {
  const stats = getPriceStats(history);
  if (!stats) {
    return {
      badge: "⚪ Insufficient data",
      explanation: "We need more tracked prices before giving a reliable buy-now verdict.",
      score: 50,
    };
  }

  const diffFromAverage = ((stats.current - stats.average) / stats.average) * 100;

  if (diffFromAverage <= -8) {
    return {
      badge: "🟢 Good time to buy",
      explanation: `${Math.abs(diffFromAverage).toFixed(1)}% below the 7-day average tracked price.`,
      score: 90,
    };
  }

  if (diffFromAverage <= 5) {
    return {
      badge: "🟡 Average deal",
      explanation: "Current price is close to the tracked average; buy if you need it now.",
      score: 70,
    };
  }

  return {
    badge: "🔴 Wait if possible",
    explanation: `Current price is ${diffFromAverage.toFixed(1)}% above the tracked average.`,
    score: 45,
  };
};
