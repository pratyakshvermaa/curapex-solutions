"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import BrandMark from "@/components/BrandMark";

const links: {
  href: string;
  label: string;
  accent: string;
  wash: string;
  icon: ReactNode;
}[] = [
  {
    href: "/",
    label: "Home",
    accent: "#1fa8a0",
    wash: "rgba(31,168,160,0.12)",
    icon: (
      <path
        d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-5v-5H10v5H5a1 1 0 01-1-1v-8.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/catalog",
    label: "Catalog",
    accent: "#3d8ec4",
    wash: "rgba(61,142,196,0.12)",
    icon: (
      <path
        d="M5 7h6v6H5V7zm8 0h6v4h-6V7zM5 15h6v4H5v-4zm8-2h6v6h-6v-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/insights",
    label: "Insights",
    accent: "#4a8fd8",
    wash: "rgba(74,143,216,0.12)",
    icon: (
      <path
        d="M5 5.5h14v13H5V5.5zM8 9h8M8 12.5h5.5M8 16h8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/about",
    label: "About",
    accent: "#5a9aaa",
    wash: "rgba(90,154,170,0.14)",
    icon: (
      <path
        d="M12 3l8 3.5v5.2c0 5-3.4 8.5-8 9.8-4.6-1.3-8-4.8-8-9.8V6.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/reviews",
    label: "Reviews",
    accent: "#9a6a10",
    wash: "rgba(196,138,26,0.14)",
    icon: (
      <path
        d="M5 7.5A2.5 2.5 0 017.5 5h9A2.5 2.5 0 0119 7.5v6A2.5 2.5 0 0116.5 16H10l-3.5 3v-3H7.5A2.5 2.5 0 015 13.5v-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: reduce, duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-teal-mist/92 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 py-2.5 md:gap-3 md:px-8 md:py-3">
        <Link
          href="/"
          className="nav-bounce group flex min-w-0 shrink-0 items-center gap-2 justify-self-start"
          aria-label="Curapex Solutions home"
        >
          <span
            className="inline-flex shrink-0 items-center justify-center"
            aria-hidden
          >
            <BrandMark className="h-9 w-9 md:h-10 md:w-10" />
          </span>
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="font-display text-2xl tracking-tight md:text-[1.75rem]">
              <span className="brand-wordmark">CURAPEX</span>
              <span
                className="brand-live-dot"
                title="Always live"
                aria-label="Always live"
                role="img"
              />
            </span>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.18em] text-sage lg:inline">
              Solutions
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={goTop}
          aria-label="Back to top"
          tabIndex={showTop ? 0 : -1}
          className={`back-to-top back-to-top--header justify-self-center ${
            showTop
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <span>Back to top</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 14l6-6 6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center justify-end gap-2 justify-self-end md:gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-bounce inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                    active
                      ? "font-semibold"
                      : "font-medium text-ink/60 hover:text-ink"
                  }`}
                  style={
                    active
                      ? { background: link.wash, color: link.accent }
                      : undefined
                  }
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-md"
                    style={{
                      background: active
                        ? "color-mix(in srgb, var(--vw-surface) 65%, transparent)"
                        : link.wash,
                      color: link.accent,
                    }}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-3.5 w-3.5"
                    >
                      {link.icon}
                    </svg>
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="nav-bounce inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-px w-full bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-full bg-ink transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-full bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line/70 bg-teal-mist px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1.5">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="nav-bounce flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink"
                  style={
                    active
                      ? { background: link.wash, color: link.accent }
                      : undefined
                  }
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: link.wash, color: link.accent }}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-3.5 w-3.5"
                    >
                      {link.icon}
                    </svg>
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
