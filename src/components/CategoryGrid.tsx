"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import type { ParentCategoryInfo } from "@/lib/medicines";
import { getCategoryInsightMap } from "@/lib/insights";

type CategoryGridProps = {
  categories: ParentCategoryInfo[];
};

type CatTone = { accent: string; wash: string };

const TONES: CatTone[] = [
  { accent: "#1fa8a0", wash: "rgba(31,168,160, 0.12)" },
  { accent: "#3d8ec4", wash: "rgba(61,142,196, 0.12)" },
  { accent: "#9a6a10", wash: "rgba(196, 138, 26, 0.14)" },
  { accent: "#4a8fd8", wash: "rgba(74,143,216, 0.12)" },
  { accent: "#5a9aaa", wash: "rgba(90,154,170, 0.14)" },
  { accent: "#8a4b4b", wash: "rgba(138, 75, 75, 0.12)" },
  { accent: "#6b8aa0", wash: "rgba(107,138,160, 0.1)" },
  { accent: "#7a8a96", wash: "rgba(122,138,150, 0.16)" },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [lifting, setLifting] = useState<string | null>(null);
  const insightMap = useMemo(() => getCategoryInsightMap(), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-cat-card]")
    );
    if (!cards.length) return;

    const reveal = (key: string) => {
      setVisible((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    };

    // Safety only for cards already near the viewport — keep scroll stagger
    const fallback = window.setTimeout(() => {
      const vh = window.innerHeight || 1;
      cards.forEach((card) => {
        const key = card.getAttribute("data-cat-card");
        if (!key) return;
        if (card.getBoundingClientRect().top < vh * 1.1) reveal(key);
      });
    }, 1200);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = entry.target.getAttribute("data-cat-card");
          if (key) reveal(key);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    cards.forEach((card) => observer.observe(card));
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [categories]);

  const handleCardClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
    name: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (navigatingRef.current) {
      e.preventDefault();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    e.preventDefault();
    navigatingRef.current = true;
    setLifting(name);

    window.setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <div
      ref={rootRef}
      className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4"
    >
      {categories.map((cat, index) => {
        const tone = TONES[index % TONES.length];
        const isOn = visible[cat.name];
        const delayMs = (index % 4) * 70 + Math.floor(index / 4) * 35;
        const forms = cat.subcategories
          .slice(0, 2)
          .map((s) => s.name)
          .join(" · ");
        const href = `/catalog?category=${encodeURIComponent(cat.name)}`;
        const guideSlug = insightMap[cat.name];

        return (
          <div
            key={cat.name}
            data-cat-card={cat.name}
            className={`cat-card group ${isOn ? "is-visible" : ""} ${
              lifting === cat.name ? "is-lifting" : ""
            }`}
            style={
              {
                transitionDelay: isOn ? `${delayMs}ms` : "0ms",
                "--cat-accent": tone.accent,
                "--cat-wash": tone.wash,
              } as CSSProperties
            }
          >
            <Link
              href={href}
              onClick={(e) => handleCardClick(e, href, cat.name)}
              className="cat-card-inner"
            >
              <span className="cat-icon" aria-hidden>
                {categoryIcon(cat.name)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="cat-title">{cat.name}</h3>
                <p className="cat-meta">
                  <span className="cat-count-inline">{cat.count}</span>
                  {cat.count === 1 ? " medicine" : " medicines"}
                  {forms ? ` · ${forms}` : ""}
                </p>
              </div>
            </Link>
            {guideSlug && (
              <Link
                href={`/insights/${guideSlug}`}
                className="cat-guide-link"
                onClick={(e) => e.stopPropagation()}
              >
                Wholesale guide
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

function categoryIcon(name: string): ReactNode {
  const key = name.toLowerCase();
  if (key.includes("ed medicine") || key.includes("erectile"))
    return <HeartPulseIcon />;
  if (key.includes("pain")) return <BoltIcon />;
  if (key.includes("steroid")) return <FlaskIcon />;
  if (key.includes("cancer")) return <ShieldIcon />;
  if (key.includes("diabet")) return <DropletIcon />;
  if (key.includes("antiviral") || key.includes("hiv")) return <VirusIcon />;
  if (key.includes("antibiotic") || key.includes("parasitic"))
    return <CapsuleIcon />;
  if (key.includes("anxiety") || key.includes("sleep")) return <MoonIcon />;
  if (key.includes("hypertens") || key.includes("cardiac"))
    return <ActivityIcon />;
  if (key.includes("weight")) return <ScaleIcon />;
  if (key.includes("skin")) return <SparkIcon />;
  if (key.includes("fertility") || key.includes("growth"))
    return <LeafIcon />;
  if (key.includes("thyroid")) return <AtomIcon />;
  if (key.includes("emetic")) return <WaveIcon />;
  return <PillIcon />;
}

function iconProps(children: ReactNode) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.2rem] w-[1.2rem]" aria-hidden>
      {children}
    </svg>
  );
}

function HeartPulseIcon() {
  return iconProps(
    <>
      <path
        d="M19.5 12.5c1.5-1.6 1.5-4.2-.2-5.8a3.9 3.9 0 00-5.3.3L12 9l-1.9-2a3.9 3.9 0 00-5.4-.2c-1.7 1.6-1.7 4.2-.1 5.8L12 20l7.5-7.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4 13h3l2-3 2.5 5 2-3h3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function BoltIcon() {
  return iconProps(
    <path
      d="M13 2L5 14h6l-1 8 9-13h-6l0-7z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function FlaskIcon() {
  return iconProps(
    <path
      d="M9 3h6M10 3v5.2L5.8 18a2.8 2.8 0 002.5 4h7.4a2.8 2.8 0 002.5-4L14 8.2V3M8.5 14h7"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function ShieldIcon() {
  return iconProps(
    <path
      d="M12 3l8 3.5v5.2c0 5-3.4 8.5-8 9.8-4.6-1.3-8-4.8-8-9.8V6.5L12 3z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function DropletIcon() {
  return iconProps(
    <path
      d="M12 3s6 6.2 6 11a6 6 0 11-12 0c0-4.8 6-11 6-11z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function VirusIcon() {
  return iconProps(
    <>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </>
  );
}

function CapsuleIcon() {
  return iconProps(
    <path
      d="M8.5 15.5l7-7a3.5 3.5 0 015 5l-7 7a3.5 3.5 0 01-5-5zM10.2 10.2l3.6 3.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function MoonIcon() {
  return iconProps(
    <path
      d="M19 14.5A7.5 7.5 0 119.5 5a6 6 0 009.5 9.5z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function ActivityIcon() {
  return iconProps(
    <path
      d="M3 12h4l2.5-6 4 12L16 9h5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function ScaleIcon() {
  return iconProps(
    <path
      d="M12 4v16M7 8h10M6 8l-3 5a3 3 0 006 0L6 8zm12 0l-3 5a3 3 0 006 0l-3-5z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function SparkIcon() {
  return iconProps(
    <path
      d="M12 3l1.2 5.2L18 9l-4 3.2L15.2 18 12 14.8 8.8 18 10 12.2 6 9l4.8-.8L12 3z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function LeafIcon() {
  return iconProps(
    <path
      d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14zM5 19c4-4 7-7 10-10"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function AtomIcon() {
  return iconProps(
    <>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(-60 12 12)"
      />
    </>
  );
}

function WaveIcon() {
  return iconProps(
    <path
      d="M3 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 9c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  );
}

function PillIcon() {
  return iconProps(
    <path
      d="M10 4h4a2 2 0 012 2v4H8V6a2 2 0 012-2zM8 10h8v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-8z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}
