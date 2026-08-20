"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Medicine } from "@/types/medicine";
import { snippet } from "@/lib/medicines";
import { dosageGlyph, toneForCategory } from "@/lib/categoryStyle";

type MedicineCardProps = {
  medicine: Medicine;
  index?: number;
  reveal?: boolean;
  delayMs?: number;
};

export default function MedicineCard({
  medicine,
  index = 0,
  reveal = true,
  delayMs = 0,
}: MedicineCardProps) {
  const image = medicine.images?.[0];
  const summary = snippet(medicine.description || medicine.composition, 90);
  const tone = toneForCategory(medicine.parentCategory || medicine.category);
  const variant = index % 6;
  const glyph = dosageGlyph(medicine.category || medicine.dosageForm);

  return (
    <article
      data-med-card={medicine.slug}
      className={`med-card med-variant-${variant} group ${
        reveal ? "is-visible" : ""
      }`}
      style={
        {
          "--med-accent": tone.accent,
          "--med-wash": tone.wash,
          "--med-mist": tone.mist,
          transitionDelay: reveal ? `${delayMs}ms` : "0ms",
        } as CSSProperties
      }
    >
      <Link href={`/catalog/${medicine.slug}`} className="med-card-link">
        <div className="med-media">
          <span className="med-glyph" aria-hidden>
            <DosageIcon kind={glyph} />
          </span>
          {image ? (
            <Image
              src={image}
              alt={medicine.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-3.5 transition duration-700 ease-out group-hover:scale-[1.04] sm:p-4"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-sage">
              No image
            </div>
          )}
        </div>

        <div className="med-body">
          <div className="med-meta">
            <span className="med-chip">
              {medicine.parentCategory || medicine.category}
            </span>
            {medicine.category && medicine.parentCategory && (
              <span className="med-form">{medicine.category}</span>
            )}
          </div>
          <h3 className="med-name">{medicine.name}</h3>
          {summary && <p className="med-summary">{summary}</p>}
        </div>
      </Link>

      <div className="med-actions">
        <Link href={`/catalog/${medicine.slug}`} className="med-view">
          <span className="med-view-label">View details</span>
          <span className="med-view-arrow" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

function DosageIcon({ kind }: { kind: string }) {
  const common = {
    className: "h-4 w-4",
    viewBox: "0 0 24 24",
    fill: "none" as const,
    "aria-hidden": true,
  };

  switch (kind) {
    case "syringe":
      return (
        <svg {...common}>
          <path
            d="M14 4l6 6M16.5 6.5l-9 9M8 15l-3 3 1 2 2 1 3-3M11 12l2 2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "capsule":
      return (
        <svg {...common}>
          <path
            d="M8.5 15.5l7-7a3.5 3.5 0 015 5l-7 7a3.5 3.5 0 01-5-5z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tube":
      return (
        <svg {...common}>
          <path
            d="M9 4h6v3H9V4zM10 7h4v11a2 2 0 01-2 2h0a2 2 0 01-2-2V7z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "drop":
      return (
        <svg {...common}>
          <path
            d="M12 3s5.5 5.8 5.5 10a5.5 5.5 0 11-11 0C6.5 8.8 12 3 12 3z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bottle":
      return (
        <svg {...common}>
          <path
            d="M10 3h4v3h-4V3zM9 6h6l1 3v9a2 2 0 01-2 2H10a2 2 0 01-2-2V9l1-3z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "inhaler":
      return (
        <svg {...common}>
          <path
            d="M8 4h5l3 4v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8l1-4zM11 14h2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "jelly":
      return (
        <svg {...common}>
          <path
            d="M7 10c0-3 2.2-5 5-5s5 2 5 5c0 4-2 9-5 9s-5-5-5-9z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect
            x="5"
            y="8"
            width="14"
            height="8"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 8v8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
