import type { Metadata } from "next";
import CatalogBrowser from "@/components/CatalogBrowser";
import {
  getAllMedicines,
  getParentCategories,
  getCategories,
} from "@/lib/medicines";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse Curapex Solutions' pharmaceutical catalog — filter by category and dosage form, then submit a wholesale enquiry.",
};

type CatalogPageProps = {
  searchParams?: { category?: string; form?: string };
};

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  const medicines = getAllMedicines();
  const parentCategories = getParentCategories();
  const forms = getCategories();

  const initialParent =
    searchParams?.category && parentCategories.includes(searchParams.category)
      ? searchParams.category
      : "All";

  const initialSubcategory =
    searchParams?.form && forms.includes(searchParams.form)
      ? searchParams.form
      : "All";

  return (
    <div className="catalog-page mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
      <header data-scroll className="catalog-hero max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-sage">Catalog</p>
        <h1 className="mt-1.5 font-display text-4xl leading-[1.1] text-ink md:text-5xl text-balance">
          All medicines
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft/80 md:text-base">
          Browse by category (ED, Pain Killers, Antibiotics, and more), then
          refine by dosage form — tablets, capsules, injections, and others.
        </p>
      </header>

      <div data-scroll-skip className="mt-3 md:mt-3.5">
        <CatalogBrowser
          medicines={medicines}
          parentCategories={parentCategories}
          initialParent={initialParent}
          initialSubcategory={initialSubcategory}
        />
      </div>
    </div>
  );
}
