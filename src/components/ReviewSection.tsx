"use client";

import { useState, type ReactNode } from "react";
import ReviewForm, { type MedicineOption } from "./ReviewForm";

type ReviewSectionProps = {
  medicines: MedicineOption[];
  average: number;
  count: number;
};

export default function ReviewSection({
  medicines,
  average,
  count,
}: ReviewSectionProps) {
  const [open, setOpen] = useState(false);

  const chips: {
    label: string;
    accent: string;
    wash: string;
    icon: ReactNode;
  }[] = [
    {
      label: `${average.toFixed(1)} average`,
      accent: "#9a6a10",
      wash: "rgba(196, 138, 26, 0.14)",
      icon: <StarIcon />,
    },
    {
      label: `${count} reviews`,
      accent: "#1fa8a0",
      wash: "rgba(31,168,160, 0.12)",
      icon: <ChatIcon />,
    },
    {
      label: "Medicine-tagged",
      accent: "#3d8ec4",
      wash: "rgba(61,142,196, 0.12)",
      icon: <CapsuleIcon />,
    },
    {
      label: "Live on site",
      accent: "#5a9aaa",
      wash: "rgba(90,154,170, 0.14)",
      icon: <BoltIcon />,
    },
  ];

  return (
    <section
      data-scroll
      className="relative overflow-hidden rounded-2xl border border-line/80 bg-surface/65"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 80% at 0% 0%, rgba(31,168,160,0.1), transparent 55%), radial-gradient(70% 60% at 100% 0%, rgba(196,138,26,0.1), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-end md:gap-6 md:p-5">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-amber-700 ring-1 ring-amber-500/20"
              style={{ background: "rgba(196, 138, 26, 0.14)" }}
              aria-hidden
            >
              <QuoteIcon />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sage">
                Reviews
              </p>
              <h1 className="mt-0.5 font-display text-2xl text-ink md:text-3xl">
                Partner feedback
              </h1>
            </div>
          </div>

          <p className="mt-2 max-w-xl text-sm leading-snug text-ink-soft/80">
            Read feedback from wholesale partners — or leave your own rating.
            New reviews appear on this page as soon as you submit.
          </p>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <li
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: chip.wash, color: chip.accent }}
              >
                {chip.icon}
                {chip.label}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center justify-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-medium transition md:self-end ${
            open
              ? "border border-ink/15 bg-sand text-ink"
              : "bg-teal text-white hover:bg-teal-deep"
          }`}
          aria-expanded={open}
        >
          {open ? (
            <>
              <CloseIcon />
              Close form
            </>
          ) : (
            <>
              <PenIcon />
              Write a review
            </>
          )}
        </button>
      </div>

      {open ? (
        <div className="relative border-t border-line/70 px-5 pb-5 pt-4 md:px-7 md:pb-7">
          <div className="animate-fade-up">
            <ReviewForm medicines={medicines} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function QuoteIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.2 17.5c-1.9 0-3.4-1.5-3.4-3.5 0-2.6 2.1-5.2 5.2-7l.7 1.1c-1.9 1.2-2.9 2.6-3 4.1.5-.3 1.1-.4 1.7-.4 1.7 0 3 1.2 3 2.9 0 1.7-1.3 2.8-3.2 2.8zm9.1 0c-1.9 0-3.4-1.5-3.4-3.5 0-2.6 2.1-5.2 5.2-7l.7 1.1c-1.9 1.2-2.9 2.6-3 4.1.5-.3 1.1-.4 1.7-.4 1.7 0 3 1.2 3 2.9 0 1.7-1.3 2.8-3.2 2.8z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 2.5l2.2 4.5 5 .7-3.6 3.5.9 5L10 13.8 5.5 16.2l.9-5L2.8 7.7l5-.7L10 2.5z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 017.5 4h9A2.5 2.5 0 0119 6.5v6a2.5 2.5 0 01-2.5 2.5H11l-4 3.2V15H7.5A2.5 2.5 0 015 12.5v-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CapsuleIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 4.5a4 4 0 015.7 0l5.3 5.3a4 4 0 11-5.7 5.7L8.5 10.2a4 4 0 010-5.7z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M9.8 9.8l4.4 4.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 3L5.5 13.5H11L10 21l8-11.5H13.5L13 3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20l3.8-.7L19 8.1a1.8 1.8 0 00-2.5-2.5L5.3 16.8 4 20z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
