import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  addReview,
  getAllReviews,
  REVIEWS_TAG,
} from "@/lib/reviews-store";
import { computeReviewStats, titleForRating } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Strip control characters and cap length. No HTML-entity encoding here:
 * React escapes text on render, so encoding would show "&#x27;" to readers.
 */
function sanitizeText(text: string, max = 200): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").slice(0, max);
}

export async function GET() {
  const reviews = await getAllReviews();
  const stats = computeReviewStats(reviews);
  return NextResponse.json({ reviews, stats });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rating = Number(body.rating);
    const rawText = String(body.body || "").trim();
    const text = sanitizeText(rawText, 1200);
    const name = sanitizeText(String(body.name || "").trim());
    const location = sanitizeText(String(body.location || "").trim());
    const medicineName = sanitizeText(String(body.medicineName || "").trim());
    const medicineSlug = sanitizeText(String(body.medicineSlug || "").trim());

    if (!name) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }
    if (!medicineName && !medicineSlug) {
      return NextResponse.json(
        { error: "Please select a medicine." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }
    if (text.length < 10) {
      return NextResponse.json(
        { error: "Please write a review of at least 10 characters." },
        { status: 400 }
      );
    }
    if (rawText.length > 1200) {
      return NextResponse.json(
        { error: "Review is too long (max 1200 characters)." },
        { status: 400 }
      );
    }

    const { review, reviews } = await addReview({
      name,
      location,
      rating: Math.round(rating),
      title: titleForRating(Math.round(rating)),
      body: text,
      medicineName: medicineName || null,
      medicineSlug: medicineSlug || null,
      verified: false,
    });

    revalidateTag(REVIEWS_TAG);
    revalidatePath("/reviews");
    revalidatePath("/");
    revalidatePath("/about");

    return NextResponse.json({
      ok: true,
      review,
      stats: computeReviewStats(reviews),
    });
  } catch (err) {
    console.error("POST /api/reviews", err);
    return NextResponse.json(
      {
        error: "Could not save your review right now. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
