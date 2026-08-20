import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  addReview,
  getAllReviews,
  getReviewStats,
} from "@/lib/reviews-store";
import { titleForRating } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Basic HTML sanitization for user-submitted text */
function sanitizeText(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .slice(0, 1200); // Hard limit
}

export async function GET() {
  const reviews = getAllReviews();
  const stats = getReviewStats();
  return NextResponse.json({ reviews, stats });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rating = Number(body.rating);
    const text = sanitizeText(String(body.body || "").trim());
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
    if (text.length > 1200) {
      return NextResponse.json(
        { error: "Review is too long (max 1200 characters)." },
        { status: 400 }
      );
    }

    const review = addReview({
      name,
      location,
      rating: Math.round(rating),
      title: titleForRating(Math.round(rating)),
      body: text,
      medicineName: medicineName || null,
      medicineSlug: medicineSlug || null,
      verified: false,
    });

    revalidatePath("/reviews");
    revalidatePath("/");

    return NextResponse.json({ ok: true, review, stats: getReviewStats() });
  } catch (err) {
    console.error("POST /api/reviews", err);
    return NextResponse.json(
      {
        error:
          "Could not save the review. On some hosts the data folder is read-only — try again locally or use persistent storage.",
      },
      { status: 500 }
    );
  }
}
