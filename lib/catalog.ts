// ─────────────────────────────────────────────
//  DealWise — Seed Catalog  (Development Data)
//  ⚠️  SEED DATA — not real production data
// ─────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  country: string;
};

export type SpecDefinition = {
  key: string;
  label: string;
  unit?: string;
  filterable: boolean;
  sortable: boolean;
};

export type Product = {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  brand: string;
  brandSlug: string;
  modelNumber: string;
  image: string;
  rating: number;
  reviewCount: number;
  specs: Record<string, string | number>;
  releasedAt: string;
  msrp: number;
  productScore: number; // 0-100
  tags: string[];
  isTrending?: boolean;
  isNewArrival?: boolean;
};

export type Retailer = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
};

export type Offer = {
  id: string;
  productSlug: string;
  retailerId: string;
  retailerName: string;
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
  aspectSentiment: Record<string, number>; // 0-100
  summary: string;
  verifiedCount: number;
};

export type QAEntry = {
  productSlug: string;
  question: string;
  answer: string;
  helpful: number;
};

export type BuyingGuide = {
  slug: string;
  title: string;
  intro: string;
  productSlugs: string[];
  categorySlug: string;
  tags: string[];
  updatedAt: string;
};

// ── Categories ────────────────────────────────
export const categories: Category[] = [
  { id: "c1", name: "Smartphones", slug: "smartphones", icon: "📱", description: "Compare smartphones by price, camera, battery and performance.", productCount: 15 },
  { id: "c2", name: "Laptops", slug: "laptops", icon: "💻", description: "Find the best laptop for coding, gaming or everyday use.", productCount: 12 },
  { id: "c3", name: "Televisions", slug: "televisions", icon: "📺", description: "Compare 4K, OLED and QLED TVs across all screen sizes.", productCount: 8 },
  { id: "c4", name: "Monitors", slug: "monitors", icon: "🖥️", description: "Find the right monitor for work, gaming or content creation.", productCount: 6 },
  { id: "c5", name: "Headphones", slug: "headphones", icon: "🎧", description: "Compare wireless, noise-cancelling and audiophile headphones.", productCount: 7 },
  { id: "c6", name: "Tablets", slug: "tablets", icon: "📟", description: "Compare tablets for productivity, entertainment and creativity.", productCount: 5 },
  { id: "c7", name: "Smartwatches", slug: "smartwatches", icon: "⌚", description: "Find the best smartwatch for fitness, style or productivity.", productCount: 5 },
];

// ── Brands ───────────────────────────────────
export const brands: Brand[] = [
  { id: "b1", name: "Apple", slug: "apple", logo: "🍎", country: "USA" },
  { id: "b2", name: "Samsung", slug: "samsung", logo: "🇸🇦", country: "South Korea" },
  { id: "b3", name: "Dell", slug: "dell", logo: "💠", country: "USA" },
  { id: "b4", name: "HP", slug: "hp", logo: "🖨️", country: "USA" },
  { id: "b5", name: "Lenovo", slug: "lenovo", logo: "🇨🇳", country: "China" },
  { id: "b6", name: "Sony", slug: "sony", logo: "🎮", country: "Japan" },
  { id: "b7", name: "OnePlus", slug: "oneplus", logo: "1️⃣", country: "China" },
  { id: "b8", name: "boAt", slug: "boat", logo: "⚓", country: "India" },
  { id: "b9", name: "LG", slug: "lg", logo: "🎯", country: "South Korea" },
  { id: "b10", name: "ASUS", slug: "asus", logo: "🦅", country: "Taiwan" },
];

// ── Retailers ────────────────────────────────
export const retailers: Retailer[] = [
  { id: "r1", name: "Amazon", slug: "amazon", logo: "📦", website: "https://amazon.in" },
  { id: "r2", name: "Flipkart", slug: "flipkart", logo: "🛒", website: "https://flipkart.com" },
  { id: "r3", name: "Croma", slug: "croma", logo: "🏪", website: "https://croma.com" },
  { id: "r4", name: "Reliance Digital", slug: "reliance-digital", logo: "🏬", website: "https://reliancedigital.in" },
  { id: "r5", name: "Vijay Sales", slug: "vijay-sales", logo: "🏢", website: "https://vijaysales.com" },
];

