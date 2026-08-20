import fs from "fs";
import path from "path";
import {
  computeReviewStats,
  titleForRating,
  type Review,
} from "./reviews";

const FILE = path.join(process.cwd(), "data", "reviews.json");

export function readReviews(): Review[] {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Review[];
  } catch {
    // File missing, unreadable, or corrupt JSON — return empty list
    return [];
  }
}

export function writeReviews(reviews: Review[]) {
  try {
    const dir = path.dirname(FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FILE, JSON.stringify(reviews, null, 2) + "\n", "utf8");
  } catch (err) {
    // Read-only filesystem (e.g. Vercel) — surface failure to the API caller
    console.warn("reviews-store: could not write reviews.json", err);
    throw err;
  }
}

export function getAllReviews(): Review[] {
  return readReviews().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getReviewStats() {
  return computeReviewStats(readReviews());
}

export function addReview(
  input: Omit<Review, "id" | "title" | "date" | "verified"> & {
    title?: string;
    verified?: boolean;
  }
): Review {
  const reviews = readReviews();
  const review: Review = {
    id: `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim(),
    rating: input.rating,
    title: input.title || titleForRating(input.rating),
    body: input.body.trim(),
    date: new Date().toISOString().slice(0, 10),
    location: input.location.trim(),
    verified: input.verified ?? false,
    medicineName: input.medicineName || null,
    medicineSlug: input.medicineSlug || null,
  };
  reviews.unshift(review);
  writeReviews(reviews);
  return review;
}
