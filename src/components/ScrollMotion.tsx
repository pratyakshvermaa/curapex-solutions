"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SELECTOR = [
  "main section:not(.hero-parallax):not([data-scroll-skip])",
  "main header[data-scroll]",
  "main [data-scroll]:not([data-scroll-skip])",
].join(",");

const STAGGER_MS = 95;
const BASE_DELAY_MS = 40;

/**
 * Entrance cascade only — content stays fully visible while on screen.
 * Exit fade is intentionally disabled (was washing cards mid-viewport).
 */
export default function ScrollMotion() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        el.classList.add("page-cascade--in", "page-cascade--settled");
        el.style.setProperty("--scroll-fade", "1");
      });
      return;
    }

    let cancelled = false;
    let belowStagger = 0;
    let raf1 = 0;
    let raf2 = 0;
    let safetyTimer = 0;

    const reveal = (el: HTMLElement, delayMs = 0) => {
      if (el.classList.contains("page-cascade--in")) return;
      el.style.setProperty("--cascade-delay", `${delayMs}ms`);
      el.style.setProperty("--scroll-fade", "1");
      void el.offsetWidth;
      el.classList.add("page-cascade--in");
      window.setTimeout(() => {
        if (cancelled || !el.isConnected) return;
        el.classList.add("page-cascade--live", "page-cascade--settled");
      }, delayMs + 700);
    };

    const collect = () => {
      observerRef.current?.disconnect();

      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(SELECTOR)
      );
      const items = nodes.filter(
        (el) => !nodes.some((other) => other !== el && other.contains(el))
      );

      items.sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );
      itemsRef.current = items;

      for (const el of items) {
        el.classList.remove(
          "page-cascade--in",
          "page-cascade--settled",
          "page-cascade--live"
        );
        el.style.removeProperty("--cascade-delay");
        el.style.setProperty("--scroll-fade", "0");
      }

      const vh = window.innerHeight || 1;
      let firstScreenIndex = 0;
      belowStagger = 0;
      const firstScreen: { el: HTMLElement; delay: number }[] = [];

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const freshly = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target as HTMLElement)
            .filter((el) => !el.classList.contains("page-cascade--in"))
            .sort(
              (a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top
            );

          for (const el of freshly) {
            const delay = (belowStagger % 3) * 70;
            belowStagger += 1;
            reveal(el, delay);
            observerRef.current?.unobserve(el);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -8% 0px",
        }
      );

      for (const el of items) {
        const top = el.getBoundingClientRect().top;
        if (top < vh * 0.94) {
          const delay = BASE_DELAY_MS + firstScreenIndex * STAGGER_MS;
          firstScreenIndex += 1;
          firstScreen.push({ el, delay });
        } else {
          observerRef.current.observe(el);
        }
      }

      return firstScreen;
    };

    const firstScreen = collect();

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        for (const { el, delay } of firstScreen) {
          reveal(el, delay);
        }

        safetyTimer = window.setTimeout(() => {
          if (cancelled) return;
          const vh = window.innerHeight || 1;
          for (const el of itemsRef.current) {
            if (el.classList.contains("page-cascade--in")) continue;
            if (el.getBoundingClientRect().top < vh * 1.08) reveal(el, 0);
          }
        }, BASE_DELAY_MS + Math.max(firstScreen.length, 1) * STAGGER_MS + 900);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(safetyTimer);
      observerRef.current?.disconnect();
      observerRef.current = null;
      itemsRef.current = [];
    };
  }, [pathname]);

  return null;
}