// ── Products ─────────────────────────────────
export const products: Product[] = [
  // ── Smartphones ──
  {
    id: "p1", categorySlug: "smartphones", slug: "apple-iphone-16",
    title: "Apple iPhone 16", brand: "Apple", brandSlug: "apple", modelNumber: "MXXX3HN/A",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=iPhone+16",
    rating: 4.6, reviewCount: 3241, msrp: 79999, productScore: 90,
    specs: { display: '6.1" Super Retina XDR', processor: "Apple A18", ram: "8GB", storage: "128GB", battery: "3561mAh", camera: "48MP+12MP", weight: "170g", os: "iOS 18" },
    releasedAt: "2024-09-20", tags: ["flagship", "ios"], isTrending: true,
  },
  {
    id: "p2", categorySlug: "smartphones", slug: "apple-iphone-16-pro",
    title: "Apple iPhone 16 Pro", brand: "Apple", brandSlug: "apple", modelNumber: "MXVY3HN/A",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=iPhone+16+Pro",
    rating: 4.8, reviewCount: 2187, msrp: 119900, productScore: 96,
    specs: { display: '6.3" ProMotion OLED', processor: "Apple A18 Pro", ram: "8GB", storage: "256GB", battery: "3582mAh", camera: "48MP+12MP+12MP", weight: "199g", os: "iOS 18" },
    releasedAt: "2024-09-20", tags: ["flagship", "ios", "pro"], isNewArrival: false,
  },
  {
    id: "p3", categorySlug: "smartphones", slug: "samsung-galaxy-s25",
    title: "Samsung Galaxy S25", brand: "Samsung", brandSlug: "samsung", modelNumber: "SM-S931B",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Galaxy+S25",
    rating: 4.5, reviewCount: 1892, msrp: 80999, productScore: 88,
    specs: { display: '6.2" Dynamic AMOLED 2X', processor: "Snapdragon 8 Elite", ram: "12GB", storage: "256GB", battery: "4000mAh", camera: "50MP+12MP+10MP", weight: "162g", os: "Android 15" },
    releasedAt: "2025-01-22", tags: ["flagship", "android"], isTrending: true,
  },
  {
    id: "p4", categorySlug: "smartphones", slug: "samsung-galaxy-s25-ultra",
    title: "Samsung Galaxy S25 Ultra", brand: "Samsung", brandSlug: "samsung", modelNumber: "SM-S938B",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=S25+Ultra",
    rating: 4.7, reviewCount: 1203, msrp: 129999, productScore: 94,
    specs: { display: '6.9" Dynamic AMOLED 2X 120Hz', processor: "Snapdragon 8 Elite", ram: "12GB", storage: "256GB", battery: "5000mAh", camera: "200MP+50MP+10MP+50MP", weight: "218g", os: "Android 15" },
    releasedAt: "2025-01-22", tags: ["flagship", "android", "stylus"], isNewArrival: true,
  },
  {
    id: "p5", categorySlug: "smartphones", slug: "oneplus-13",
    title: "OnePlus 13", brand: "OnePlus", brandSlug: "oneplus", modelNumber: "CPH2663",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=OnePlus+13",
    rating: 4.4, reviewCount: 987, msrp: 69999, productScore: 85,
    specs: { display: '6.82" LTPO AMOLED 120Hz', processor: "Snapdragon 8 Elite", ram: "12GB", storage: "256GB", battery: "6000mAh", camera: "50MP+50MP+50MP", weight: "210g", os: "OxygenOS 15" },
    releasedAt: "2025-01-07", tags: ["value-flagship", "android", "fast-charging"],
  },
  {
    id: "p6", categorySlug: "smartphones", slug: "samsung-galaxy-a55",
    title: "Samsung Galaxy A55 5G", brand: "Samsung", brandSlug: "samsung", modelNumber: "SM-A556B",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Galaxy+A55",
    rating: 4.2, reviewCount: 2341, msrp: 39999, productScore: 74,
    specs: { display: '6.6" Super AMOLED 120Hz', processor: "Exynos 1480", ram: "8GB", storage: "128GB", battery: "5000mAh", camera: "50MP+12MP+5MP", weight: "213g", os: "Android 14" },
    releasedAt: "2024-03-11", tags: ["mid-range", "android"],
  },

  // ── Laptops ──
  {
    id: "p7", categorySlug: "laptops", slug: "dell-xps-15-9530",
    title: "Dell XPS 15 9530", brand: "Dell", brandSlug: "dell", modelNumber: "XPS15-9530-D569",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Dell+XPS+15",
    rating: 4.5, reviewCount: 876, msrp: 189999, productScore: 91,
    specs: { cpu: "Intel Core i7-13700H", ram: "16GB DDR5", storage: "512GB SSD", display: '15.6" OLED 3.5K', gpu: "RTX 4060", weight: "1.86kg", battery: "86Wh", os: "Windows 11" },
    releasedAt: "2023-06-01", tags: ["premium", "content-creation", "oled"],
  },
  {
    id: "p8", categorySlug: "laptops", slug: "lenovo-thinkpad-x1-carbon",
    title: "Lenovo ThinkPad X1 Carbon Gen 12", brand: "Lenovo", brandSlug: "lenovo", modelNumber: "21KC001AIN",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=ThinkPad+X1",
    rating: 4.6, reviewCount: 542, msrp: 169999, productScore: 92,
    specs: { cpu: "Intel Core Ultra 7 165U", ram: "16GB LPDDR5", storage: "512GB SSD", display: '14" IPS 2.8K', gpu: "Intel Arc", weight: "1.12kg", battery: "57Wh", os: "Windows 11 Pro" },
    releasedAt: "2024-02-01", tags: ["business", "ultralight", "productivity"], isNewArrival: true,
  },
  {
    id: "p9", categorySlug: "laptops", slug: "asus-rog-strix-g16",
    title: "ASUS ROG Strix G16 2024", brand: "ASUS", brandSlug: "asus", modelNumber: "G614JIR-N4047W",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=ROG+Strix+G16",
    rating: 4.4, reviewCount: 1023, msrp: 159999, productScore: 87,
    specs: { cpu: "Intel Core i9-14900HX", ram: "16GB DDR5", storage: "1TB SSD", display: '16" QHD+ 240Hz', gpu: "RTX 4070", weight: "2.5kg", battery: "90Wh", os: "Windows 11" },
    releasedAt: "2024-04-15", tags: ["gaming", "high-performance"], isTrending: true,
  },
  {
    id: "p10", categorySlug: "laptops", slug: "hp-spectre-x360-14",
    title: "HP Spectre x360 14", brand: "HP", brandSlug: "hp", modelNumber: "2V9Q8PA",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=HP+Spectre+x360",
    rating: 4.4, reviewCount: 432, msrp: 149999, productScore: 88,
    specs: { cpu: "Intel Core Ultra 7 155H", ram: "16GB LPDDR5", storage: "1TB SSD", display: '14" 2.8K OLED Touch', gpu: "Intel Arc", weight: "1.44kg", battery: "66Wh", os: "Windows 11" },
    releasedAt: "2024-03-01", tags: ["convertible", "premium", "oled"], isNewArrival: true,
  },
  {
    id: "p11", categorySlug: "laptops", slug: "lenovo-ideapad-slim-5",
    title: "Lenovo IdeaPad Slim 5 Gen 9", brand: "Lenovo", brandSlug: "lenovo", modelNumber: "83DA007AIN",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=IdeaPad+Slim+5",
    rating: 4.2, reviewCount: 2341, msrp: 69990, productScore: 78,
    specs: { cpu: "AMD Ryzen 7 8745H", ram: "16GB DDR5", storage: "512GB SSD", display: '14" IPS FHD', gpu: "AMD Radeon 780M", weight: "1.46kg", battery: "60Wh", os: "Windows 11" },
    releasedAt: "2024-06-01", tags: ["value", "everyday", "coding"],
  },
  {
    id: "p12", categorySlug: "laptops", slug: "asus-vivobook-15",
    title: "ASUS VivoBook 15 2024", brand: "ASUS", brandSlug: "asus", modelNumber: "X1504ZA-NJ322WS",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=VivoBook+15",
    rating: 4.1, reviewCount: 3112, msrp: 49990, productScore: 68,
    specs: { cpu: "Intel Core i5-1235U", ram: "8GB DDR4", storage: "512GB SSD", display: '15.6" FHD IPS', gpu: "Intel Iris Xe", weight: "1.7kg", battery: "42Wh", os: "Windows 11" },
    releasedAt: "2024-01-10", tags: ["budget", "everyday", "student"],
  },

  // ── Televisions ──
  {
    id: "p13", categorySlug: "televisions", slug: "samsung-qn90c-55",
    title: "Samsung Neo QLED 4K QN90C 55\"", brand: "Samsung", brandSlug: "samsung", modelNumber: "QA55QN90CAKLXL",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Samsung+QN90C",
    rating: 4.6, reviewCount: 891, msrp: 129900, productScore: 91,
    specs: { screen: '55"', panel: "Neo QLED", resolution: "4K UHD", refreshRate: "120Hz", hdr: "HDR10+", audio: "60W 4.2.2ch", hdmi: "4x HDMI 2.1", smart: "Tizen OS" },
    releasedAt: "2023-04-01", tags: ["neo-qled", "gaming", "premium"], isTrending: true,
  },
  {
    id: "p14", categorySlug: "televisions", slug: "lg-c3-oled-55",
    title: "LG C3 OLED 4K 55\"", brand: "LG", brandSlug: "lg", modelNumber: "OLED55C3PSA",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=LG+C3+OLED",
    rating: 4.8, reviewCount: 1234, msrp: 139900, productScore: 95,
    specs: { screen: '55"', panel: "OLED evo", resolution: "4K UHD", refreshRate: "120Hz", hdr: "Dolby Vision IQ", audio: "60W 2.2ch", hdmi: "4x HDMI 2.1", smart: "webOS 23" },
    releasedAt: "2023-05-01", tags: ["oled", "premium", "cinema"], isNewArrival: false,
  },
  {
    id: "p15", categorySlug: "televisions", slug: "sony-bravia-x90l-55",
    title: "Sony Bravia XR X90L 55\"", brand: "Sony", brandSlug: "sony", modelNumber: "XR-55X90L",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Sony+X90L",
    rating: 4.5, reviewCount: 654, msrp: 109900, productScore: 88,
    specs: { screen: '55"', panel: "Full Array LED", resolution: "4K UHD", refreshRate: "120Hz", hdr: "Dolby Vision", audio: "50W Acoustic Multi-Audio", hdmi: "4x HDMI 2.1", smart: "Google TV" },
    releasedAt: "2023-06-01", tags: ["premium", "google-tv"],
  },

  // ── Monitors ──
  {
    id: "p16", categorySlug: "monitors", slug: "dell-ultrasharp-u2723de",
    title: "Dell UltraSharp U2723DE", brand: "Dell", brandSlug: "dell", modelNumber: "U2723DE",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Dell+U2723DE",
    rating: 4.7, reviewCount: 432, msrp: 59999, productScore: 92,
    specs: { screen: '27"', panel: "IPS Black", resolution: "3840x2160 (4K)", refreshRate: "60Hz", hdr: "HDR400", ports: "USB-C 90W, HDMI 2.0, DP 1.4", weight: "7.8kg" },
    releasedAt: "2022-08-01", tags: ["professional", "4k", "usb-c"], isTrending: false,
  },
  {
    id: "p17", categorySlug: "monitors", slug: "asus-rog-swift-pg279qm",
    title: "ASUS ROG Swift PG279QM", brand: "ASUS", brandSlug: "asus", modelNumber: "PG279QM",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=ROG+Swift",
    rating: 4.5, reviewCount: 312, msrp: 74999, productScore: 87,
    specs: { screen: '27"', panel: "IPS", resolution: "2560x1440 (QHD)", refreshRate: "240Hz", hdr: "HDR600", ports: "HDMI 2.0, DP 1.4, USB 3.0", weight: "7kg" },
    releasedAt: "2021-11-01", tags: ["gaming", "240hz", "qhd"],
  },

  // ── Headphones ──
  {
    id: "p18", categorySlug: "headphones", slug: "sony-wh1000xm5",
    title: "Sony WH-1000XM5", brand: "Sony", brandSlug: "sony", modelNumber: "WH1000XM5/B",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Sony+XM5",
    rating: 4.7, reviewCount: 4231, msrp: 29990, productScore: 93,
    specs: { type: "Over-ear", driver: "30mm", anc: "Yes (8 mics)", battery: "30 hours", charging: "USB-C 3hr", codecs: "LDAC, SBC, AAC", weight: "250g", connectivity: "Bluetooth 5.2" },
    releasedAt: "2022-05-12", tags: ["noise-cancelling", "premium", "travel"], isTrending: true,
  },
  {
    id: "p19", categorySlug: "headphones", slug: "apple-airpods-pro-2",
    title: "Apple AirPods Pro 2nd Gen", brand: "Apple", brandSlug: "apple", modelNumber: "MQTP3HN/A",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=AirPods+Pro+2",
    rating: 4.6, reviewCount: 5231, msrp: 24900, productScore: 90,
    specs: { type: "In-ear TWS", driver: "Custom", anc: "Yes + Transparency", battery: "6hrs + 30hrs case", charging: "Lightning + MagSafe", codecs: "AAC", weight: "5.3g each", connectivity: "Bluetooth 5.3" },
    releasedAt: "2022-09-23", tags: ["earbuds", "ios", "anc"], isTrending: true,
  },
  {
    id: "p20", categorySlug: "headphones", slug: "boat-rockerz-550",
    title: "boAt Rockerz 550", brand: "boAt", brandSlug: "boat", modelNumber: "ROCKERZ550PRO",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=boAt+Rockerz+550",
    rating: 3.9, reviewCount: 8921, msrp: 2990, productScore: 55,
    specs: { type: "Over-ear", driver: "50mm", anc: "No", battery: "20 hours", charging: "Micro-USB 2hr", codecs: "SBC", weight: "262g", connectivity: "Bluetooth 5.0" },
    releasedAt: "2021-01-01", tags: ["budget", "bass"],
  },

  // ── Tablets ──
  {
    id: "p21", categorySlug: "tablets", slug: "apple-ipad-air-m2",
    title: "Apple iPad Air 11\" M2", brand: "Apple", brandSlug: "apple", modelNumber: "MUWF3HN/A",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=iPad+Air+M2",
    rating: 4.7, reviewCount: 1231, msrp: 74900, productScore: 92,
    specs: { display: '11" Liquid Retina', processor: "Apple M2", ram: "8GB", storage: "128GB", battery: "28.65Wh", camera: "12MP rear", weight: "462g", os: "iPadOS 17" },
    releasedAt: "2024-03-08", tags: ["premium", "creative", "ios"], isNewArrival: true, isTrending: true,
  },
  {
    id: "p22", categorySlug: "tablets", slug: "samsung-galaxy-tab-s9",
    title: "Samsung Galaxy Tab S9", brand: "Samsung", brandSlug: "samsung", modelNumber: "SM-X710NZAAINS",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Galaxy+Tab+S9",
    rating: 4.5, reviewCount: 876, msrp: 72999, productScore: 88,
    specs: { display: '11" Dynamic AMOLED 120Hz', processor: "Snapdragon 8 Gen 2", ram: "8GB", storage: "128GB", battery: "8400mAh", camera: "13MP rear", weight: "498g", os: "Android 13" },
    releasedAt: "2023-08-11", tags: ["premium", "android", "stylus"],
  },

  // ── Smartwatches ──
  {
    id: "p23", categorySlug: "smartwatches", slug: "apple-watch-series-10",
    title: "Apple Watch Series 10", brand: "Apple", brandSlug: "apple", modelNumber: "MYE13HN/A",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Watch+Series+10",
    rating: 4.6, reviewCount: 1893, msrp: 46900, productScore: 92,
    specs: { display: '46mm LTPO OLED', processor: "S10", battery: "18 hours", health: "ECG, Blood Oxygen, Crash Detection", gps: "Yes", water: "50m", os: "watchOS 11" },
    releasedAt: "2024-09-20", tags: ["premium", "health", "ios"], isNewArrival: true,
  },
  {
    id: "p24", categorySlug: "smartwatches", slug: "samsung-galaxy-watch-7",
    title: "Samsung Galaxy Watch 7 44mm", brand: "Samsung", brandSlug: "samsung", modelNumber: "SM-L315FZSAINS",
    image: "https://placehold.co/600x600/f5f5f5/111111?text=Galaxy+Watch+7",
    rating: 4.4, reviewCount: 987, msrp: 34999, productScore: 86,
    specs: { display: "44mm AMOLED", processor: "Exynos W1000", battery: "40 hours", health: "BioActive Sensor 3-in-1", gps: "Yes", water: "50m ATM", os: "Wear OS 5" },
    releasedAt: "2024-07-10", tags: ["premium", "health", "android"], isTrending: true,
  },
];

