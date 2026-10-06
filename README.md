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
| `BLOB_READ_WRITE_TOKEN` | Set automatically on Vercel when the Blob store is connected. Reviews are saved to a private Vercel Blob in production; without it (local dev) they're saved to `data/reviews.json`, which also seeds the Blob on first use. |

## Scripts

- `npm run dev` / `npm run dev:clean` — local development (prefer `dev:clean` if the UI looks stale)
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint

## Live site

- **Production:** https://curapex-solutions.vercel.app  
- **GitHub:** https://github.com/pratyakshvermaa/curapex-solutions  
- **Vercel project:** `badboy2/curapex-solutions`

No database is required for the catalog. Enquiries open WhatsApp / Telegram using env vars. Submitted reviews are stored in Vercel Blob.

## Making changes live (checklist)

### Code / design / content changes

1. Edit locally and test: `npm run dev` → http://localhost:3000  
2. Save and publish:
   ```bash
   git add -A
   git commit -m "Short description of the change"
   git push
   ```
3. Wait 1–2 minutes for Vercel to rebuild (GitHub push usually triggers auto-deploy).  
4. Hard-refresh the live site and confirm the change.

### WhatsApp / Telegram / other env vars

These are **not** in git — update them on Vercel:

1. Vercel → Project → **Settings → Environment Variables**  
2. Edit `NEXT_PUBLIC_WHATSAPP_NUMBER` or `NEXT_PUBLIC_TELEGRAM_USERNAME`  
3. **Redeploy** (Deployments → ⋮ on latest → Redeploy) so `NEXT_PUBLIC_*` values rebuild into the site  

Or ask the agent: “change WhatsApp to X and redeploy.”

### If auto-deploy didn’t run after push

```bash
npx vercel --prod --yes --scope badboy2
```

### First-time setup (already done)

1. Push the repo to GitHub.  
2. Import the project in Vercel.  
3. Add env vars → Deploy.  

## SEO & Insights

The `/insights` section publishes B2B wholesale guides linked to catalog categories. After deploy:

1. **Google Search Console** — add property `https://curapex-solutions.vercel.app`, submit sitemap `/sitemap.xml`.
2. **Validate rich results** — test any `/insights/[slug]` URL in [Google Rich Results Test](https://search.google.com/test/rich-results) (Article, BreadcrumbList, FAQPage).
3. **Baseline metrics** — after 2 weeks, review impressions/clicks for queries containing `wholesale`, `export`, `pharma`, and category names (Antibiotics, ED Medicines, etc.).
4. **Content updates** — edit `src/lib/insights-content.ts`; set `updatedAt` when revising an article.

Cross-links: catalog category filters, product pages, and home category cards link to matching guides where available. Aliases: Antihypertensive → Cardiac; Antiemetics → General Medicines; Human Growth Hormones → Steroids.
