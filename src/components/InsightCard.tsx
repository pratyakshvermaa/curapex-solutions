import Link from "next/link";
import type { CSSProperties } from "react";
import {
  catalogHrefForCategory,
  formatInsightDate,
} from "@/lib/insights";
import { insightCategoryIcon, insightTone } from "@/lib/insightIcons";
import type { InsightArticle } from "@/types/insight";

type InsightCardProps = {
  article: InsightArticle;
  index?: number;
  animate?: boolean;
  compact?: boolean;
};

export default function InsightCard({
  article,
  index = 0,
  animate = true,
  compact = false,
}: InsightCardProps) {
  const tone = insightTone(article.category || "Export");
  const delayMs = (index % 4) * 70;
  const href = `/insights/${article.slug}`;
  const label = article.category || "Trade guide";

  return (
    <article
      {...(animate ? { "data-scroll": true } : { "data-scroll-skip": true })}
      className={`insight-card group ${compact ? "insight-card--compact" : ""}`}
      style={
        {
          "--insight-accent": tone.accent,
          "--insight-wash": tone.wash,
          "--insight-mist": tone.mist,
          transitionDelay: animate ? `${delayMs}ms` : "0ms",
        } as CSSProperties
      }
    >
      <Link href={href} className="insight-card-link">
        <div className="insight-card-top">
          <span className="insight-symbol-wrap" aria-hidden>
            <span className="insight-symbol">
              {insightCategoryIcon(article.category, "h-3.5 w-3.5")}
            </span>
            <span className="insight-chip">{label}</span>
          </span>
          <span className="insight-meta">{article.readMinutes} min</span>
        </div>
        <h2 className="insight-title uppercase tracking-tight">{article.title}</h2>
        <p className="insight-excerpt">{article.description}</p>
        {compact ? (
          <span className="insight-card-cta">
            Read guide
            <span aria-hidden>→</span>
          </span>
        ) : (
          <p className="insight-footer">
            <time dateTime={article.publishedAt}>
              {formatInsightDate(article.publishedAt)}
            </time>
            <span aria-hidden>→</span>
          </p>
        )}
      </Link>
      {!compact && article.category && (
        <Link
          href={catalogHrefForCategory(article.category)}
          className="insight-catalog-link"
        >
          Browse {article.category} in catalog
        </Link>
      )}
    </article>
  );
}