// ── Price History Generator (90 days) ─────────
const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;

function buildHistory(slug: string, basePrice: number, days = 90): PricePoint[] {
  return Array.from({ length: days }, (_, i) => {
    const daysAgo = days - i;
    // Simulate realistic price fluctuations
    const volatility = basePrice * 0.06;
    const trend = -basePrice * 0.03 * (i / days); // slight downward trend
    const noise = (Math.sin(i * 2.3) + Math.cos(i * 1.7)) * volatility * 0.5;
    const weekend = (i % 7 < 2) ? -basePrice * 0.015 : 0; // weekend dips
    const sale = (i === 45 || i === 60 || i === 75) ? -basePrice * 0.08 : 0;
    const price = Math.max(Math.round(basePrice + trend + noise + weekend + sale), Math.round(basePrice * 0.75));
    return {
      productSlug: slug,
      recordedAt: new Date(now - daysAgo * DAY).toISOString(),
      price,
    };
  });
}

export const priceHistory: PricePoint[] = [
  ...buildHistory("apple-iphone-16", 79999),
  ...buildHistory("apple-iphone-16-pro", 119900),
  ...buildHistory("samsung-galaxy-s25", 80999),
  ...buildHistory("samsung-galaxy-s25-ultra", 129999),
  ...buildHistory("oneplus-13", 69999),
  ...buildHistory("samsung-galaxy-a55", 39999),
  ...buildHistory("dell-xps-15-9530", 189999),
  ...buildHistory("lenovo-thinkpad-x1-carbon", 169999),
  ...buildHistory("asus-rog-strix-g16", 159999),
  ...buildHistory("hp-spectre-x360-14", 149999),
  ...buildHistory("lenovo-ideapad-slim-5", 69990),
  ...buildHistory("asus-vivobook-15", 49990),
  ...buildHistory("samsung-qn90c-55", 129900),
  ...buildHistory("lg-c3-oled-55", 139900),
  ...buildHistory("sony-bravia-x90l-55", 109900),
  ...buildHistory("dell-ultrasharp-u2723de", 59999),
  ...buildHistory("asus-rog-swift-pg279qm", 74999),
  ...buildHistory("sony-wh1000xm5", 29990),
  ...buildHistory("apple-airpods-pro-2", 24900),
  ...buildHistory("boat-rockerz-550", 2990),
  ...buildHistory("apple-ipad-air-m2", 74900),
  ...buildHistory("samsung-galaxy-tab-s9", 72999),
  ...buildHistory("apple-watch-series-10", 46900),
  ...buildHistory("samsung-galaxy-watch-7", 34999),
];

