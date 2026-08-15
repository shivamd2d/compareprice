import assert from "node:assert/strict";
import test from "node:test";
import { getDealVerdict, getEffectivePrice, getPriceStats } from "../lib/pricing";
import type { Offer } from "../lib/catalog";

test("effective price applies all discount and fee fields", () => {
  const offer: Offer = {
    id: "o-test",
    productSlug: "x",
    merchantName: "Store",
    price: 50000,
    shippingCost: 499,
    couponDiscount: 1000,
    bankOfferDiscount: 2000,
    cashbackEstimate: 1500,
    affiliateUrl: "https://example.com",
    inStock: true,
    sellerRating: 4,
    lastChecked: new Date().toISOString(),
  };

  assert.equal(getEffectivePrice(offer), 45999);
});

test("price stats computes current low high and average", () => {
  const stats = getPriceStats([
    { productSlug: "x", recordedAt: "2025-01-01", price: 100 },
    { productSlug: "x", recordedAt: "2025-01-02", price: 90 },
    { productSlug: "x", recordedAt: "2025-01-03", price: 95 },
  ]);

  assert.deepEqual(stats, { current: 95, low: 90, high: 100, average: 95 });
});

test("deal verdict marks below average as good", () => {
  const verdict = getDealVerdict([
    { productSlug: "x", recordedAt: "2025-01-01", price: 120 },
    { productSlug: "x", recordedAt: "2025-01-02", price: 120 },
    { productSlug: "x", recordedAt: "2025-01-03", price: 100 },
  ]);

  assert.equal(verdict.badge, "🟢 Good time to buy");
});
