import { INSIGHTS } from "@/lib/insights-content";
import type { InsightArticle } from "@/types/insight";
import { COMPANY } from "@/lib/trust";

export function getAllInsights(): InsightArticle[] {
  return [...INSIGHTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return INSIGHTS.find((a) => a.slug === slug);
}

export function getInsightSlugs(): string[] {
  return INSIGHTS.map((a) => a.slug);
}

/** Map catalog parent categories that share a wholesale guide. */
const CATEGORY_INSIGHT_ALIASES: Record<string, string> = {
  Antihypertensive: "Cardiac",
  Antiemetics: "General Medicines",
  "Human Growth Hormones": "Steroids",
};

function resolveCategoryForInsight(category: string): string {
  return CATEGORY_INSIGHT_ALIASES[category] || category;
}

export function getInsightsForCategory(category: string): InsightArticle[] {
  return getAllInsights().filter(
    (a) => a.category === resolveCategoryForInsight(category)
  );
}

/** Best single guide for a catalog parent category (newest first). */
export function getPrimaryInsightForCategory(
  category: string | null | undefined
): InsightArticle | undefined {
  if (!category) return undefined;
  return getInsightsForCategory(category)[0];
}

/** Map of parent category → primary insight slug (for grids / filters). */
export function getCategoryInsightMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const article of getAllInsights()) {
    if (!article.category || map[article.category]) continue;
    map[article.category] = article.slug;
  }
  for (const [alias, target] of Object.entries(CATEGORY_INSIGHT_ALIASES)) {
    const slug = map[target];
    if (slug) map[alias] = slug;
  }
  return map;
}

export const FEATURED_INSIGHT_SLUG = "pharma-export-from-india-guide";

export function getFeaturedInsight(): InsightArticle | undefined {
  return getInsightBySlug(FEATURED_INSIGHT_SLUG);
}

export function getRelatedInsights(article: InsightArticle): InsightArticle[] {
  const seen = new Set<string>([article.slug]);
  const out: InsightArticle[] = [];

  for (const slug of article.relatedSlugs) {
    const found = getInsightBySlug(slug);
    if (!found || seen.has(found.slug)) continue;
    seen.add(found.slug);
    out.push(found);
    if (out.length >= 3) return out;
  }

  // Fill remaining slots: same category first, then newest others
  const pool = getAllInsights().filter((a) => !seen.has(a.slug));
  const sameCategory = article.category
    ? pool.filter((a) => a.category === article.category)
    : [];
  const rest = pool.filter((a) => a.category !== article.category);

  for (const candidate of [...sameCategory, ...rest]) {
    out.push(candidate);
    if (out.length >= 3) break;
  }

  return out;
}

export function catalogHrefForCategory(category: string | null): string {
  if (!category) return "/catalog";
  return `/catalog?category=${encodeURIComponent(category)}`;
}

export function formatInsightDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function insightUrl(slug: string): string {
  return `${COMPANY.siteUrl}/insights/${slug}`;
}

/** Default in-body catalog links for SEO internal linking. */
export function getCatalogLinksForArticle(
  article: InsightArticle
): { label: string; href: string }[] {
  if (article.catalogLinks?.length) return article.catalogLinks;

  const links: { label: string; href: string }[] = [];
  if (article.category) {
    links.push({
      label: `Browse ${article.category} in catalog`,
      href: catalogHrefForCategory(article.category),
    });
  }
  links.push({ label: "Full medicine catalog", href: "/catalog" });
  links.push({ label: "About Curapex", href: "/about" });
  return links.slice(0, 3);
}
