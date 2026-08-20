export type Review = {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  location: string;
  verified: boolean;
  medicineName?: string | null;
  medicineSlug?: string | null;
};

export function titleForRating(rating: number): string {
  if (rating >= 5) return "Excellent";
  if (rating === 4) return "Very good";
  if (rating === 3) return "Average";
  if (rating === 2) return "Below expectations";
  return "Poor";
}

export function computeReviewStats(reviews: Review[]) {
  const count = reviews.length;
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  const average = count ? Math.round((sum / count) * 10) / 10 : 0;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const key = Math.min(5, Math.max(1, Math.round(r.rating)));
    distribution[key] = (distribution[key] || 0) + 1;
  }
  return { count, average, distribution };
}
