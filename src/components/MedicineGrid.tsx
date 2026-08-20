"use client";

import { useEffect, useRef, useState } from "react";
import type { Medicine } from "@/types/medicine";
import MedicineCard from "./MedicineCard";

type MedicineGridProps = {
  medicines: Medicine[];
  resetKey?: string;
};

const INITIAL_BATCH = 24;
const LOAD_BATCH = 24;

export default function MedicineGrid({
  medicines,
  resetKey = "",
}: MedicineGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const shown = medicines.slice(0, visibleCount);
  const hasMore = visibleCount < medicines.length;

  useEffect(() => {
    setVisibleCount(INITIAL_BATCH);
    setVisible({});
  }, [resetKey, medicines]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setVisibleCount((n) => Math.min(n + LOAD_BATCH, medicines.length));
      },
      { rootMargin: "600px 0px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // visibleCount intentionally excluded - we only want to recreate when hasMore/medicines.length changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, medicines.length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-med-card]")
    );
    if (!cards.length) return;

    const reveal = (key: string) => {
      setVisible((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    };

    // iOS safety: only force cards already near the viewport
    const fallback = window.setTimeout(() => {
      const vh = window.innerHeight || 1;
      cards.forEach((card) => {
        const key = card.getAttribute("data-med-card");
        if (!key) return;
        if (card.getBoundingClientRect().top < vh * 1.15) reveal(key);
      });
    }, 900);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = entry.target.getAttribute("data-med-card");
          if (key) reveal(key);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [shown.length, resetKey]);

  const delayFor = (index: number) => {
    const local = index % LOAD_BATCH;
    const col = local % 3;
    const row = Math.floor(local / 3);
    return Math.min(col * 70 + row * 35, 220);
  };

  return (
    <div>
      <div ref={rootRef} className="med-grid">
        {shown.map((medicine, index) => (
          <MedicineCard
            key={medicine.slug}
            medicine={medicine}
            index={index}
            reveal={!!visible[medicine.slug]}
            delayMs={delayFor(index)}
          />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-10"
          aria-hidden
        >
          <span className="text-xs text-ink-soft/50">Loading more…</span>
        </div>
      )}
    </div>
  );
}
