import assert from "node:assert/strict";
import test from "node:test";
import { getEffectivePrice, getPriceStats } from "../lib/pricing";
import { getDealScore } from "../lib/scores";
import type { Offer } from "../lib/catalog";

test("effective price applies all discount and fee fields", () => {
  const offer: Offer = {
    id: "o-test",
    productSlug: "x",
    retailerId: "r1",
    retailerName: "Store",
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
  const history = [
    { productSlug: "x", recordedAt: "2026-08-01", price: 100 },
    { productSlug: "x", recordedAt: "2026-08-02", price: 90 },
    { productSlug: "x", recordedAt: "2026-08-03", price: 95 },
  ];
  const stats = getPriceStats(history);
  assert.equal(stats?.current, 95);
  assert.equal(stats?.low, 90);
  assert.equal(stats?.high, 100);
});

test("deal score returns strong rating for low historical price", () => {
  const history = [
    { productSlug: "x", recordedAt: "2026-08-01", price: 120 },
    { productSlug: "x", recordedAt: "2026-08-02", price: 120 },
    { productSlug: "x", recordedAt: "2026-08-03", price: 90 },
  ];
  const offers: Offer[] = [{
    id: "o1", productSlug: "x", retailerId: "r1", retailerName: "Store",
    price: 90, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 0,
    cashbackEstimate: 0, affiliateUrl: "http://example.com", inStock: true,
    sellerRating: 4.5, lastChecked: new Date().toISOString(),
  }];

  const { score } = getDealScore(history, offers, 130);
  assert.ok(score >= 70, `Expected score >= 70, got ${score}`);
});
