export type Category = { id: string; name: string; slug: string };

export type Product = {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  brand: string;
  image: string;
  rating: number;
  reviewCount: number;
  specs: Record<string, string | number>;
  releasedAt: string;
};

export type Offer = {
  id: string;
  productSlug: string;
  merchantName: string;
  price: number;
  shippingCost: number;
  couponDiscount: number;
  bankOfferDiscount: number;
  cashbackEstimate: number;
  affiliateUrl: string;
  inStock: boolean;
  sellerRating: number;
  lastChecked: string;
};

export type PricePoint = {
  productSlug: string;
  recordedAt: string;
  price: number;
};

export type ReviewSummary = {
  productSlug: string;
  loves: string[];
  complaints: string[];
  aspectSentiment: Record<string, number>;
  summary: string;
};

export const categories: Category[] = [
  { id: "c1", name: "Smartphones", slug: "smartphones" },
  { id: "c2", name: "Laptops", slug: "laptops" },
  { id: "c3", name: "Televisions", slug: "televisions" },
  { id: "c4", name: "Air Conditioners", slug: "air-conditioners" },
];

export const products: Product[] = [
  {
    id: "p1",
    categorySlug: "smartphones",
    slug: "novaphone-x1-256gb",
    title: "NovaPhone X1 256GB",
    brand: "Nova",
    image: "https://placehold.co/600x400/f5f5f5/111111?text=NovaPhone+X1",
    rating: 4.4,
    reviewCount: 1231,
    specs: { processor: "Aster A9", ram: "12GB", battery: "5200mAh", display: "6.7\" OLED" },
    releasedAt: "2025-09-12",
  },
  {
    id: "p2",
    categorySlug: "smartphones",
    slug: "novaphone-x1-pro-512gb",
    title: "NovaPhone X1 Pro 512GB",
    brand: "Nova",
    image: "https://placehold.co/600x400/f5f5f5/111111?text=NovaPhone+X1+Pro",
    rating: 4.6,
    reviewCount: 845,
    specs: { processor: "Aster A10", ram: "16GB", battery: "5400mAh", display: "6.8\" LTPO" },
    releasedAt: "2025-10-01",
  },
  {
    id: "p3",
    categorySlug: "laptops",
    slug: "bytebook-air-14",
    title: "ByteBook Air 14",
    brand: "Byte",
    image: "https://placehold.co/600x400/f5f5f5/111111?text=ByteBook+Air+14",
    rating: 4.3,
    reviewCount: 930,
    specs: { cpu: "Intel Core Ultra 5", ram: "16GB", storage: "512GB SSD", weight: "1.35kg" },
    releasedAt: "2025-06-03",
  },
  {
    id: "p4",
    categorySlug: "laptops",
    slug: "codepro-15",
    title: "CodePro 15",
    brand: "CodeTek",
    image: "https://placehold.co/600x400/f5f5f5/111111?text=CodePro+15",
    rating: 4.5,
    reviewCount: 655,
    specs: { cpu: "Ryzen 7 8845HS", ram: "16GB", storage: "1TB SSD", weight: "1.58kg" },
    releasedAt: "2025-03-17",
  },
  {
    id: "p5",
    categorySlug: "televisions",
    slug: "visionmax-qled-55",
    title: "VisionMax QLED 55",
    brand: "VisionMax",
    image: "https://placehold.co/600x400/f5f5f5/111111?text=VisionMax+QLED+55",
    rating: 4.2,
    reviewCount: 410,
    specs: { panel: "QLED", resolution: "4K", refreshRate: "120Hz", audio: "40W" },
    releasedAt: "2024-11-09",
  },
  {
    id: "p6",
    categorySlug: "air-conditioners",
    slug: "coolwave-inverter-1-5t",
    title: "CoolWave Inverter 1.5T",
    brand: "CoolWave",
    image: "https://placehold.co/600x400/f5f5f5/111111?text=CoolWave+1.5T",
    rating: 4.1,
    reviewCount: 352,
    specs: { tonnage: "1.5T", energyRating: "5 Star", compressor: "Inverter", copper: "100%" },
    releasedAt: "2024-02-25",
  },
];

