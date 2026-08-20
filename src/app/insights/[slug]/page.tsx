import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import InsightCard from "@/components/InsightCard";
import InsightStickyBar from "@/components/InsightStickyBar";
import {
  catalogHrefForCategory,
  formatInsightDate,
  getCatalogLinksForArticle,
  getInsightBySlug,
  getInsightSlugs,
  getRelatedInsights,
  insightUrl,
} from "@/lib/insights";
import { toneForCategory } from "@/lib/categoryStyle";
import { COMPANY } from "@/lib/trust";

type InsightPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: InsightPageProps): Metadata {
  const article = getInsightBySlug(params.slug);
  if (!article) return { title: "Insight not found" };

  const url = insightUrl(article.slug);
  const modified = article.updatedAt || article.publishedAt;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url,
      siteName: COMPANY.legalName,
      locale: "en_IN",
      publishedTime: article.publishedAt,
      modifiedTime: modified,
      tags: article.tags,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
    },
  };
}

export default function InsightArticlePage({ params }: InsightPageProps) {
  const article = getInsightBySlug(params.slug);
  if (!article) notFound();

  const related = getRelatedInsights(article);
  const tone = toneForCategory(article.category || "Export");
  const url = insightUrl(article.slug);
  const catalogLinks = getCatalogLinksForArticle(article);

  return (
    <>
      <ArticleJsonLd article={article} url={url} />
      <InsightStickyBar
        catalogHref={catalogHrefForCategory(article.category)}
        catalogLabel={
          article.category
            ? `Browse ${article.category}`
            : "Browse catalog"
        }
        shareTitle={article.title}
        shareUrl={url}
      />

      <article className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <nav data-scroll className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft/60">
          <Link href="/" className="hover:text-teal">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/insights" className="hover:text-teal">
            Insights
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink-soft/80 line-clamp-1">{article.title}</span>
        </nav>

        <header data-scroll className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            {article.category ? (
              <Link
                href={catalogHrefForCategory(article.category)}
                className="insight-chip insight-chip--static"
                style={{
                  background: tone.wash,
                  color: tone.accent,
                }}
              >
                {article.category}
              </Link>
            ) : (
              <span
                className="insight-chip insight-chip--static insight-chip--general"
                style={{
                  background: tone.wash,
                  color: tone.accent,
                }}
              >
                Trade guide
              </span>
            )}
            <span className="text-[0.72rem] text-ink-soft/55">
              {article.readMinutes} min read ·{" "}
              <time dateTime={article.publishedAt}>
                {formatInsightDate(article.publishedAt)}
              </time>
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <>
                  {" "}
                  · Updated{" "}
                  <time dateTime={article.updatedAt}>
                    {formatInsightDate(article.updatedAt)}
                  </time>
                </>
              )}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl uppercase tracking-tight leading-tight text-ink md:text-[2.35rem] text-balance">
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft/85">
            {article.description}
          </p>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line/80 bg-surface/60 px-2 py-0.5 text-[0.65rem] font-medium text-ink-soft/70"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <div
          data-scroll
          className="insight-prose mt-10 space-y-8 border-t border-line/70 pt-8"
        >
          {article.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-display text-xl uppercase tracking-tight text-ink md:text-[1.35rem]">
                  {section.heading}
                </h2>
              )}
              <div className={section.heading ? "mt-3 space-y-3" : "space-y-3"}>
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="text-sm leading-relaxed text-ink-soft/88 md:text-[0.95rem]"
                  >
                    {p}
                  </p>
                ))}
                {section.links && section.links.length > 0 && (
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-1 rounded-full border border-teal/25 bg-teal-mist/50 px-3 py-1 text-xs font-semibold text-teal hover:bg-teal-mist"
                        >
                          {link.label}
                          <span aria-hidden>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {i === 0 && catalogLinks.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {catalogLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1 rounded-full border border-line/80 bg-surface/80 px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-teal/40 hover:text-teal"
                      >
                        {link.label}
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {article.faqs && article.faqs.length > 0 && (
          <section data-scroll className="mt-10 border-t border-line/70 pt-8">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage">
              FAQ
            </p>
            <h2 className="mt-1 font-display text-xl uppercase tracking-tight text-ink">
              Common partner questions
            </h2>
            <dl className="mt-4 space-y-3">
              {article.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-line/80 bg-surface/70 px-4 py-3"
                >
                  <dt className="text-sm font-semibold text-ink">
                    {faq.question}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft/80">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <aside
          data-scroll
          className="mt-10 overflow-hidden rounded-2xl border border-line/80"
          style={{
            background: `radial-gradient(90% 80% at 0% 0%, ${tone.wash}, transparent 55%), rgba(255,255,255,0.75)`,
          }}
        >
          <div className="px-5 py-5 md:px-6 md:py-6">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage">
              Next step
            </p>
            <h2 className="mt-1 font-display text-xl uppercase tracking-tight text-ink">
              {article.category
                ? `Browse ${article.category} in our catalog`
                : "Browse the full catalog"}
            </h2>
            <p className="mt-2 text-sm text-ink-soft/75">
              {COMPANY.moqNote}. Replies within {COMPANY.responseSla}.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={catalogHrefForCategory(article.category)}
                className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep"
              >
                Open catalog
                <ArrowIcon />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-medium text-teal hover:underline"
              >
                About Curapex
              </Link>
            </div>
          </div>
        </aside>

        <p
          data-scroll
          className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-[0.75rem] leading-relaxed text-ink-soft/80"
        >
          <strong className="font-semibold text-ink/90">Note:</strong> This
          article is for wholesale and export partners only. It is not medical
          advice. Confirm import regulations in your market independently.
        </p>

        {related.length > 0 && (
          <section data-scroll className="mt-12 border-t border-line/70 pt-10">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage">
              Related
            </p>
            <h2 className="mt-1 font-display text-xl uppercase tracking-tight text-ink">
              More insights
            </h2>
            <div
              data-scroll-skip
              className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {related.map((item, index) => (
                <InsightCard
                  key={item.slug}
                  article={item}
                  index={index}
                  animate={false}
                />
              ))}
            </div>
          </section>
        )}

        <p data-scroll className="mt-10">
          <Link
            href="/insights"
            className="text-sm font-medium text-teal hover:underline"
          >
            ← All insights
          </Link>
        </p>
      </article>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
