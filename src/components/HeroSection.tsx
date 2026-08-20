"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { isSafariLike } from "@/lib/browser";

type HeroSectionProps = {
  totalMedicines?: number;
  reviewAverage?: number;
  reviewCount?: number;
};

type LenisLike = {
  scroll: number;
  on: (event: "scroll", cb: () => void) => void;
  off: (event: "scroll", cb: () => void) => void;
};

export default function HeroSection({
  totalMedicines = 0,
  reviewAverage = 0,
  reviewCount = 0,
}: HeroSectionProps) {
  const [visible, setVisible] = useState(false);
  const [cueShown, setCueShown] = useState(true);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLSpanElement>(null);
  const pharmaRef = useRef<HTMLSpanElement>(null);
  const targetY = useRef(0);
  const currentY = useRef(0);
  const entrance = useRef(0);
  const rafRef = useRef(0);
  const cueRaf = useRef(0);

  useEffect(() => {
    const start = window.setTimeout(() => setVisible(true), 80);
    return () => window.clearTimeout(start);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = media.matches;
    const safari = isSafariLike();
    // Safari: follow scroll more tightly (less mush). Others: softer glide.
    const lerp = safari ? 0.22 : 0.1;

    const forceContentVisible = () => {
      entrance.current = 1;
      if (contentRef.current) {
        contentRef.current.style.opacity = "1";
        contentRef.current.style.transform = "translate3d(0, 0, 0)";
      }
      if (brandRef.current) {
        brandRef.current.style.opacity = "1";
      }
      if (pharmaRef.current) {
        pharmaRef.current.style.opacity = "1";
      }
      setVisible(true);
    };

    if (reduceMotion) {
      forceContentVisible();
      if (brandRef.current) brandRef.current.style.transform = "none";
      if (pharmaRef.current) pharmaRef.current.style.transform = "none";
      setCueShown(true);
      return;
    }

    const readScrollY = () => {
      const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
      return lenis ? lenis.scroll : window.scrollY;
    };

    const onScroll = () => {
      targetY.current = readScrollY();
      if (cueRaf.current) return;
      cueRaf.current = requestAnimationFrame(() => {
        cueRaf.current = 0;
        setCueShown(targetY.current < 48);
      });
    };

    const tick = () => {
      entrance.current += (1 - entrance.current) * 0.08;
      if (1 - entrance.current < 0.002) entrance.current = 1;

      currentY.current += (targetY.current - currentY.current) * lerp;
      if (Math.abs(targetY.current - currentY.current) < 0.05) {
        currentY.current = targetY.current;
      }

      const y = currentY.current;
      const scrollFade = Math.max(0, Math.min(1, 1 - y / 820));
      const opacity = entrance.current * scrollFade;

      // Transform-only on decorative layers (opacity thrashing is costly on Safari)
      if (farRef.current) {
        farRef.current.style.transform = `translate3d(0, ${y * (safari ? 0.28 : 0.42)}px, 0) scale(1.12)`;
      }
      if (midRef.current) {
        midRef.current.style.transform = `translate3d(${y * -0.03}px, ${y * (safari ? -0.1 : -0.16)}px, 0)`;
      }
      if (nearRef.current) {
        nearRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${y * 0.14}px, 0)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${y * 0.1}px, 0)`;
        contentRef.current.style.opacity = String(opacity);
      }

      const p = Math.min(1, y / 540);
      if (brandRef.current) {
        const driftY = y * (safari ? 0.18 : 0.32);
        const driftX = y * -0.04;
        const scale = 1 - p * 0.08;
        // Skip rotateY on Safari — 3D perspective + scroll is a common jank source
        brandRef.current.style.transform = safari
          ? `translate3d(${driftX}px, ${driftY}px, 0) scale(${scale})`
          : `translate3d(${driftX}px, ${driftY}px, 0) rotateY(${p * 58}deg) scale(${scale})`;
        brandRef.current.style.opacity = String(Math.max(0.15, 1 - p * 0.55));
      }
      if (pharmaRef.current) {
        pharmaRef.current.style.transform = `translate3d(${y * 0.02}px, ${y * 0.12}px, 0)`;
        pharmaRef.current.style.opacity = String(Math.max(0.2, 1 - p * 0.65));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Prefer Lenis scroll events when present (Chromium) for 1:1 sync
    let lenis: LenisLike | undefined;
    let lenisTries = 0;
    const bindLenis = () => {
      lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
      if (lenis) {
        lenis.on("scroll", onScroll);
        return;
      }
      if (lenisTries++ < 20) window.setTimeout(bindLenis, 50);
    };
    bindLenis();

    rafRef.current = requestAnimationFrame(tick);

    // One-time opacity settle for decorative layers (avoids per-frame opacity writes)
    if (farRef.current) farRef.current.style.opacity = "1";
    if (midRef.current) midRef.current.style.opacity = "1";
    if (nearRef.current) nearRef.current.style.opacity = String(entrance.current || 1);
    if (gridRef.current) gridRef.current.style.opacity = "0.5";

    const safety = window.setTimeout(() => {
      if (entrance.current < 0.85) forceContentVisible();
    }, 700);

    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis?.off("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(cueRaf.current);
      window.clearTimeout(safety);
    };
  }, []);
  return (
    <section className="hero-parallax relative h-[calc(100svh-4.25rem)] min-h-[28rem] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-sand"
        aria-hidden
      />

      <div
        ref={farRef}
        className="pointer-events-none absolute inset-[-25%] will-change-transform"
        style={{
          transform: "translate3d(0, 0, 0) scale(1.12)",
          opacity: 0.35,
          background:
            "radial-gradient(55% 45% at 50% 42%, rgba(31,168,160,0.16) 0%, rgba(31,168,160,0.06) 42%, transparent 68%)",
        }}
        aria-hidden
      />

      <div
        ref={midRef}
        className="pointer-events-none absolute inset-[-15%] will-change-transform"
        style={{
          transform: "translate3d(0, 0, 0)",
          opacity: 0.35,
          background:
            "radial-gradient(50% 40% at 18% 70%, rgba(72,220,212,0.16), transparent 60%), radial-gradient(45% 35% at 88% 22%, rgba(255,255,255,0.06), transparent 55%)",
        }}
        aria-hidden
      />

      <div
        ref={nearRef}
        className="pointer-events-none absolute inset-[-10%] will-change-transform"
        style={{
          transform: "translate3d(0, 0, 0)",
          opacity: 0,
          background:
            "linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.55) 48%, transparent 66%)",
        }}
        aria-hidden
      />

      <div
        ref={gridRef}
        className="hero-parallax-grid pointer-events-none absolute inset-[-20%] will-change-transform"
        style={{ transform: "translate3d(0, 0, 0)", opacity: 0 }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(238,244,242,0.55) 100%), linear-gradient(180deg, rgba(244,250,248,0.2) 0%, transparent 40%, rgba(238,244,242,0.65) 100%)",
        }}
        aria-hidden
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 pb-20 text-center will-change-transform md:px-8"
        style={{ transform: "translate3d(0, 0, 0)", opacity: 0 }}
      >
        {/* Same lockup as header — larger; Curapex Solutions revolves + drifts on scroll */}
        <h1
          className={`hero-reveal hero-reveal--title flex flex-col items-center gap-3 [perspective:1100px] sm:flex-row sm:items-center sm:gap-4 ${
            visible ? "is-visible" : ""
          }`}
        >
          <span className="inline-flex items-center gap-3 sm:gap-5">
            <span className="inline-flex shrink-0 items-center justify-center" aria-hidden>
              <BrandMark className="h-[clamp(3.25rem,9vw,5.25rem)] w-[clamp(3.25rem,9vw,5.25rem)]" />
            </span>
            <span
              ref={brandRef}
              className="inline-block origin-center font-display text-[clamp(3.75rem,14vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.035em] will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="brand-wordmark">CURAPEX</span>
              <span
                className="brand-live-dot"
                title="Always live"
                aria-label="Always live"
                role="img"
              />
            </span>
          </span>
          <span
            ref={pharmaRef}
            className="inline-block text-[0.8rem] font-medium uppercase tracking-[0.22em] text-[#6f7a84] will-change-transform sm:text-[0.95rem] md:text-[1.05rem] md:tracking-[0.2em]"
          >
            Solutions
          </span>
        </h1>

        {reviewCount > 0 && (
          <Link
            href="/reviews"
            className={`hero-reveal hero-reveal--sub mt-5 inline-flex items-center gap-2 text-sm transition hover:opacity-90 ${
              visible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: "160ms", color: "#9a6a10" }}
            aria-label={`${reviewAverage.toFixed(1)} out of 5 from ${reviewCount} partner reviews`}
          >
            <span className="inline-flex items-center gap-0.5 text-amber-500" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill={i < Math.round(reviewAverage) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={i < Math.round(reviewAverage) ? 0 : 1.4}
                >
                  <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
                </svg>
              ))}
            </span>
            <span className="font-semibold tabular-nums">
              {reviewAverage.toFixed(1)}
            </span>
            <span className="text-ink-soft/55">
              · {reviewCount} partner reviews
            </span>
          </Link>
        )}

        <p
          className={`hero-reveal hero-reveal--sub mt-6 max-w-2xl text-lg font-medium leading-snug tracking-[-0.01em] text-ink md:mt-8 md:text-2xl text-balance ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "220ms" }}
        >
          Wholesale &amp; export medicines for partners worldwide.
        </p>

        <p
          className={`hero-reveal hero-reveal--sub mt-4 max-w-xl text-sm leading-relaxed text-ink-soft/80 md:text-base ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "360ms" }}
        >
          {totalMedicines > 0
            ? `Browse ${totalMedicines}+ tablets, capsules, injections, and specialty products — then submit a wholesale enquiry from the catalog.`
            : "Browse tablets, capsules, injections, and specialty products — then submit a wholesale enquiry from the catalog."}
        </p>

        <div
          className={`hero-reveal hero-reveal--sub mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-11 ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center rounded-full bg-teal px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-deep"
          >
            Browse catalog
          </Link>
          <Link
            href="/about"
            className="pressable inline-flex items-center rounded-full border border-ink/20 bg-surface/70 px-7 py-3.5 text-sm font-medium text-ink transition hover:border-teal/40 hover:text-teal"
          >
            About Curapex Solutions
          </Link>
        </div>

        <nav
          className={`hero-reveal hero-reveal--sub mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-soft/70 md:mt-10 ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "640ms" }}
          aria-label="Quick links"
        >
          <Link href="#categories" className="transition hover:text-teal">
            Categories
          </Link>
          <span className="text-ink-soft/30" aria-hidden>
            ·
          </span>
          <Link href="/catalog" className="transition hover:text-teal">
            Full catalog
          </Link>
          <span className="text-ink-soft/30" aria-hidden>
            ·
          </span>
          <Link href="/reviews" className="transition hover:text-teal">
            Partner reviews
          </Link>
          <span className="text-ink-soft/30" aria-hidden>
            ·
          </span>
          <Link href="/about" className="transition hover:text-teal">
            Export &amp; wholesale
          </Link>
        </nav>
      </div>

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center transition-opacity duration-300 sm:bottom-7 ${
          cueShown ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!cueShown}
      >
        <a
          href="#categories"
          className={`hero-scroll pointer-events-auto ${
            cueShown ? "" : "pointer-events-none"
          }`}
          aria-label="Scroll down"
          tabIndex={cueShown ? 0 : -1}
        >
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 10l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
