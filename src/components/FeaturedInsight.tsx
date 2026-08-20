import Link from "next/link";
import type { CSSProperties } from "react";
import type { InsightArticle } from "@/types/insight";
import { insightCategoryIcon, insightTone } from "@/lib/insightIcons";

type FeaturedInsightProps = {
  article: InsightArticle;
};

export default function FeaturedInsight({ article }: FeaturedInsightProps) {
  const tone = insightTone(article.category || "Export");

  return (
    <aside
      data-scroll
      data-scroll-hold
      className="insights-featured mt-8"
      style={
        {
          "--insight-accent": tone.accent,
          "--insight-wash": tone.wash,
        } as CSSProperties
      }
    >
      <div className="insights-featured-inner">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="insights-featured-badge">
              <span aria-hidden>{insightCategoryIcon("Export", "h-3.5 w-3.5")}</span>
              Featured guide
            </span>
            <span className="text-[0.72rem] text-ink-soft/55">
              {article.readMinutes} min read
            </span>
          </div>
          <h2 className="mt-2.5 font-display text-xl uppercase tracking-tight leading-snug text-ink md:text-2xl">
            {article.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft/80">
            {article.description}
          </p>
        </div>
        <Link
          href={`/insights/${article.slug}`}
          className="insights-featured-cta"
          style={{ background: tone.accent }}
        >
          Read guide
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
