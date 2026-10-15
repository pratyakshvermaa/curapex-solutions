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
  const description =
    snippet(medicine.description, 155) ||
    `${medicine.name} — enquire with Curapex Solutions for wholesale supply.`;
  // Product links are shared with buyers on WhatsApp, so the preview names
  // the product and its composition rather than repeating the description.
  const previewDescription = [
    medicine.composition && `Composition: ${snippet(medicine.composition, 80)}.`,
    "Wholesale & export supply from Curapex Solutions — tap to enquire on WhatsApp.",
  ]
    .filter(Boolean)
    .join(" ");
  return {
    title: medicine.name,
    description,
    openGraph: {
      type: "website",
      siteName: "Curapex Solutions",
      locale: "en_IN",
      url: `/catalog/${medicine.slug}`,
      title: medicine.name,
      description: previewDescription,
      // Image: ./opengraph-image.tsx (product photo card).
    },
  };
}

export default function MedicineDetailPage({ params }: PageProps) {
  const medicine = getMedicineBySlug(params.slug);
  if (!medicine) notFound();

  return <MedicineDetail medicine={medicine} />;
}
