"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = { average: number; count: number };

export default function HeaderReviews({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [stats, setStats] = useState<Stats>({ average: 0, count: 0 });

  useEffect(() => {
    const load = () => {
      fetch("/api/reviews")
        .then((r) => r.json())
        .then((data) => {
          if (data?.stats) {
            setStats({
              average: data.stats.average,
              count: data.stats.count,
            });
          }
        })
        .catch(() => {});
    };
    load();
    window.addEventListener("curapex:reviews-updated", load);
    return () => window.removeEventListener("curapex:reviews-updated", load);
  }, []);

  if (!stats.count) {
    return (
      <Link
        href="/reviews"
        className="nav-bounce inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition"
        style={{
          background: "rgba(196,138,26,0.12)",
          color: "#9a6a10",
        }}
      >
        <StarIcon />
        Reviews
      </Link>
    );
  }

  return (
    <Link
      href="/reviews"
      className={`nav-bounce group inline-flex items-center gap-1.5 rounded-full text-xs font-semibold transition ${
        compact ? "px-2 py-1" : "px-2.5 py-1.5"
      }`}
      style={{
        background: "rgba(196,138,26,0.14)",
        color: "#9a6a10",
      }}
      aria-label={`${stats.average} out of 5 from ${stats.count} reviews`}
    >
      <span className="inline-flex text-amber-500" aria-hidden>
        <StarIcon filled />
      </span>
      <span className="tabular-nums">{stats.average.toFixed(1)}</span>
      {!compact && (
        <span className="font-medium opacity-70">({stats.count})</span>
      )}
    </Link>
  );
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      aria-hidden
    >
      <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
    </svg>
  );
}