// ── Offers ───────────────────────────────────
export const offers: Offer[] = [
  // iPhone 16
  { id: "o1", productSlug: "apple-iphone-16", retailerId: "r1", retailerName: "Amazon", price: 79999, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 3000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.7, lastChecked: new Date(now - 15 * 60000).toISOString() },
  { id: "o2", productSlug: "apple-iphone-16", retailerId: "r2", retailerName: "Flipkart", price: 79999, shippingCost: 0, couponDiscount: 2000, bankOfferDiscount: 2500, cashbackEstimate: 1200, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 22 * 60000).toISOString() },
  { id: "o3", productSlug: "apple-iphone-16", retailerId: "r3", retailerName: "Croma", price: 81999, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 2000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 45 * 60000).toISOString() },
  { id: "o4", productSlug: "apple-iphone-16", retailerId: "r4", retailerName: "Reliance Digital", price: 79999, shippingCost: 0, couponDiscount: 1500, bankOfferDiscount: 2500, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.2, lastChecked: new Date(now - 60 * 60000).toISOString() },

  // iPhone 16 Pro
  { id: "o5", productSlug: "apple-iphone-16-pro", retailerId: "r1", retailerName: "Amazon", price: 119900, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 5000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.7, lastChecked: new Date(now - 18 * 60000).toISOString() },
  { id: "o6", productSlug: "apple-iphone-16-pro", retailerId: "r2", retailerName: "Flipkart", price: 119900, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 4000, cashbackEstimate: 2000, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 25 * 60000).toISOString() },

  // Galaxy S25
  { id: "o7", productSlug: "samsung-galaxy-s25", retailerId: "r1", retailerName: "Amazon", price: 80999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 3000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.6, lastChecked: new Date(now - 10 * 60000).toISOString() },
  { id: "o8", productSlug: "samsung-galaxy-s25", retailerId: "r2", retailerName: "Flipkart", price: 79999, shippingCost: 0, couponDiscount: 2500, bankOfferDiscount: 2000, cashbackEstimate: 1000, affiliateUrl: "#", inStock: true, sellerRating: 4.4, lastChecked: new Date(now - 20 * 60000).toISOString() },
  { id: "o9", productSlug: "samsung-galaxy-s25", retailerId: "r3", retailerName: "Croma", price: 82999, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 2000, cashbackEstimate: 0, affiliateUrl: "#", inStock: false, sellerRating: 4.1, lastChecked: new Date(now - 120 * 60000).toISOString() },

  // Galaxy S25 Ultra
  { id: "o10", productSlug: "samsung-galaxy-s25-ultra", retailerId: "r1", retailerName: "Amazon", price: 129999, shippingCost: 0, couponDiscount: 5000, bankOfferDiscount: 5000, cashbackEstimate: 2500, affiliateUrl: "#", inStock: true, sellerRating: 4.7, lastChecked: new Date(now - 12 * 60000).toISOString() },
  { id: "o11", productSlug: "samsung-galaxy-s25-ultra", retailerId: "r2", retailerName: "Flipkart", price: 128999, shippingCost: 0, couponDiscount: 4000, bankOfferDiscount: 4000, cashbackEstimate: 2000, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 15 * 60000).toISOString() },

  // OnePlus 13
  { id: "o12", productSlug: "oneplus-13", retailerId: "r1", retailerName: "Amazon", price: 69999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 3000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 30 * 60000).toISOString() },
  { id: "o13", productSlug: "oneplus-13", retailerId: "r2", retailerName: "Flipkart", price: 68999, shippingCost: 0, couponDiscount: 2500, bankOfferDiscount: 2500, cashbackEstimate: 1000, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 40 * 60000).toISOString() },

  // Galaxy A55
  { id: "o14", productSlug: "samsung-galaxy-a55", retailerId: "r1", retailerName: "Amazon", price: 38999, shippingCost: 0, couponDiscount: 1500, bankOfferDiscount: 2000, cashbackEstimate: 500, affiliateUrl: "#", inStock: true, sellerRating: 4.4, lastChecked: new Date(now - 8 * 60000).toISOString() },
  { id: "o15", productSlug: "samsung-galaxy-a55", retailerId: "r2", retailerName: "Flipkart", price: 37999, shippingCost: 0, couponDiscount: 1000, bankOfferDiscount: 1500, cashbackEstimate: 500, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 11 * 60000).toISOString() },

  // Dell XPS 15
  { id: "o16", productSlug: "dell-xps-15-9530", retailerId: "r1", retailerName: "Amazon", price: 179999, shippingCost: 0, couponDiscount: 5000, bankOfferDiscount: 7000, cashbackEstimate: 2000, affiliateUrl: "#", inStock: true, sellerRating: 4.6, lastChecked: new Date(now - 22 * 60000).toISOString() },
  { id: "o17", productSlug: "dell-xps-15-9530", retailerId: "r4", retailerName: "Reliance Digital", price: 184999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 5000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.1, lastChecked: new Date(now - 90 * 60000).toISOString() },

  // ThinkPad X1
  { id: "o18", productSlug: "lenovo-thinkpad-x1-carbon", retailerId: "r1", retailerName: "Amazon", price: 164999, shippingCost: 0, couponDiscount: 5000, bankOfferDiscount: 7000, cashbackEstimate: 2000, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 35 * 60000).toISOString() },
  { id: "o19", productSlug: "lenovo-thinkpad-x1-carbon", retailerId: "r2", retailerName: "Flipkart", price: 162999, shippingCost: 0, couponDiscount: 4000, bankOfferDiscount: 6000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.4, lastChecked: new Date(now - 50 * 60000).toISOString() },

  // ROG Strix G16
  { id: "o20", productSlug: "asus-rog-strix-g16", retailerId: "r1", retailerName: "Amazon", price: 154999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 5000, cashbackEstimate: 2000, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 25 * 60000).toISOString() },
  { id: "o21", productSlug: "asus-rog-strix-g16", retailerId: "r2", retailerName: "Flipkart", price: 152999, shippingCost: 0, couponDiscount: 2500, bankOfferDiscount: 4000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 40 * 60000).toISOString() },

  // HP Spectre
  { id: "o22", productSlug: "hp-spectre-x360-14", retailerId: "r1", retailerName: "Amazon", price: 144999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 5000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.4, lastChecked: new Date(now - 60 * 60000).toISOString() },

  // Lenovo IdeaPad Slim 5
  { id: "o23", productSlug: "lenovo-ideapad-slim-5", retailerId: "r1", retailerName: "Amazon", price: 64999, shippingCost: 0, couponDiscount: 2000, bankOfferDiscount: 3000, cashbackEstimate: 1000, affiliateUrl: "#", inStock: true, sellerRating: 4.4, lastChecked: new Date(now - 14 * 60000).toISOString() },
  { id: "o24", productSlug: "lenovo-ideapad-slim-5", retailerId: "r2", retailerName: "Flipkart", price: 63499, shippingCost: 0, couponDiscount: 1500, bankOfferDiscount: 2500, cashbackEstimate: 800, affiliateUrl: "#", inStock: true, sellerRating: 4.2, lastChecked: new Date(now - 20 * 60000).toISOString() },
  { id: "o25", productSlug: "lenovo-ideapad-slim-5", retailerId: "r5", retailerName: "Vijay Sales", price: 67999, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 2000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.0, lastChecked: new Date(now - 180 * 60000).toISOString() },

  // VivoBook 15
  { id: "o26", productSlug: "asus-vivobook-15", retailerId: "r1", retailerName: "Amazon", price: 45999, shippingCost: 0, couponDiscount: 1000, bankOfferDiscount: 1500, cashbackEstimate: 500, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 11 * 60000).toISOString() },
  { id: "o27", productSlug: "asus-vivobook-15", retailerId: "r2", retailerName: "Flipkart", price: 44999, shippingCost: 0, couponDiscount: 500, bankOfferDiscount: 1000, cashbackEstimate: 300, affiliateUrl: "#", inStock: true, sellerRating: 4.1, lastChecked: new Date(now - 18 * 60000).toISOString() },

  // Samsung QN90C
  { id: "o28", productSlug: "samsung-qn90c-55", retailerId: "r1", retailerName: "Amazon", price: 119900, shippingCost: 0, couponDiscount: 5000, bankOfferDiscount: 5000, cashbackEstimate: 2000, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 30 * 60000).toISOString() },
  { id: "o29", productSlug: "samsung-qn90c-55", retailerId: "r2", retailerName: "Flipkart", price: 117999, shippingCost: 0, couponDiscount: 4000, bankOfferDiscount: 4000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 45 * 60000).toISOString() },

  // LG C3 OLED
  { id: "o30", productSlug: "lg-c3-oled-55", retailerId: "r1", retailerName: "Amazon", price: 129900, shippingCost: 0, couponDiscount: 5000, bankOfferDiscount: 6000, cashbackEstimate: 2500, affiliateUrl: "#", inStock: true, sellerRating: 4.6, lastChecked: new Date(now - 20 * 60000).toISOString() },
  { id: "o31", productSlug: "lg-c3-oled-55", retailerId: "r3", retailerName: "Croma", price: 132999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 5000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.2, lastChecked: new Date(now - 90 * 60000).toISOString() },

  // Sony Bravia X90L
  { id: "o32", productSlug: "sony-bravia-x90l-55", retailerId: "r1", retailerName: "Amazon", price: 104999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 4000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 15 * 60000).toISOString() },

  // Dell UltraSharp
  { id: "o33", productSlug: "dell-ultrasharp-u2723de", retailerId: "r1", retailerName: "Amazon", price: 54999, shippingCost: 0, couponDiscount: 2000, bankOfferDiscount: 2500, cashbackEstimate: 1000, affiliateUrl: "#", inStock: true, sellerRating: 4.6, lastChecked: new Date(now - 25 * 60000).toISOString() },

  // ROG Swift
  { id: "o34", productSlug: "asus-rog-swift-pg279qm", retailerId: "r1", retailerName: "Amazon", price: 69999, shippingCost: 0, couponDiscount: 2000, bankOfferDiscount: 3000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.4, lastChecked: new Date(now - 35 * 60000).toISOString() },

  // Sony WH-1000XM5
  { id: "o35", productSlug: "sony-wh1000xm5", retailerId: "r1", retailerName: "Amazon", price: 24990, shippingCost: 0, couponDiscount: 1000, bankOfferDiscount: 1500, cashbackEstimate: 500, affiliateUrl: "#", inStock: true, sellerRating: 4.7, lastChecked: new Date(now - 8 * 60000).toISOString() },
  { id: "o36", productSlug: "sony-wh1000xm5", retailerId: "r2", retailerName: "Flipkart", price: 23990, shippingCost: 0, couponDiscount: 1500, bankOfferDiscount: 1000, cashbackEstimate: 500, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 12 * 60000).toISOString() },
  { id: "o37", productSlug: "sony-wh1000xm5", retailerId: "r3", retailerName: "Croma", price: 25999, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 1000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.1, lastChecked: new Date(now - 180 * 60000).toISOString() },

  // AirPods Pro 2
  { id: "o38", productSlug: "apple-airpods-pro-2", retailerId: "r1", retailerName: "Amazon", price: 24900, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 1500, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.7, lastChecked: new Date(now - 5 * 60000).toISOString() },
  { id: "o39", productSlug: "apple-airpods-pro-2", retailerId: "r2", retailerName: "Flipkart", price: 24900, shippingCost: 0, couponDiscount: 1000, bankOfferDiscount: 1500, cashbackEstimate: 600, affiliateUrl: "#", inStock: true, sellerRating: 4.4, lastChecked: new Date(now - 15 * 60000).toISOString() },

  // boAt Rockerz 550
  { id: "o40", productSlug: "boat-rockerz-550", retailerId: "r1", retailerName: "Amazon", price: 1699, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 0, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 3.9, lastChecked: new Date(now - 30 * 60000).toISOString() },
  { id: "o41", productSlug: "boat-rockerz-550", retailerId: "r2", retailerName: "Flipkart", price: 1499, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 0, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 3.8, lastChecked: new Date(now - 40 * 60000).toISOString() },

  // iPad Air M2
  { id: "o42", productSlug: "apple-ipad-air-m2", retailerId: "r1", retailerName: "Amazon", price: 74900, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 3000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.7, lastChecked: new Date(now - 10 * 60000).toISOString() },
  { id: "o43", productSlug: "apple-ipad-air-m2", retailerId: "r2", retailerName: "Flipkart", price: 74900, shippingCost: 0, couponDiscount: 2000, bankOfferDiscount: 2500, cashbackEstimate: 1000, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 20 * 60000).toISOString() },

  // Galaxy Tab S9
  { id: "o44", productSlug: "samsung-galaxy-tab-s9", retailerId: "r1", retailerName: "Amazon", price: 69999, shippingCost: 0, couponDiscount: 3000, bankOfferDiscount: 3000, cashbackEstimate: 1500, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 25 * 60000).toISOString() },
  { id: "o45", productSlug: "samsung-galaxy-tab-s9", retailerId: "r2", retailerName: "Flipkart", price: 68999, shippingCost: 0, couponDiscount: 2500, bankOfferDiscount: 2500, cashbackEstimate: 1000, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 35 * 60000).toISOString() },

  // Apple Watch Series 10
  { id: "o46", productSlug: "apple-watch-series-10", retailerId: "r1", retailerName: "Amazon", price: 46900, shippingCost: 0, couponDiscount: 0, bankOfferDiscount: 2000, cashbackEstimate: 0, affiliateUrl: "#", inStock: true, sellerRating: 4.7, lastChecked: new Date(now - 7 * 60000).toISOString() },
  { id: "o47", productSlug: "apple-watch-series-10", retailerId: "r2", retailerName: "Flipkart", price: 46900, shippingCost: 0, couponDiscount: 1500, bankOfferDiscount: 2000, cashbackEstimate: 800, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 18 * 60000).toISOString() },

  // Galaxy Watch 7
  { id: "o48", productSlug: "samsung-galaxy-watch-7", retailerId: "r1", retailerName: "Amazon", price: 33999, shippingCost: 0, couponDiscount: 1500, bankOfferDiscount: 2000, cashbackEstimate: 500, affiliateUrl: "#", inStock: true, sellerRating: 4.5, lastChecked: new Date(now - 9 * 60000).toISOString() },
  { id: "o49", productSlug: "samsung-galaxy-watch-7", retailerId: "r2", retailerName: "Flipkart", price: 32999, shippingCost: 0, couponDiscount: 1000, bankOfferDiscount: 1500, cashbackEstimate: 500, affiliateUrl: "#", inStock: true, sellerRating: 4.3, lastChecked: new Date(now - 16 * 60000).toISOString() },
];

