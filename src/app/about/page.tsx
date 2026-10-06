import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import BrandMark from "@/components/BrandMark";
import { getReviewStats } from "@/lib/reviews-store";

export const metadata: Metadata = {
  title: "About",
  description:
    "Curapex Solutions — India-based pharmaceutical wholesaler, distributor & exporter. Est. 2021.",
};

const facts: {
  label: string;
  value: string;
  detail: string;
  accent: string;
  wash: string;
  icon: ReactNode;
}[] = [
  {
    label: "Nature of business",
    value: "Wholesaler / Distributor",
    detail: "Exporter · manufacturer · trader",
    accent: "#1fa8a0",
    wash: "rgba(31,168,160, 0.12)",
    icon: <BriefcaseIcon />,
  },
  {
    label: "Legal status",
    value: "Registered business",
    detail: "Wholesale & export trade",
    accent: "#3d8ec4",
    wash: "rgba(61,142,196, 0.12)",
    icon: <SealIcon />,
  },
  {
    label: "Established",
    value: "2021",
    detail: "Focused B2B supply desk",
    accent: "#8a6a12",
    wash: "rgba(201, 162, 39, 0.14)",
    icon: <CalendarIcon />,
  },
  {
    label: "Team size",
    value: "Up to 10 people",
    detail: "Focused wholesale & export desk",
    accent: "#7a8a96",
    wash: "rgba(122,138,150, 0.16)",
    icon: <TeamIcon />,
  },
  {
    label: "Exporting",
    value: "3+ years",
    detail: "International partner supply",
    accent: "#4a8fd8",
    wash: "rgba(74,143,216, 0.12)",
    icon: <GlobeIcon />,
  },
  {
    label: "Product range",
    value: "Tablets to injectables",
    detail: "Capsules · creams · specialty meds",
    accent: "#5a9ae0",
    wash: "rgba(90,154,224, 0.12)",
    icon: <CapsuleIcon />,
  },
  {
    label: "Additional business",
    value: "Wholesale",
    detail: "Bulk & partner-ready supply",
    accent: "#1fa8a0",
    wash: "rgba(31,168,160, 0.1)",
    icon: <CartIcon />,
  },
];

const exportMarkets = [
  { name: "United Kingdom", code: "gb" },
  { name: "United States", code: "us" },
  { name: "Germany", code: "de" },
  { name: "Netherlands", code: "nl" },
  { name: "Belgium", code: "be" },
];

// Review stats come from storage; refresh hourly in case a revalidation is missed.
export const revalidate = 3600;

