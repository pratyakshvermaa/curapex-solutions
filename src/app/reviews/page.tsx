import type { Metadata } from "next";
import Link from "next/link";
import ReviewSection from "@/components/ReviewSection";
import { getAllMedicines } from "@/lib/medicines";
import { getAllReviews, getReviewStats } from "@/lib/reviews-store";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Customer reviews for Curapex Solutions — wholesale and export pharmaceutical partner.",
};

export const dynamic = "force-dynamic";

const PER_PAGE = 10;

type ReviewsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const { page: pageParam } = await searchParams;
  const reviews = getAllReviews();
  const { average, count, distribution } = getReviewStats();
  const medicines = getAllMedicines()
    .map((m) => ({ slug: m.slug, name: m.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  const rawPage = Number.parseInt(pageParam || "1", 10);
  const page = Number.isFinite(rawPage)
    ? Math.min(Math.max(1, rawPage), totalPages)
    : 1;
  const start = (page - 1) * PER_PAGE;
  const pageReviews = reviews.slice(start, start + PER_PAGE);
  const from = reviews.length === 0 ? 0 : start + 1;
  const to = Math.min(start + PER_PAGE, reviews.length);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <ReviewSection
        medicines={medicines}
        average={average}
        count={count}
      />

      <section
        data-scroll
        className="mt-8 grid gap-6 overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 md:grid-cols-[220px_1fr] md:p-7"
      >
        <div className="relative flex flex-col items-start justify-center border-b border-line pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <span
            className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide"
            style={{
              background: "rgba(196, 138, 26, 0.14)",
              color: "#9a6a10",
            }}
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
            </svg>
            Score
          </span>
          <p className="font-display text-5xl tabular-nums text-ink">
            {average.toFixed(1)}
          </p>
          <StarsRow value={average} size="lg" />
          <p className="mt-2 text-sm text-ink-soft/70">
            Based on {count} reviews
          </p>
        </div>
        <div className="space-y-2.5">
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sage">
            Rating mix
          </p>
          {[5, 4, 3, 2, 1].map((star) => {
            const n = distribution[star] || 0;
            const pct = count ? Math.round((n / count) * 100) : 0;
            const bar =
              star >= 4
                ? "#1fa8a0"
                : star === 3
                  ? "#c48a1a"
                  : "#8a4b4b";
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="inline-flex w-10 items-center gap-0.5 tabular-nums text-ink-soft">
                  {star}
                  <svg className="h-3 w-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
                  </svg>
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{ width: `${pct}%`, background: bar }}
                  />
                </div>
                <span className="w-10 tabular-nums text-ink-soft/70">{n}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div id="reviews-list" data-scroll className="mt-10 space-y-3">
        {pageReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-xl border border-line/80 bg-surface/55 px-4 py-4 md:px-5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <StarsRow value={review.rating} />
              <p className="font-medium text-ink">{review.title}</p>
              {review.medicineName && (
                <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-medium text-ink-soft">
                  {review.medicineName}
                </span>
              )}
              {review.verified && (
                <span className="rounded-full bg-teal-mist px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-teal">
                  Verified enquiry
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/85">
              {review.body}
            </p>
            <p className="mt-2 text-xs text-ink-soft/55">
              {[
                review.name,
                review.location &&
                review.location !== "—" &&
                review.location.trim()
                  ? review.location.trim()
                  : null,
                new Date(review.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          data-scroll
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
          aria-label="Reviews pagination"
        >
          <p className="text-xs text-ink-soft/60">
            Showing {from}–{to} of {reviews.length}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <PaginationLink
              href={pageHref(page - 1)}
              disabled={page <= 1}
              label="Previous"
            />
            {pageNumbers(page, totalPages).map((item, i) =>
              item === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1.5 text-sm text-ink-soft/45"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Link
                  key={item}
                  href={pageHref(item)}
                  aria-current={item === page ? "page" : undefined}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm font-medium transition ${
                    item === page
                      ? "bg-teal text-white"
                      : "border border-line bg-surface/70 text-ink-soft hover:border-teal/40 hover:text-teal"
                  }`}
                >
                  {item}
                </Link>
              )
            )}
            <PaginationLink
              href={pageHref(page + 1)}
              disabled={page >= totalPages}
              label="Next"
            />
          </div>
        </nav>
      )}

      <div data-scroll className="mt-10">
        <Link
          href="/catalog"
          className="inline-flex rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-deep"
        >
          Browse medicines
        </Link>
      </div>
    </div>
  );
}

function pageHref(page: number) {
  return page <= 1 ? "/reviews#reviews-list" : `/reviews?page=${page}#reviews-list`;
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

function PaginationLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-9 items-center rounded-full border border-line/60 px-3 text-sm text-ink-soft/35">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center rounded-full border border-line bg-surface/70 px-3 text-sm font-medium text-ink-soft transition hover:border-teal/40 hover:text-teal"
    >
      {label}
    </Link>
  );
}

function StarsRow({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "lg";
}) {
  const cls = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  const full = Math.round(value);
  const ariaLabel = `${value.toFixed(1)} out of 5 stars`;
  return (
    <span className="flex gap-0.5 text-amber-500" role="img" aria-label={ariaLabel}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={cls}
          viewBox="0 0 20 20"
          fill={i < full ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={i < full ? 0 : 1.3}
          aria-hidden="true"
        >
          <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
        </svg>
      ))}
    </span>
  );
}
