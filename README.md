# Curapex Solutions

Pharmaceutical product catalog for Curapex Solutions — browse medicines and submit wholesale enquiries via the catalog.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Static JSON data (`/data/medicines.json`)

## Setup

```bash
npm install
cp .env.example .env.local
# Set enquiry routing env vars (server-side handoff only — not shown on the public site)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format, no `+` or spaces (used only when an enquiry is submitted) |
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | Telegram username without `@` (used only when an enquiry is submitted) |

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_TELEGRAM_USERNAME` in Project Settings → Environment Variables.
4. Deploy.

No database or server-only APIs are required — the site is static-friendly on Vercel's free tier.

## SEO & Insights

The `/insights` section publishes B2B wholesale guides linked to catalog categories. After deploy:

1. **Google Search Console** — add property `https://curapex-solutions.vercel.app`, submit sitemap `/sitemap.xml`.
2. **Validate rich results** — test any `/insights/[slug]` URL in [Google Rich Results Test](https://search.google.com/test/rich-results) (Article, BreadcrumbList, FAQPage).
3. **Baseline metrics** — after 2 weeks, review impressions/clicks for queries containing `wholesale`, `export`, `pharma`, and category names (Antibiotics, ED Medicines, etc.).
4. **Content updates** — edit `src/lib/insights-content.ts`; set `updatedAt` when revising an article.

Cross-links: catalog category filters, product pages, and home category cards link to matching guides where available. Aliases: Antihypertensive → Cardiac; Antiemetics → General Medicines; Human Growth Hormones → Steroids.
