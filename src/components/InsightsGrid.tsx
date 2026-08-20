"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import InsightCard from "@/components/InsightCard";
import { getAllInsights } from "@/lib/insights";
import { insightCategoryIcon, insightTone } from "@/lib/insightIcons";

type InsightsGridProps = {
  featuredSlug?: string;
};

export default function InsightsGrid({ featuredSlug }: InsightsGridProps) {
  const articles = useMemo(() => {
    const all = getAllInsights();
    if (!featuredSlug) return all;
    return all.filter((a) => a.slug !== featuredSlug);
  }, [featuredSlug]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a.category) set.add(a.category);
    }
    return ["All", ...Array.from(set).sort()];
  }, [articles]);

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list =
      filter === "All"
        ? articles
        : articles.filter((a) => a.category === filter);

    if (q) {
      list = list.filter((a) => {
        const hay = [a.title, a.description, a.category, ...a.tags]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  }, [articles, filter, query]);

  useEffect(() => {
    setVisible({});
    const root = gridRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const all: Record<string, boolean> = {};
      for (const a of filtered) all[a.slug] = true;
      setVisible(all);
      return;
    }

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-insight-card]")
    );
    if (!cards.length) return;

    const reveal = (slug: string) => {
      setVisible((prev) => (prev[slug] ? prev : { ...prev, [slug]: true }));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const slug = entry.target.getAttribute("data-insight-card");
          if (slug) reveal(slug);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    cards.forEach((card) => observer.observe(card));

    const safety = window.setTimeout(() => {
      const vh = window.innerHeight || 1;
      cards.forEach((card) => {
        const slug = card.getAttribute("data-insight-card");
        if (!slug) return;
        if (card.getBoundingClientRect().top < vh * 1.05) reveal(slug);
      });
    }, 1400);

    return () => {
      window.clearTimeout(safety);
      observer.disconnect();
    };
  }, [filtered]);

  return (
    <>
      <div
        data-scroll
        data-scroll-hold
        className="insights-toolbar mt-8"
      >
        <label className="insights-search">
          <span className="text-xs uppercase tracking-[0.16em] text-sage">
            Search guides
          </span>
          <span className="relative mt-2 block">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-teal">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, tag, or category…"
              className="w-full rounded-2xl border border-line bg-surface/90 py-3 pl-10 pr-4 text-sm outline-none ring-teal/30 transition focus:ring-2"
            />
          </span>
        </label>
        <p className="insights-count">
          <span className="font-semibold text-ink">{filtered.length}</span>
          <span className="text-ink-soft/60"> / {articles.length} guides</span>
        </p>
      </div>

      <div
        data-scroll
        data-scroll-hold
        className="insights-filters mt-5"
        role="tablist"
        aria-label="Filter by category"
      >
        {categories.map((cat) => {
          const active = filter === cat;
          const tone = insightTone(cat === "All" ? "Export" : cat);
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(cat)}
              className={`insights-filter ${active ? "is-active" : ""}`}
              style={
                {
                  "--filter-accent": tone.accent,
                  "--filter-wash": tone.wash,
                } as CSSProperties
              }
            >
              <span className="insights-filter-icon" aria-hidden>
                {insightCategoryIcon(cat === "All" ? "Export" : cat, "h-3.5 w-3.5")}
              </span>
              {cat}
            </button>
          );
        })}
      </div>

      <div
        ref={gridRef}
        data-scroll-skip
        className="insights-grid-compact mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((article, index) => {
          const isOn = visible[article.slug];
          const delayMs = (index % 3) * 70 + Math.floor(index / 3) * 45;

          return (
            <div
              key={article.slug}
              data-insight-card={article.slug}
              className={`insight-cascade ${isOn ? "is-visible" : ""}`}
              style={{ transitionDelay: isOn ? `${delayMs}ms` : "0ms" }}
            >
              <InsightCard
                article={article}
                index={index}
                animate={false}
                compact
              />
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-soft/70">
          No guides match your search.{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
            className="text-teal hover:underline"
          >
            Clear filters
          </button>{" "}
          or{" "}
          <Link href="/catalog" className="text-teal hover:underline">
            browse the catalog
          </Link>
        </p>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.2 16.2L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
