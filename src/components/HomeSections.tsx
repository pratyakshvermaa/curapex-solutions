"use client";

import Link from "next/link";
import type { ParentCategoryInfo } from "@/lib/medicines";
import type { Medicine } from "@/types/medicine";
import CategoryGrid from "./CategoryGrid";
import FeaturedCarousel from "./FeaturedCarousel";
import TrustBand from "./TrustBand";

type HomeSectionsProps = {
  categories: ParentCategoryInfo[];
  featured: Medicine[];
  total: number;
  insightCount: number;
};

export default function HomeSections({
  categories,
  featured,
  total,
  insightCount,
}: HomeSectionsProps) {

  return (
    <>
      <section
        id="categories"
        className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-14 md:px-8 md:py-16"
      >
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(31,168,160, 0.12)",
                  color: "#1fa8a0",
                }}
                aria-hidden
              >
                <GridIcon />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-sage">
                  Product categories
                </p>
                <h2 className="mt-1 font-display text-2xl text-ink md:text-3xl">
                  Find medicines by use
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-ink-soft/80 md:pl-12">
              Tap a category to open matching products — then filter by tablet,
              capsule, injection, or other forms.
            </p>
          </div>

          <ul className="flex flex-wrap gap-1.5 md:justify-end">
            <li
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: "rgba(31,168,160, 0.12)",
                color: "#1fa8a0",
              }}
            >
              <LayersIcon />
              {total} medicines
            </li>
            <li
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: "rgba(61,142,196, 0.12)",
                color: "#3d8ec4",
              }}
            >
              <HeartIcon />
              By therapeutic use
            </li>
            <li
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: "rgba(196, 138, 26, 0.14)",
                color: "#9a6a10",
              }}
            >
              <CapsuleChipIcon />
              Tablet · Capsule · Injection
            </li>
          </ul>
        </header>

        <CategoryGrid categories={categories} />
      </section>

      <section className="border-y border-line bg-surface/35 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: "rgba(196, 138, 26, 0.14)",
                    color: "#9a6a10",
                  }}
                  aria-hidden
                >
                  <StarIcon />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-sage">
                    Featured
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-ink md:text-3xl">
                    Selected from the catalog
                  </h2>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-soft/80 md:pl-12">
                A rotating pick of popular wholesale products — swipe or use the
                arrows to browse three at a time.
              </p>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 self-start rounded-full border border-teal/30 bg-teal-mist/60 px-4 py-2 text-sm font-medium text-teal transition hover:border-teal hover:bg-teal hover:text-white md:self-end"
            >
              View all medicines
              <ArrowIcon />
            </Link>
          </header>

          <div className="mt-8 md:mt-10">
            <FeaturedCarousel medicines={featured} />
          </div>
        </div>
      </section>

      <section
        data-scroll
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-14"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(74,143,216, 0.12)",
                  color: "#4a8fd8",
                }}
                aria-hidden
              >
                <ArticleIcon />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-sage">
                  Insights
                </p>
                <h2 className="mt-1 font-display text-2xl text-ink md:text-3xl">
                  Wholesale guides by category
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-ink-soft/80 md:pl-12">
              Trade articles for export partners — linked to catalog categories.
              Not medical advice.
            </p>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-teal/30 bg-teal-mist/60 px-4 py-2 text-sm font-medium text-teal transition hover:border-teal hover:bg-teal hover:text-white md:self-end"
          >
            Read {insightCount} guides
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <TrustBand />
    </>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4l8 4-8 4-8-4 8-4zm-8 8l8 4 8-4M4 16l8 4 8-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19.5 12.5c1.5-1.6 1.5-4.2-.2-5.8a3.9 3.9 0 00-5.3.3L12 9l-1.9-2a3.9 3.9 0 00-5.4-.2c-1.7 1.6-1.7 4.2-.1 5.8L12 20l7.5-7.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CapsuleChipIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 15.5l7-7a3.5 3.5 0 015 5l-7 7a3.5 3.5 0 01-5-5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
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

function ArticleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4h12v16H6V4zM9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
