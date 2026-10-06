import Link from "next/link";
import type { ReactNode } from "react";
import type { Medicine } from "@/types/medicine";
import {
  dosageGlyph,
  toneForCategory,
  toneForForm,
} from "@/lib/categoryStyle";
import { getPrimaryInsightForCategory } from "@/lib/insights";
import { formatUsd, inrToUsd, parseUnitPrice } from "@/lib/price";
import { descriptionParagraphs, presentFields } from "@/lib/medicines";
import EnquireButton from "./EnquireButton";
import ProductGallery from "./ProductGallery";
import SpecsPanel from "./SpecsPanel";

export default function MedicineDetail({ medicine }: { medicine: Medicine }) {
  const parentTone = toneForCategory(
    medicine.parentCategory || medicine.category
  );
  const formTone = toneForForm(medicine.category || medicine.dosageForm);
  const glyph = dosageGlyph(medicine.category || medicine.dosageForm);
  const unit = parseUnitPrice(medicine.price);
  const unitUsd = unit ? inrToUsd(unit.amountInr) : null;
  const relatedGuide = getPrimaryInsightForCategory(
    medicine.parentCategory || medicine.category
  );

  const paragraphs = descriptionParagraphs(medicine.description);
  const fields = presentFields(medicine).filter(
    (row) => row.label.toLowerCase() !== "price"
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <nav
        data-scroll
        className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft/70"
      >
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition hover:bg-teal-mist hover:text-teal"
        >
          Catalog
        </Link>
        {medicine.parentCategory && (
          <>
            <Chevron />
            <Link
              href={`/catalog?category=${encodeURIComponent(medicine.parentCategory)}`}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition hover:bg-teal-mist hover:text-teal"
            >
              {medicine.parentCategory}
            </Link>
          </>
        )}
        <Chevron />
        <span className="rounded-full bg-sand px-2 py-0.5 text-ink">
          {medicine.category}
        </span>
      </nav>

      <div
        data-scroll
        className="mt-6 grid items-start gap-8 lg:grid-cols-2 lg:gap-12"
      >
        <div
          className="rounded-2xl border border-line/70 bg-surface/70"
          style={{
            background: `radial-gradient(120% 90% at 0% 0%, ${parentTone.wash}, transparent 55%), rgba(255,255,255,0.75)`,
          }}
        >
          <div className="rounded-t-2xl border-b border-line/60 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {medicine.parentCategory && (
                <Chip
                  accent={parentTone.accent}
                  wash={parentTone.wash}
                  icon={categoryIcon(medicine.parentCategory)}
                  label={medicine.parentCategory}
                />
              )}
              <Chip
                accent={formTone.accent}
                wash={formTone.wash}
                icon={<DosageIcon kind={glyph} />}
                label={medicine.category || "Medicine"}
              />
            </div>
          </div>
          <div className="p-3 md:p-4">
            <ProductGallery images={medicine.images || []} name={medicine.name} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">
            Product details
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem] text-balance">
            {medicine.name}
          </h1>

          {paragraphs.length > 0 && (
            <div className="mt-2.5 space-y-1.5 text-[0.8125rem] leading-relaxed text-ink-soft/75 md:text-sm">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {medicine.composition && (
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-soft/85 md:text-base">
              <span
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                style={{
                  background: parentTone.wash,
                  color: parentTone.accent,
                }}
                aria-hidden
              >
                <FlaskIcon />
              </span>
              <span>
                <span className="text-ink-soft/55">Composition · </span>
                {medicine.composition}
              </span>
            </p>
          )}

          {unitUsd != null && unit && (
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft/55">
                Listed price
              </p>
              <p
                className="font-display text-xl tabular-nums md:text-2xl"
                style={{ color: parentTone.accent }}
              >
                {formatUsd(unitUsd)}
                <span className="ml-1 text-sm font-sans font-medium text-ink-soft/60">
                  / {unit.unit}
                </span>
              </p>
              <p className="w-full text-[0.7rem] font-medium text-red-600">
                Shipping charges are extra.
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <EnquireButton
              medicineName={medicine.name}
              price={medicine.price}
              className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-deep"
            >
              Enquire now
              <ArrowIcon />
            </EnquireButton>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface/70 px-5 py-3 text-sm font-medium text-ink transition hover:border-teal/40 hover:text-teal"
            >
              Back to catalog
            </Link>
          </div>

          {fields.length > 0 && (
            <SpecsPanel
              fields={fields.map((row) => ({
                label: row.label,
                value:
                  row.label.toLowerCase() === "price" && unitUsd && unit
                    ? `${formatUsd(unitUsd)} / ${unit.unit}`
                    : row.value,
              }))}
              parentTone={parentTone}
              formTone={formTone}
            />
          )}
        </div>
      </div>

      <section
        data-scroll
        className="mt-12 overflow-hidden rounded-2xl border border-line/70 px-5 py-6 md:px-7 md:py-7"
        style={{
          background: `radial-gradient(90% 80% at 0% 0%, ${parentTone.wash}, transparent 55%), rgba(255,255,255,0.65)`,
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
              Next step
            </p>
            <h2 className="mt-1 font-display text-xl text-ink md:text-2xl">
              Interested in {medicine.name}?
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-ink-soft/75">
              Tell us quantity and contact details — we&apos;ll reply with
              availability and next steps.
            </p>
          </div>
          <EnquireButton
            medicineName={medicine.name}
            price={medicine.price}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-deep"
          >
            Enquire now
            <ArrowIcon />
          </EnquireButton>
        </div>
      </section>

      {relatedGuide && (
        <section
          data-scroll
          className="mt-6 overflow-hidden rounded-2xl border border-line/70 px-5 py-5 md:px-6"
          style={{
            background: `radial-gradient(90% 80% at 0% 0%, ${parentTone.wash}, transparent 55%), rgba(255,255,255,0.7)`,
          }}
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
            Related trade guide
          </p>
          <h2 className="mt-1 font-display text-lg text-ink md:text-xl">
            {relatedGuide.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-soft/75">
            {relatedGuide.description}
          </p>
          <Link
            href={`/insights/${relatedGuide.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
          >
            Read wholesale guide
            <span aria-hidden>→</span>
          </Link>
        </section>
      )}
    </div>
  );
}

function Chip({
  accent,
  wash,
  icon,
  label,
}: {
  accent: string;
  wash: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: wash, color: accent }}
    >
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface/70"
        aria-hidden
      >
        {icon}
      </span>
      {label}
    </span>
  );
}

function Chevron() {
  return (
    <svg className="h-3.5 w-3.5 text-ink-soft/40" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function iconSvg(children: ReactNode, className = "h-3.5 w-3.5") {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {children}
    </svg>
  );
}

function categoryIcon(name: string): ReactNode {
  const key = name.toLowerCase();
  if (key.includes("ed") || key.includes("erectile")) return iconSvg(<path d="M19.5 12.5c1.5-1.6 1.5-4.2-.2-5.8a3.9 3.9 0 00-5.3.3L12 9l-1.9-2a3.9 3.9 0 00-5.4-.2c-1.7 1.6-1.7 4.2-.1 5.8L12 20l7.5-7.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
  if (key.includes("pain")) return iconSvg(<path d="M13 2L5 14h6l-1 8 9-13h-6l0-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
  if (key.includes("cancer")) return iconSvg(<path d="M12 3l8 3.5v5.2c0 5-3.4 8.5-8 9.8-4.6-1.3-8-4.8-8-9.8V6.5L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
  if (key.includes("diabet")) return <DropletIcon />;
  if (key.includes("cardiac") || key.includes("hypertens")) return iconSvg(<path d="M3 12h4l2.5-6 4 12L16 9h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />);
  if (key.includes("antibiotic") || key.includes("parasitic")) return <CapsuleIcon />;
  return <PillIcon />;
}

function DosageIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "syringe":
      return iconSvg(<path d="M14 4l6 6M16.5 6.5l-9 9M8 15l-3 3 1 2 2 1 3-3M11 12l2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />);
    case "capsule":
      return <CapsuleIcon />;
    case "drop":
      return <DropletIcon />;
    case "tube":
      return iconSvg(<path d="M9 4h6v3H9V4zM10 7h4v11a2 2 0 01-2 2h0a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
    case "bottle":
      return iconSvg(<path d="M10 3h4v3h-4V3zM9 6h6l1 3v9a2 2 0 01-2 2H10a2 2 0 01-2-2V9l1-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
    case "inhaler":
      return iconSvg(<path d="M8 4h5l3 4v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8l1-4zM11 14h2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
    default:
      return <PillIcon />;
  }
}

function FlaskIcon() {
  return iconSvg(<path d="M9 3h6M10 3v5.2L5.8 18a2.8 2.8 0 002.5 4h7.4a2.8 2.8 0 002.5-4L14 8.2V3M8.5 14h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />);
}

function ArrowIcon() {
  return iconSvg(<path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />, "h-3.5 w-3.5");
}

function CapsuleIcon() {
  return iconSvg(<path d="M8.5 15.5l7-7a3.5 3.5 0 015 5l-7 7a3.5 3.5 0 01-5-5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
}

function PillIcon() {
  return iconSvg(<><rect x="5" y="8" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="1.7" /><path d="M12 8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></>);
}

function DropletIcon() {
  return iconSvg(<path d="M12 3s6 6.2 6 11a6 6 0 11-12 0c0-4.8 6-11 6-11z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);
}
