import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MedicineDetail from "@/components/MedicineDetail";
import { getAllMedicines, getMedicineBySlug, snippet } from "@/lib/medicines";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllMedicines().map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const medicine = getMedicineBySlug(params.slug);
  if (!medicine) return { title: "Medicine not found" };
  return {
    title: medicine.name,
    description:
      snippet(medicine.description, 155) ||
      `${medicine.name} — enquire with Curapex Solutions for wholesale supply.`,
  };
}

export default function MedicineDetailPage({ params }: PageProps) {
  const medicine = getMedicineBySlug(params.slug);
  if (!medicine) notFound();

  return <MedicineDetail medicine={medicine} />;
}
