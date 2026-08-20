"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Medicine } from "@/types/medicine";
import MedicineCard from "./MedicineCard";

type FeaturedCarouselProps = {
  medicines: Medicine[];
};

export default function FeaturedCarousel({ medicines }: FeaturedCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const syncControls = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = el.scrollLeft;
    setCanPrev(left > 8);
    setCanNext(left < maxScroll - 8);

    const pageWidth = el.clientWidth || 1;
    const totalPages = Math.max(1, Math.ceil(el.scrollWidth / pageWidth));
    setPages(totalPages);
    setPage(Math.min(totalPages - 1, Math.round(left / pageWidth)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    syncControls();
    el.addEventListener("scroll", syncControls, { passive: true });
    window.addEventListener("resize", syncControls);

    return () => {
      el.removeEventListener("scroll", syncControls);
      window.removeEventListener("resize", syncControls);
    };
  }, [medicines, syncControls]);

  const scrollByPage = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const goToPage = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  if (!medicines.length) return null;

  return (
    <div className="featured-carousel">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          disabled={!canPrev}
          className="featured-nav"
          aria-label="Previous medicines"
        >
          <ChevronIcon dir="left" />
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          disabled={!canNext}
          className="featured-nav"
          aria-label="Next medicines"
        >
          <ChevronIcon dir="right" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="featured-track"
        aria-label="Featured medicines"
      >
        {medicines.map((medicine, index) => (
          <div key={medicine.slug} className="featured-slide">
            <MedicineCard
              medicine={medicine}
              index={index}
              reveal
              delayMs={(index % 3) * 80}
            />
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === page
                  ? "w-5 bg-teal"
                  : "w-1.5 bg-ink/20 hover:bg-ink/35"
              }`}
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
