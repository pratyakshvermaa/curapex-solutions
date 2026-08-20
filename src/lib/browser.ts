/** Safari / iOS already have excellent native inertia — Lenis often makes it feel laggy. */
export function isSafariLike() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS =
    /iP(ad|hone|od)/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafariDesktop =
    /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/i.test(ua);
  return isIOS || isSafariDesktop;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Client-side only check to avoid hydration mismatches.
 * Use this to conditionally render client-only features.
 */
export function isClient(): boolean {
  return typeof window !== "undefined" && typeof navigator !== "undefined";
}
