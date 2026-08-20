"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { isSafariLike } from "@/lib/browser";

type LenisWindow = Window & { __lenis?: Lenis };

/**
 * Sitewide inertia scrolling.
 * Uses Lenis on Chromium/Firefox; native momentum on Safari/iOS.
 * Respects prefers-reduced-motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const safari = isSafariLike();

    if (safari) {
      document.documentElement.classList.add("is-safari");
    }

    if (media.matches || safari) {
      return () => {
        document.documentElement.classList.remove("is-safari");
      };
    }

    const lenis = new Lenis({
      // Slightly shorter settle — feels snappier without losing glide
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // Don't fight native touch inertia on tablets
      syncTouch: false,
      touchMultiplier: 1.2,
      wheelMultiplier: 0.88,
      autoRaf: true,
      overscroll: true,
    });
    lenisRef.current = lenis;
    (window as LenisWindow).__lenis = lenis;
    document.documentElement.classList.add("has-smooth-scroll", "lenis", "lenis-smooth");

    const onReduce = () => {
      if (!media.matches) return;
      lenis.destroy();
      lenisRef.current = null;
      delete (window as LenisWindow).__lenis;
      document.documentElement.classList.remove(
        "has-smooth-scroll",
        "lenis",
        "lenis-smooth"
      );
    };
    media.addEventListener("change", onReduce);

    return () => {
      media.removeEventListener("change", onReduce);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as LenisWindow).__lenis;
      document.documentElement.classList.remove(
        "has-smooth-scroll",
        "lenis",
        "lenis-smooth",
        "is-safari"
      );
    };
  }, []);

  // Reset scroll on route change without fighting Lenis
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
