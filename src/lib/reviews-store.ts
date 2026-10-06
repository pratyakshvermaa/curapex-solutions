import fs from "fs";
import path from "path";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import {
  computeReviewStats,
  titleForRating,
  type Review,
} from "./reviews";
import seedReviews from "../../data/reviews.json";

/** Cache tag — call revalidateTag(REVIEWS_TAG) after a write. */
export const REVIEWS_TAG = "reviews";

const FILE = path.join(process.cwd(), "data", "reviews.json");
const BLOB_PATH = "reviews/reviews.json";

/**
 * Vercel's filesystem is read-only, so production stores reviews in a private
 * Vercel Blob. Locally (no Blob credentials) we keep using data/reviews.json.
 * The first Blob read is seeded from data/reviews.json.
 */
function blobEnabled() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

function asReviews(parsed: unknown): Review[] {
  return Array.isArray(parsed) ? (parsed as Review[]) : [];
}

async function readBlob(): Promise<{ reviews: Review[]; etag: string | null }> {
  const res = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) {
    return { reviews: asReviews(seedReviews), etag: null };
  }
  const text = await new Response(res.stream).text();
  // get() reports a weak ETag (W/"…") but put({ ifMatch }) needs the strong form.
  const etag = res.blob.etag.replace(/^W\//, "");
  return { reviews: asReviews(JSON.parse(text)), etag };
}

function readFile(): Review[] {
  try {
    return asReviews(JSON.parse(fs.readFileSync(FILE, "utf8")));
  } catch {
    // File missing, unreadable, or corrupt JSON — return empty list
    return [];
  }
}

const readBlobCached = unstable_cache(
  async () => (await readBlob()).reviews,
  ["reviews"],
  { tags: [REVIEWS_TAG], revalidate: 3600 }
);

export async function readReviews(): Promise<Review[]> {
  // The local file can change under us in dev, so only cache the Blob path.
  if (!blobEnabled()) return readFile();
  try {
    return await readBlobCached();
  } catch (err) {
    // Outside the cache so a transient failure isn't remembered.
    console.error("reviews-store: blob read failed, using seed data", err);
    return asReviews(seedReviews);
  }
}

export async function getAllReviews(): Promise<Review[]> {
  return (await readReviews()).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getReviewStats() {
  return computeReviewStats(await readReviews());
}

export async function addReview(
  input: Omit<Review, "id" | "title" | "date" | "verified"> & {
    title?: string;
    verified?: boolean;
  }
): Promise<{ review: Review; reviews: Review[] }> {
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

  if (!blobEnabled()) {
    const reviews = [review, ...readFile()];
    fs.writeFileSync(FILE, JSON.stringify(reviews, null, 2) + "\n", "utf8");
    return { review, reviews };
  }

  // Read-modify-write guarded by the ETag so concurrent submissions don't
  // overwrite each other; retry a few times on conflict.
  for (let attempt = 0; attempt < 4; attempt++) {
    const { reviews: current, etag } = await readBlob();
    const reviews = [review, ...current];
    try {
      await put(BLOB_PATH, JSON.stringify(reviews), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: etag !== null,
        ...(etag ? { ifMatch: etag } : {}),
      });
      return { review, reviews };
    } catch (err) {
      if (err instanceof BlobPreconditionFailedError && attempt < 3) continue;
      throw err;
    }
  }
  throw new Error("reviews-store: could not save review after retries");
}