// ── Review Summaries ─────────────────────────
export const reviewSummaries: ReviewSummary[] = [
  {
    productSlug: "apple-iphone-16",
    loves: ["Camera quality", "iOS ecosystem", "Smooth performance", "Long software support"],
    complaints: ["Price", "No USB-C fast charging", "Battery life average"],
    aspectSentiment: { camera: 91, performance: 94, battery: 72, software: 96, display: 90, build: 93 },
    summary: "Buyers love the photography improvements and rock-solid performance. The main gripes are battery life and the still-high price tag.",
    verifiedCount: 2341,
  },
  {
    productSlug: "sony-wh1000xm5",
    loves: ["Best-in-class ANC", "Sound quality", "Comfortable for long wear", "Long battery life"],
    complaints: ["No 3.5mm jack", "Call quality average", "Folding mechanism"],
    aspectSentiment: { anc: 96, sound: 93, comfort: 89, battery: 91, calls: 74, build: 84 },
    summary: "The gold standard for noise-cancelling headphones. Exceptional ANC and sound quality, though the call quality disappoints some buyers.",
    verifiedCount: 3214,
  },
  {
    productSlug: "lenovo-ideapad-slim-5",
    loves: ["Value for money", "Fast AMD performance", "Thin and light", "Good keyboard"],
    complaints: ["Display brightness", "Average speakers", "Plastic build feel"],
    aspectSentiment: { performance: 84, display: 72, battery: 80, build: 68, keyboard: 86, value: 91 },
    summary: "A solid everyday laptop at a fair price. The AMD chip delivers strong performance but the display and speakers disappoint at this price.",
    verifiedCount: 1876,
  },
  {
    productSlug: "samsung-galaxy-s25",
    loves: ["Compact flagship", "Excellent camera", "Bright display", "Clean software"],
    complaints: ["Battery life", "Gets warm under load", "No charger in box"],
    aspectSentiment: { camera: 89, display: 92, performance: 90, battery: 74, software: 86, build: 91 },
    summary: "A refined flagship with excellent cameras and display. Battery life remains its Achilles heel for power users.",
    verifiedCount: 1432,
  },
  {
    productSlug: "lg-c3-oled-55",
    loves: ["Perfect blacks", "Gaming performance", "Thin design", "Webos interface"],
    complaints: ["Brightness in bright rooms", "Screen burn-in risk", "Price"],
    aspectSentiment: { picture: 97, gaming: 95, design: 92, brightness: 76, sound: 79, software: 88 },
    summary: "Widely regarded as the best TV for most people. The OLED picture quality is stunning, though bright room performance trails LCD competitors.",
    verifiedCount: 987,
  },
];

