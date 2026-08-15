import type { MetadataRoute } from "next";
import { products, categories, brands, buyingGuides } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dealwise.in";
  const now = new Date();

  const staticRoutes = [
    "",
    "/search",
    "/compare",
    "/deals",
    "/rankings",
    "/guides",
    "/favorites",
    "/alerts",
    "/how-we-score",
    "/how-we-track-prices",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
    })),
    ...categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...brands.map((brand) => ({
      url: `${baseUrl}/brands/${brand.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...buyingGuides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: new Date(guide.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
  ];
}
