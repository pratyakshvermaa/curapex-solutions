import { COMPANY } from "@/lib/trust";
import type { InsightArticle } from "@/types/insight";

type ArticleJsonLdProps = {
  article: InsightArticle;
  url: string;
};

/**
 * Emit one JSON-LD document with @graph.
 * A top-level array breaks some browsers (Safari: r["@context"].toLowerCase).
 */
export default function ArticleJsonLd({ article, url }: ArticleJsonLdProps) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      author: {
        "@type": "Organization",
        name: COMPANY.legalName,
        url: COMPANY.siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: COMPANY.legalName,
        url: COMPANY.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${COMPANY.siteUrl}/images/brand/curapex-logo-network.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      keywords: article.tags.join(", "),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: COMPANY.siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Insights",
          item: `${COMPANY.siteUrl}/insights`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: url,
        },
      ],
    },
  ];

  if (article.faqs && article.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }

  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