// ── Q&A ──────────────────────────────────────
export const qaEntries: QAEntry[] = [
  { productSlug: "apple-iphone-16", question: "Does iPhone 16 support 5G in India?", answer: "Yes, the iPhone 16 supports 5G on Indian networks including Jio and Airtel.", helpful: 234 },
  { productSlug: "apple-iphone-16", question: "Is the charger included in the box?", answer: "No, Apple no longer includes a charger. You get only a USB-C cable.", helpful: 189 },
  { productSlug: "lenovo-ideapad-slim-5", question: "Can RAM be upgraded?", answer: "The RAM is soldered and cannot be upgraded. Buy the 16GB version upfront.", helpful: 312 },
  { productSlug: "lenovo-ideapad-slim-5", question: "Is this good for Java development?", answer: "Yes, the Ryzen 7 handles IntelliJ IDEA and Spring Boot builds comfortably.", helpful: 156 },
  { productSlug: "sony-wh1000xm5", question: "Can you use them wired?", answer: "Yes, a 3.5mm to USB-C cable is included for wired use when battery is low.", helpful: 287 },
  { productSlug: "samsung-galaxy-s25", question: "Does it have a headphone jack?", answer: "No, the Galaxy S25 does not have a 3.5mm headphone jack.", helpful: 198 },
];

