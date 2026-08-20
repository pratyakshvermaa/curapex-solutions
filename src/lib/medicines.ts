import medicinesData from "../../data/medicines.json";
import type { Medicine } from "@/types/medicine";
import { z } from "zod";

// Runtime validation schema for Medicine data
const MedicineSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  parentCategory: z.string().optional(),
  composition: z.string().nullable().optional(),
  dosageForm: z.string().nullable().optional(),
  packaging: z.string().nullable().optional(),
  moq: z.string().nullable().optional(),
  price: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  certifications: z.array(z.string()).optional(),
  brand: z.string().nullable().optional(),
  strength: z.string().nullable().optional(),
  indiaMartId: z.string().optional(),
  indiaMartCategory: z.string().nullable().optional(),
  source: z.string().optional(),
  specs: z.record(z.string(), z.string()).optional(),
});

const MedicinesArraySchema = z.array(MedicineSchema);

// Validate at module load time with helpful error
let validatedMedicines: Medicine[];
try {
  validatedMedicines = MedicinesArraySchema.parse(medicinesData) as Medicine[];
} catch (err) {
  console.error("medicines.json validation failed:", err);
  // Fallback to empty array rather than crashing the build
  validatedMedicines = [];
}

const medicines = validatedMedicines;

export function getAllMedicines(): Medicine[] {
  return medicines;
}

export function getMedicineBySlug(slug: string): Medicine | undefined {
  return medicines.find((m) => m.slug === slug);
}

/** Dosage-form subcategories */
export function getCategories(): string[] {
  return Array.from(new Set(medicines.map((m) => m.category))).sort();
}

export function getParentCategories(): string[] {
  return Array.from(
    new Set(medicines.map((m) => m.parentCategory || "General Medicines"))
  ).sort((a, b) => a.localeCompare(b));
}

export function getCategoryCounts(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const m of medicines) {
    counts.set(m.category, (counts.get(m.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export type ParentCategoryInfo = {
  name: string;
  count: number;
  subcategories: { name: string; count: number }[];
};

export function getParentCategoryCounts(): ParentCategoryInfo[] {
  const map = new Map<string, Map<string, number>>();

  for (const m of medicines) {
    const parent = m.parentCategory || "General Medicines";
    const sub = m.category || "Tablets";
    if (!map.has(parent)) map.set(parent, new Map());
    const subs = map.get(parent)!;
    subs.set(sub, (subs.get(sub) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([name, subs]) => ({
      name,
      count: Array.from(subs.values()).reduce((a, b) => a + b, 0),
      subcategories: Array.from(subs.entries())
        .map(([subName, count]) => ({ name: subName, count }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getSubcategoriesForParent(parent: string): string[] {
  if (parent === "All") return getCategories();
  return Array.from(
    new Set(
      medicines
        .filter((m) => (m.parentCategory || "General Medicines") === parent)
        .map((m) => m.category)
    )
  ).sort();
}

export function getFeaturedMedicines(limit = 6): Medicine[] {
  const preferred = [
    "azithromycin-500-mg-tablets-093662",
    "baclosign-baclofen-10-mg-tablet-251297",
    "hucog-5000-hp-injection-133648",
    "test-e-injection-140888",
    "asthalin-100-mcg-inhaler-207512",
    "metfor-500-mg-tablets-417397",
    "amlip-5-mg-tablet-253755",
    "acarbose-glucobay-100-mg-tablets-248812",
  ];

  const bySlug = new Map(medicines.map((m) => [m.slug, m]));
  const featured: Medicine[] = [];

  for (const slug of preferred) {
    const item = bySlug.get(slug);
    if (item) featured.push(item);
    if (featured.length >= limit) return featured;
  }

  for (const m of medicines) {
    if (featured.some((f) => f.slug === m.slug)) continue;
    if (m.images?.length && m.description) featured.push(m);
    if (featured.length >= limit) break;
  }

  return featured;
}

export function snippet(text?: string | null, max = 110): string {
  if (!text) return "";
  const clean = text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

export function presentFields(
  medicine: Medicine
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const push = (label: string, value?: string | null) => {
    if (value && String(value).trim()) {
      rows.push({ label, value: String(value).trim() });
    }
  };

  push("Category", medicine.parentCategory);
  push("Dosage form", medicine.category || medicine.dosageForm);
  push("Composition", medicine.composition);
  push("Strength", medicine.strength);
  push("Brand", medicine.brand);
  push("Packaging", medicine.packaging);
  push("MOQ", medicine.moq);
  push("Price", medicine.price);

  if (medicine.specs) {
    for (const [label, value] of Object.entries(medicine.specs)) {
      if (!value?.trim()) continue;
      if (rows.some((r) => r.label.toLowerCase() === label.toLowerCase())) {
        continue;
      }
      push(label, value);
    }
  }

  if (medicine.certifications?.length) {
    push("Certifications", medicine.certifications.join(", "));
  }

  return rows;
}