export default async function AboutPage() {
  const { average, count } = await getReviewStats();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      {/* Intro */}
      <header
        data-scroll
        className="grid items-start gap-x-8 gap-y-5 md:grid-cols-[auto_1fr] md:gap-x-12"
      >
        <div className="flex h-[6.5rem] w-[10.5rem] shrink-0 flex-col items-center justify-center gap-1.5 md:h-[7.75rem] md:w-[12.5rem]">
          <BrandMark className="h-12 w-12 md:h-14 md:w-14" />
          <div className="text-center leading-none">
            <p className="font-display text-xl tracking-tight md:text-2xl">
              <span className="brand-wordmark">CurApex</span>
            </p>
            <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#7a858e] md:text-[0.75rem]">
              Solutions
            </p>
          </div>
          <h1 className="sr-only">Curapex Solutions</h1>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sage">About</p>
          <p className="mt-2 max-w-xl text-base leading-snug text-ink-soft/80 md:text-lg">
            India-based pharmaceutical wholesaler, distributor &amp; exporter.
          </p>

          <ul className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.8rem] text-ink-soft/80 md:mt-5">
            <li className="inline-flex items-center gap-1">
              <CalendarSmallIcon />
              Est. 2021
            </li>
            {count > 0 && (
              <li>
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-1 transition hover:text-teal"
                  aria-label={`${average.toFixed(1)} from ${count} reviews`}
                >
                  <StarsMini value={average} />
                  <span className="font-semibold tabular-nums text-ink">
                    {average.toFixed(1)}
                  </span>
                  <span className="text-ink-soft/55">({count})</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="max-w-3xl md:col-span-2">
          <p className="text-base leading-relaxed text-ink-soft/85 md:text-lg">
            Established in 2021, Curapex Solutions is an India-based exporter,
            manufacturer, wholesaler, and trader of pharmaceutical tablets,
            capsules, injections, creams, and related specialty medicines.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft/75 md:text-base">
            We focus on reliable supply, clear communication, and quality
            products for domestic and international partners — with transparent
            trade terms and responsive enquiry handling through the catalog.
          </p>
        </div>
      </header>

      {/* Color-coded fact grid */}
      <section data-scroll className="mt-10 md:mt-12">
        <div className="mb-2">
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage">
            At a glance
          </p>
          <h2 className="mt-0.5 font-display text-base text-ink md:text-lg">
            Company details
          </h2>
        </div>

        <div className="flex flex-col gap-1.5">
          {facts.map((fact) => (
            <article
              key={fact.label}
              className="group relative overflow-hidden rounded-lg border border-line/80 bg-surface/70 px-2.5 py-[0.45rem] transition hover:border-transparent hover:shadow-[0_10px_24px_-20px_rgba(107,138,160,0.3)]"
              style={
                {
                  "--fact-accent": fact.accent,
                  "--fact-wash": fact.wash,
                } as CSSProperties
              }
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-90"
                style={{
                  background: `radial-gradient(120% 90% at 0% 0%, ${fact.wash}, transparent 55%)`,
                }}
              />
              <div
                className="absolute left-0 top-0 h-full w-px rounded-l-lg"
                style={{ background: fact.accent }}
              />
              <div className="relative flex items-center gap-2">
                <span
                  className="inline-flex h-[1.35rem] w-[1.35rem] shrink-0 items-center justify-center rounded"
                  style={{
                    background: fact.wash,
                    color: fact.accent,
                  }}
                >
                  {fact.icon}
                </span>
                <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:justify-between sm:gap-2.5">
                  <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2.5">
                    <p
                      className="text-[0.6rem] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: fact.accent }}
                    >
                      {fact.label}
                    </p>
                    <p className="font-display text-[0.84rem] leading-tight text-ink">
                      {fact.value}
                    </p>
                  </div>
                  <p className="text-[0.66rem] leading-tight text-ink-soft/65 sm:text-right sm:shrink-0">
                    {fact.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Export markets */}
      <section data-scroll className="mt-8 md:mt-10">
        <div className="mb-2">
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage">
            Trade reach
          </p>
          <h2 className="mt-0.5 font-display text-base text-ink md:text-lg">
            Top export markets
          </h2>
          <p className="mt-0.5 max-w-xl text-[0.7rem] text-ink-soft/70">
            Primary destinations we serve wholesale and export partners.
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {exportMarkets.map((m) => (
            <li
              key={m.code}
              className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/70 py-1 pl-1 pr-2.5"
            >
              <span className="relative inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-line/70">
                <Image
                  src={`/images/flags/${m.code}.png`}
                  alt=""
                  width={20}
                  height={20}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="text-xs font-medium text-ink">{m.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How we work */}
      <section data-scroll className="mt-10 grid gap-2 sm:grid-cols-3 md:mt-12">
        {[
          {
            title: "Browse",
            text: "Filter by category & dosage form.",
            accent: "#1fa8a0",
            icon: <SearchIcon />,
          },
          {
            title: "Enquire",
            text: "Submit quantity and contact via the catalog.",
            accent: "#25D366",
            icon: <ChatIcon />,
          },
          {
            title: "Supply",
            text: "Wholesale & export supply.",
            accent: "#3d8ec4",
            icon: <TruckIcon />,
          },
        ].map((step) => (
          <div
            key={step.title}
            className="flex items-center gap-2 rounded-xl border border-line/70 bg-surface/50 px-2.5 py-2"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: step.accent }}
            >
              {step.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink">{step.title}</p>
              <p className="text-[0.68rem] leading-snug text-ink-soft/70">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </section>

      <div data-scroll className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-medium text-white hover:bg-teal-deep"
        >
          Browse the catalog
          <ArrowIcon />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-teal underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function CalendarSmallIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-ink-soft/60"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="4"
        y="5.5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 3.5V7M16 3.5V7M4 10h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarsMini({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span
      className="inline-flex items-center gap-0.5 text-amber-500"
      aria-hidden
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill={i < full ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={i < full ? 0 : 1.4}
        >
          <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
        </svg>
      ))}
    </span>
  );
}

function iconClass() {
  return "h-3 w-3";
}

function BriefcaseIcon() {
  return (
    <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7M4 9a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9zM4 12h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SealIcon() {
  return (
    <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l2.2 2.2L17 4.5l.3 2.8L20 8.5l-1.5 2.4L20 13.3l-2.7 1.2-.3 2.8L14.2 16.6 12 18.8l-2.2-2.2-2.8.7.3-2.8L4 13.3l1.5-2.4L4 8.5l2.7-1.2.3-2.8 2.8.7L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.2l1.6 1.6 3.4-3.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 18c.9-2.2 2.7-3.4 5.5-3.4s4.6 1.2 5.5 3.4M14 14.2c1.8.2 3.2 1.1 4 2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 3.5V7M16 3.5V7M3.5 10h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.5 12h17M12 3.5c2.5 2.8 3.8 5.6 3.8 8.5S14.5 17.7 12 20.5C9.5 17.7 8.2 14.9 8.2 12S9.5 6.3 12 3.5z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CapsuleIcon() {
  return (
    <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 15.5l7-7a3.5 3.5 0 015 5l-7 7a3.5 3.5 0 01-5-5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 5h1.8l1.6 10.2a1.5 1.5 0 001.5 1.3h8.4a1.5 1.5 0 001.5-1.2L20 8H7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 18.5L4 21V7a3 3 0 013-3h10a3 3 0 013 3v8.5a3 3 0 01-3 3H7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7h11v10H3V7zM14 10h4l3 3v4h-7v-7zM7 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
