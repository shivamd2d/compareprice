import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";
  const staticRoutes = [
    "",
    "/search",
    "/compare",
    "/deals",
    "/assistant",
    "/rankings",
    "/guides",
    "/stores",
    "/favorites",
    "/alerts",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(),
    })),
  ];
}
