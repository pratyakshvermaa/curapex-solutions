import HeroSection from "@/components/HeroSection";
import HomeSections from "@/components/HomeSections";
import {
  getAllMedicines,
  getParentCategoryCounts,
  getFeaturedMedicines,
} from "@/lib/medicines";
import { getAllInsights } from "@/lib/insights";
import { getReviewStats } from "@/lib/reviews-store";

// Review stats come from storage; refresh hourly in case a revalidation is missed.
export const revalidate = 3600;

export default async function HomePage() {
  const featured = getFeaturedMedicines(9);
  const categories = getParentCategoryCounts();
  const total = getAllMedicines().length;
  const { average, count } = await getReviewStats();
  const insightCount = getAllInsights().length;

  return (
    <>
      <HeroSection
        totalMedicines={total}
        reviewAverage={average}
        reviewCount={count}
      />
      <HomeSections
        categories={categories}
        featured={featured}
        total={total}
        insightCount={insightCount}
      />
    </>
  );
}
