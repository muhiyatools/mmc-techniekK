import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/onze-diensten", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/projecten", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/over-ons", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