// ── Buying Guides ────────────────────────────
export const buyingGuides: BuyingGuide[] = [
  {
    slug: "best-laptops-under-70000",
    title: "Best Laptops Under ₹70,000 in 2026",
    intro: "Looking for the best laptop under ₹70,000? We've tested and ranked the top options for coding, everyday use and light gaming.",
    productSlugs: ["lenovo-ideapad-slim-5", "asus-vivobook-15", "asus-rog-strix-g16"],
    categorySlug: "laptops",
    tags: ["budget", "value", "under-70k"],
    updatedAt: "2026-08-01",
  },
  {
    slug: "best-smartphones-under-30000",
    title: "Best Smartphones Under ₹30,000 in 2026",
    intro: "India's best mid-range smartphones compared. We rank by camera, battery, performance and value.",
    productSlugs: ["samsung-galaxy-a55", "oneplus-13"],
    categorySlug: "smartphones",
    tags: ["mid-range", "value", "under-30k"],
    updatedAt: "2026-08-01",
  },
  {
    slug: "best-noise-cancelling-headphones",
    title: "Best Noise Cancelling Headphones in India 2026",
    intro: "We've ranked the top ANC headphones for travel, work from home and commuters.",
    productSlugs: ["sony-wh1000xm5", "apple-airpods-pro-2"],
    categorySlug: "headphones",
    tags: ["anc", "travel", "premium"],
    updatedAt: "2026-08-01",
  },
];

// ── Lookup helpers ───────────────────────────
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const getBrandBySlug = (slug: string) => brands.find((b) => b.slug === slug);
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (slug: string) => products.filter((p) => p.categorySlug === slug);
export const getProductsByBrand = (slug: string) => products.filter((p) => p.brandSlug === slug);
export const getOffersByProductSlug = (slug: string) => offers.filter((o) => o.productSlug === slug);
export const getHistoryByProductSlug = (slug: string) =>
  priceHistory
    .filter((p) => p.productSlug === slug)
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
export const getReviewSummaryByProductSlug = (slug: string) => reviewSummaries.find((r) => r.productSlug === slug);
export const getQAByProductSlug = (slug: string) => qaEntries.filter((q) => q.productSlug === slug);
export const getGuideBySlug = (slug: string) => buyingGuides.find((g) => g.slug === slug);
export const getTrendingProducts = () => products.filter((p) => p.isTrending);
export const getNewArrivals = () => products.filter((p) => p.isNewArrival);
