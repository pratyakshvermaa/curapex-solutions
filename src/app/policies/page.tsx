import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/trust";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Privacy, enquiry terms, and medical disclaimer for Curapex Solutions wholesale & export.",
};

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <header data-scroll>
        <p className="text-xs uppercase tracking-[0.2em] text-sage">Policies</p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
          How we work with partners
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft/80 md:text-base">
          Business enquiries only. Not medical advice.
        </p>
      </header>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft/85">
        <section data-scroll>
          <h2 className="font-display text-xl text-ink">Business enquiries only</h2>
          <p className="mt-2">
            Curapex Solutions supplies pharmaceutical products for wholesale, distribution,
            and export partners — not consumer retail without a qualifying business
            enquiry.
          </p>
        </section>
        <section data-scroll>
          <h2 className="font-display text-xl text-ink">No medical advice</h2>
          <p className="mt-2">
            Catalog and insight content is for trade reference only. Nothing on this
            site is medical advice or a prescription.
          </p>
        </section>
        <section data-scroll>
          <h2 className="font-display text-xl text-ink">Pricing &amp; shipping</h2>
          <p className="mt-2">
            {COMPANY.moqNote}. Catalog prices are indicative. Shipping is extra
            unless agreed in writing. We aim to reply within {COMPANY.responseSla}.
          </p>
        </section>
        <section data-scroll>
          <h2 className="font-display text-xl text-ink">Privacy</h2>
          <p className="mt-2">
            Enquiry and review data is used only to respond and improve service. Do
            not include sensitive patient data in messages. We do not publish
            personal phone numbers, messaging handles, or registration numbers on
            this website.
          </p>
        </section>
      </div>

      <p data-scroll className="mt-10 text-sm">
        <Link href="/about" className="font-medium text-teal hover:underline">
          About Curapex Solutions
        </Link>
        {" · "}
        <Link href="/insights" className="font-medium text-teal hover:underline">
          Insights
        </Link>
      </p>
    </div>
  );
}
