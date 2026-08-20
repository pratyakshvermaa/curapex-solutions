/** Parse catalog price strings like "₹ 1,725 / Bottle" or "₹ 739 / Box". */
export function parseUnitPrice(price?: string | null): {
  amountInr: number;
  unit: string;
  formatted: string;
} | null {
  if (!price) return null;
  const cleaned = price.replace(/,/g, "");
  const amountMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!amountMatch) return null;
  const amountInr = Number(amountMatch[1]);
  if (!Number.isFinite(amountInr) || amountInr <= 0) return null;
  const unitMatch = price.match(/\/\s*(.+)$/);
  const unit = (unitMatch?.[1] || "unit").trim();
  return { amountInr, unit, formatted: price.trim() };
}

/** INR → USD. Override with NEXT_PUBLIC_INR_PER_USD (rupees per 1 USD). */
export function inrPerUsd(): number {
  const raw = process.env.NEXT_PUBLIC_INR_PER_USD;
  const n = raw ? Number(raw) : 83.5;
  const rate = Number.isFinite(n) && n > 0 ? n : 83.5;
  // Warn if using fallback rate (may be stale)
  if (!raw || !Number.isFinite(n) || n <= 0) {
    console.warn(
      "price.ts: Using fallback INR/USD rate of 83.5. Set NEXT_PUBLIC_INR_PER_USD for accuracy."
    );
  }
  return rate;
}

export function inrToUsd(amountInr: number): number {
  return amountInr / inrPerUsd();
}

export function formatUsd(amountUsd: number): string {
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: amountUsd >= 100 ? 0 : 2,
    maximumFractionDigits: amountUsd >= 100 ? 0 : 2,
  }).format(amountUsd);
  return `USD ${amount}`;
}
