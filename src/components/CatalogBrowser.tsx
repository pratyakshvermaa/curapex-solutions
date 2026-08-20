"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Medicine } from "@/types/medicine";
import {
  dosageGlyph,
  toneForCategory,
  toneForForm,
} from "@/lib/categoryStyle";
import { getPrimaryInsightForCategory } from "@/lib/insights";
import MedicineGrid from "./MedicineGrid";
import CategoryInsightBanner from "./CategoryInsightBanner";

type CatalogBrowserProps = {
  medicines: Medicine[];
  parentCategories: string[];
  initialParent?: string;
  initialSubcategory?: string;
};

export default function CatalogBrowser({
  medicines,
  parentCategories,
  initialParent = "All",
  initialSubcategory = "All",
}: CatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [parent, setParent] = useState(initialParent);
  const [subcategory, setSubcategory] = useState(initialSubcategory);

  useEffect(() => {
    setParent(initialParent);
  }, [initialParent]);

  useEffect(() => {
    setSubcategory(initialSubcategory);
  }, [initialSubcategory]);

  const subcategories = useMemo(() => {
    const list = medicines
      .filter(
        (m) =>
          parent === "All" ||
          (m.parentCategory || "General Medicines") === parent
      )
      .map((m) => m.category);
    return Array.from(new Set(list)).sort();
  }, [medicines, parent]);

  useEffect(() => {
    if (subcategory !== "All" && !subcategories.includes(subcategory)) {
      setSubcategory("All");
    }
  }, [parent, subcategories, subcategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return medicines.filter((m) => {
      const parentOk =
        parent === "All" ||
        (m.parentCategory || "General Medicines") === parent;
      const subOk = subcategory === "All" || m.category === subcategory;
      if (!parentOk || !subOk) return false;
      if (!q) return true;
      const hay = [
        m.name,
        m.composition,
        m.brand,
        m.category,
        m.parentCategory,
        m.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [medicines, query, parent, subcategory]);

  const resetKey = `${parent}|${subcategory}|${query}`;
  const allTone = { accent: "#1fa8a0", wash: "rgba(31,168,160,0.12)" };
  const categoryInsight =
    parent !== "All" ? getPrimaryInsightForCategory(parent) : undefined;

  return (
    <div>
      <div data-scroll className="catalog-filter-panel">
        <div className="catalog-toolbar">
          <label className="block w-full lg:max-w-md">
            <span className="text-xs uppercase tracking-[0.16em] text-sage">
              Search
            </span>
            <span className="relative mt-2 block">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-teal">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or composition…"
                className="w-full rounded-xl border border-line bg-surface/90 py-3 pl-10 pr-4 text-sm outline-none ring-teal/30 transition focus:ring-2"
              />
            </span>
          </label>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto lg:min-w-[28rem]">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-sage">
                Category
              </span>
              <select
                value={parent}
                onChange={(e) => {
                  setParent(e.target.value);
                  setSubcategory("All");
                }}
                className="mt-2 w-full rounded-xl border border-line bg-surface/90 px-4 py-3 text-sm outline-none ring-teal/30 transition focus:ring-2"
              >
                <option value="All">All categories</option>
                {parentCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-sage">
                Dosage form
              </span>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-surface/90 px-4 py-3 text-sm outline-none ring-teal/30 transition focus:ring-2"
              >
                <option value="All">All forms</option>
                {subcategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 pt-1">
          <div className="mb-2.5 flex items-center gap-2">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-md"
              style={{ background: allTone.wash, color: allTone.accent }}
              aria-hidden
            >
              <LayersIcon />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
              Categories
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="All"
              active={parent === "All"}
              accent={allTone.accent}
              wash={allTone.wash}
              icon={<GridIcon />}
              onClick={() => {
                setParent("All");
                setSubcategory("All");
              }}
            />
            {parentCategories.map((c) => {
              const tone = toneForCategory(c);
              return (
                <FilterChip
                  key={c}
                  label={c}
                  active={parent === c}
                  accent={tone.accent}
                  wash={tone.wash}
                  icon={categoryIcon(c)}
                  onClick={() => {
                    setParent(c);
                    setSubcategory("All");
                  }}
                />
              );
            })}
          </div>
        </div>

        {subcategories.length > 0 && (
          <div className="mt-4 border-t border-line/70 pt-4">
            <div className="mb-2.5 flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-md"
                style={{
                  background: "rgba(61,142,196,0.12)",
                  color: "#3d8ec4",
                }}
                aria-hidden
              >
                <CapsuleIcon />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
                Dosage forms
                {parent !== "All" ? (
                  <span className="ml-1 font-medium normal-case tracking-normal text-ink-soft/60">
                    in {parent}
                  </span>
                ) : null}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="All forms"
                active={subcategory === "All"}
                accent="#6b8aa0"
                wash="rgba(107,138,160,0.1)"
                icon={<LayersIcon />}
                onClick={() => setSubcategory("All")}
              />
              {subcategories.map((c) => {
                const tone = toneForForm(c);
                const glyph = dosageGlyph(c);
                return (
                  <FilterChip
                    key={c}
                    label={c}
                    active={subcategory === c}
                    accent={tone.accent}
                    wash={tone.wash}
                    icon={<DosageIcon kind={glyph} />}
                    onClick={() => setSubcategory(c)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {categoryInsight && <CategoryInsightBanner article={categoryInsight} />}

      <div
        data-scroll
        className="mt-8 flex items-end justify-between gap-4 border-t border-line/70 pt-6"
      >
        <p className="font-display text-2xl text-ink md:text-3xl">
          {filtered.length === medicines.length
            ? "Full collection"
            : "Filtered results"}
        </p>
        <p className="text-sm text-ink-soft/70">
          {filtered.length} of {medicines.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div data-scroll className="mt-20 text-center">
          <p className="font-display text-2xl text-ink">No medicines found</p>
          <p className="mt-2 text-sm text-ink-soft/70">
            Try another search term or clear the filters.
          </p>
        </div>
      ) : (
        <div data-scroll-skip className="mt-10 md:mt-14">
          <MedicineGrid medicines={filtered} resetKey={resetKey} />
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  accent,
  wash,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  accent: string;
  wash: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition hover:brightness-[0.98]"
      style={
        {
          background: active ? accent : wash,
          color: active ? "#fff" : accent,
          boxShadow: active
            ? `0 8px 20px -12px ${accent}`
            : `inset 0 0 0 1px ${accent}33`,
        } as CSSProperties
      }
    >
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.65)",
        }}
        aria-hidden
      >
        {icon}
      </span>
      {label}
    </button>
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
  if (key.includes("fertility") || key.includes("growth")) return <LeafIcon />;
  if (key.includes("thyroid")) return <AtomIcon />;
  if (key.includes("emetic")) return <WaveIcon />;
  return <PillIcon />;
}

function iconSvg(children: ReactNode) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
      {children}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LayersIcon() {
  return iconSvg(
    <path
      d="M12 4l8 4-8 4-8-4 8-4zm-8 8l8 4 8-4M4 16l8 4 8-4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function GridIcon() {
  return iconSvg(
    <path
      d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function DosageIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "syringe":
      return iconSvg(
        <path
          d="M14 4l6 6M16.5 6.5l-9 9M8 15l-3 3 1 2 2 1 3-3M11 12l2 2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "capsule":
      return <CapsuleIcon />;
    case "tube":
      return iconSvg(
        <path
          d="M9 4h6v3H9V4zM10 7h4v11a2 2 0 01-2 2h0a2 2 0 01-2-2V7z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      );
    case "drop":
      return <DropletIcon />;
    case "bottle":
      return iconSvg(
        <path
          d="M10 3h4v3h-4V3zM9 6h6l1 3v9a2 2 0 01-2 2H10a2 2 0 01-2-2V9l1-3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      );
    case "inhaler":
      return iconSvg(
        <path
          d="M8 4h5l3 4v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8l1-4zM11 14h2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      );
    case "jelly":
      return iconSvg(
        <path
          d="M7 10c0-3 2.2-5 5-5s5 2 5 5c0 4-2 9-5 9s-5-5-5-9z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      );
    default:
      return <PillIcon />;
  }
}

function HeartPulseIcon() {
  return iconSvg(
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
  return iconSvg(
    <path
      d="M13 2L5 14h6l-1 8 9-13h-6l0-7z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function FlaskIcon() {
  return iconSvg(
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
  return iconSvg(
    <path
      d="M12 3l8 3.5v5.2c0 5-3.4 8.5-8 9.8-4.6-1.3-8-4.8-8-9.8V6.5L12 3z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function DropletIcon() {
  return iconSvg(
    <path
      d="M12 3s6 6.2 6 11a6 6 0 11-12 0c0-4.8 6-11 6-11z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function VirusIcon() {
  return iconSvg(
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
  return iconSvg(
    <path
      d="M8.5 15.5l7-7a3.5 3.5 0 015 5l-7 7a3.5 3.5 0 01-5-5zM10.2 10.2l3.6 3.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function MoonIcon() {
  return iconSvg(
    <path
      d="M19 14.5A7.5 7.5 0 119.5 5a6 6 0 009.5 9.5z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function ActivityIcon() {
  return iconSvg(
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
  return iconSvg(
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
  return iconSvg(
    <path
      d="M12 3l1.2 5.2L18 9l-4 3.2L15.2 18 12 14.8 8.8 18 10 12.2 6 9l4.8-.8L12 3z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  );
}

function LeafIcon() {
  return iconSvg(
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
  return iconSvg(
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
  return iconSvg(
    <path
      d="M3 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 9c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  );
}

function PillIcon() {
  return iconSvg(
    <>
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
    </>
  );
}
