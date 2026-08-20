/** Company facts for schema, insights CTAs, and trust UI. */
export const COMPANY = {
  legalName: "Curapex Solutions",
  siteUrl: "https://curapex-solutions.vercel.app",
  established: 2021,
  responseSla: "2–4 business hours",
  moqNote: "Wholesale & export partners · MOQ discussed per product",
} as const;

/** Routing targets for enquiry handoff — not shown on the public site. */
export function getContact() {
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /\D/g,
    ""
  );
  const telegram = (process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "").replace(
    /^@/,
    ""
  );
  return {
    whatsapp,
    telegram,
    whatsappUrl: whatsapp ? `https://wa.me/${whatsapp}` : "",
    telegramUrl: telegram ? `https://t.me/${telegram}` : "",
  };
}