export const offers: Offer[] = [
  { id: "o1", productSlug: "novaphone-x1-256gb", merchantName: "Flipkart", price: 52999, shippingCost: 0, couponDiscount: 1000, bankOfferDiscount: 2500, cashbackEstimate: 1200, affiliateUrl: "https://example.com/flipkart/nova-x1", inStock: true, sellerRating: 4.4, lastChecked: "2026-08-15T07:50:00Z" },
  { id: "o2", productSlug: "novaphone-x1-256gb", merchantName: "Amazon", price: 53499, shippingCost: 0, couponDiscount: 500, bankOfferDiscount: 2000, cashbackEstimate: 0, affiliateUrl: "https://example.com/amazon/nova-x1", inStock: true, sellerRating: 4.5, lastChecked: "2026-08-15T08:01:00Z" },
  { id: "o3", productSlug: "novaphone-x1-pro-512gb", merchantName: "Croma", price: 72999, shippingCost: 99, couponDiscount: 2000, bankOfferDiscount: 3000, cashbackEstimate: 1500, affiliateUrl: "https://example.com/croma/nova-x1-pro", inStock: true, sellerRating: 4.2, lastChecked: "2026-08-15T07:57:00Z" },
  { id: "o4", productSlug: "bytebook-air-14", merchantName: "Reliance Digital", price: 64999, shippingCost: 0, couponDiscount: 1500, bankOfferDiscount: 3000, cashbackEstimate: 1200, affiliateUrl: "https://example.com/reliance/bytebook-air", inStock: true, sellerRating: 4.1, lastChecked: "2026-08-15T08:02:00Z" },
  { id: "o5", productSlug: "bytebook-air-14", merchantName: "Amazon", price: 65999, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 2500, cashbackEstimate: 900, affiliateUrl: "https://example.com/amazon/bytebook-air", inStock: true, sellerRating: 4.6, lastChecked: "2026-08-15T08:00:00Z" },
  { id: "o6", productSlug: "codepro-15", merchantName: "Vijay Sales", price: 69999, shippingCost: 199, couponDiscount: 2000, bankOfferDiscount: 3500, cashbackEstimate: 1500, affiliateUrl: "https://example.com/vs/codepro-15", inStock: true, sellerRating: 4.0, lastChecked: "2026-08-15T07:45:00Z" },
  { id: "o7", productSlug: "visionmax-qled-55", merchantName: "Flipkart", price: 49999, shippingCost: 0, couponDiscount: 1000, bankOfferDiscount: 2000, cashbackEstimate: 750, affiliateUrl: "https://example.com/flipkart/visionmax-55", inStock: true, sellerRating: 4.3, lastChecked: "2026-08-15T07:59:00Z" },
  { id: "o8", productSlug: "coolwave-inverter-1-5t", merchantName: "Croma", price: 37999, shippingCost: 499, couponDiscount: 1500, bankOfferDiscount: 2000, cashbackEstimate: 800, affiliateUrl: "https://example.com/croma/coolwave-1-5t", inStock: true, sellerRating: 4.0, lastChecked: "2026-08-15T08:05:00Z" },
];

const buildHistory = (productSlug: string, base: number) =>
  [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    productSlug,
    recordedAt: new Date(Date.now() - day * 24 * 60 * 60 * 1000).toISOString(),
    price: Math.max(base - day * 120 + ((day % 2) * 180 - 90), 1),
  }));

export const priceHistory: PricePoint[] = [
  ...buildHistory("novaphone-x1-256gb", 52999),
  ...buildHistory("novaphone-x1-pro-512gb", 72999),
  ...buildHistory("bytebook-air-14", 64999),
  ...buildHistory("codepro-15", 69999),
  ...buildHistory("visionmax-qled-55", 49999),
  ...buildHistory("coolwave-inverter-1-5t", 37999),
];

export const reviewSummaries: ReviewSummary[] = [
  {
    productSlug: "bytebook-air-14",
    loves: ["Battery life", "Keyboard quality", "Lightweight build"],
    complaints: ["Webcam in low light", "Speakers are average"],
    aspectSentiment: { battery: 91, performance: 84, display: 88, build: 89 },
    summary:
      "AI-generated: buyers appreciate all-day battery and portability for coding workloads, but media performance is just average.",
  },
  {
    productSlug: "novaphone-x1-256gb",
    loves: ["Bright display", "Smooth UI", "Fast charging"],
    complaints: ["Preinstalled apps", "Night camera consistency"],
    aspectSentiment: { battery: 87, camera: 79, performance: 90, software: 76 },
    summary:
      "AI-generated: strong everyday performance and battery backup, with mixed feedback on camera tuning in low light.",
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getOffersByProductSlug = (slug: string) =>
  offers.filter((offer) => offer.productSlug === slug);

export const getHistoryByProductSlug = (slug: string) =>
  priceHistory
    .filter((point) => point.productSlug === slug)
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));

export const getReviewSummaryByProductSlug = (slug: string) =>
  reviewSummaries.find((summary) => summary.productSlug === slug);
