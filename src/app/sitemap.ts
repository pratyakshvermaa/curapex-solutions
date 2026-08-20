import type { MetadataRoute } from "next";
import { getAllMedicines } from "@/lib/medicines";
import { getAllInsights } from "@/lib/insights";
import { COMPANY } from "@/lib/trust";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = COMPANY.siteUrl;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/catalog",
    "/insights",
    "/about",
    "/reviews",
    "/policies",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.7,
  }));

  const products = getAllMedicines().map((m) => ({
    url: `${base}/catalog/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const insights = getAllInsights().map((a) => ({
    url: `${base}/insights/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...insights, ...products];
}
