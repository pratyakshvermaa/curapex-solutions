import Link from "next/link";
import { toneForCategory } from "@/lib/categoryStyle";
import type { InsightArticle } from "@/types/insight";

type CategoryInsightBannerProps = {
  article: InsightArticle;
};

/** Compact cross-link from catalog filter → matching insight guide. */
export default function CategoryInsightBanner({
  article,
}: CategoryInsightBannerProps) {
  const tone = toneForCategory(article.category || "Export");

  return (
    <aside
      data-scroll
      className="mt-5 overflow-hidden rounded-2xl border border-line/80"
      style={{
        background: `radial-gradient(90% 80% at 0% 0%, ${tone.wash}, transparent 55%), rgba(255,255,255,0.78)`,
      }}
    >
      <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
            Wholesale guide
          </p>
          <p className="mt-0.5 font-display text-base leading-snug text-ink sm:text-lg">
            {article.title}
          </p>
          <p className="mt-1 line-clamp-2 text-[0.78rem] text-ink-soft/70">
            {article.description}
          </p>
        </div>
        <Link
          href={`/insights/${article.slug}`}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 sm:self-center"
          style={{ background: tone.accent }}
        >
          Read guide
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
