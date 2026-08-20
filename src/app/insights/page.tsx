import type { Metadata } from "next";
import Link from "next/link";
import FeaturedInsight from "@/components/FeaturedInsight";
import InsightsGrid from "@/components/InsightsGrid";
import { getFeaturedInsight } from "@/lib/insights";
import { COMPANY } from "@/lib/trust";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Wholesale and export guides by therapeutic category — antibiotics, anti cancer, ED medicines, and pharma export from India.",
  alternates: {
    canonical: `${COMPANY.siteUrl}/insights`,
  },
  openGraph: {
    title: "Wholesale & export guides | Curapex Solutions Insights",
    description:
      "Trade-focused articles linked to our catalog categories for distributors and export partners.",
    url: `${COMPANY.siteUrl}/insights`,
    siteName: COMPANY.legalName,
    locale: "en_IN",
    type: "website",
  },
};

export default function InsightsPage() {
  const featured = getFeaturedInsight();

  return (
    <div className="insights-page">
      <div className="insights-hero-plane" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <header data-scroll data-scroll-hold className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sage">
            <span className="insights-hero-dot" aria-hidden />
            Insights
          </p>
          <h1 className="mt-3 font-display text-4xl uppercase tracking-tight text-ink md:text-5xl text-balance">
            Wholesale &amp; export guides
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft/85 md:text-base">
            Trade-focused articles linked to our catalog categories — for
            distributors, exporters, and pharmacy partners. Not medical advice.
          </p>
        </header>

        {featured && <FeaturedInsight article={featured} />}

        <InsightsGrid featuredSlug={featured?.slug} />

        <div
          data-scroll
          data-scroll-hold
          className="insights-cta mt-12"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage">
            Ready to order?
          </p>
          <h2 className="mt-1 font-display text-xl uppercase tracking-tight text-ink">
            Browse medicines or enquire directly
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-soft/80">
            Use insights for context, then open the catalog, pick your category,
            and submit a wholesale enquiry.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-deep"
            >
              Browse catalog
              <ArrowIcon />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
            >
              About Curapex
            </Link>
          </div>
        </div>
      </div>
    </div>
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
