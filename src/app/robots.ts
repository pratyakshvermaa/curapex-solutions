import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/trust";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${COMPANY.siteUrl}/sitemap.xml`,
  };
}
