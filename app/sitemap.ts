import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mmctechniek.nl";

  // Static core routes
  const routes = ["", "/aanbod", "/our-work", "/over-ons", "/veelgestelde-vragen", "/contact"];

  const sitemapEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic service category routes
  const services = [
    "airconditioning",
    "zonnepanelen",
    "batterijopslag",
    "warmtepompen",
    "meterkast",
    "onderhoud",
    "renovaties",
  ];

  services.forEach((slug) => {
    sitemapEntries.push({
      url: `${baseUrl}/diensten/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
  });

  return sitemapEntries;
}
