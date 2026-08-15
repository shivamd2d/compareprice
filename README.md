# DealMatrix (ComparePrice)

A lean Next.js App Router implementation of an AI-first price intelligence experience for India.

## Stack

- Next.js 16 + TypeScript + Tailwind CSS
- In-memory demo catalog seeded in `lib/catalog.ts`
- Core effective-price and deal-verdict logic in `lib/pricing.ts`
- AI assistant mock grounding in `lib/ai.ts`

## Implemented foundation

- Homepage with intent-led search prompt and featured deals
- Search, category, product detail, compare, dynamic comparison page
- Merchant matrix with effective-price calculation
- Price history chart + buy-now verdict module
- AI assistant page with grounded-response labeling
- Route coverage for required launch paths:
  - `/`, `/search`, `/category/[slug]`, `/brand/[slug]`, `/product/[slug]`
  - `/compare`, `/compare/[slug1]-vs-[slug2]`, `/deals`, `/rankings`
  - `/guides`, `/guides/[slug]`, `/stores`, `/store/[slug]`
  - `/favorites`, `/alerts`, `/assistant`, `/go/[offerId]`
  - `/login`, `/register`, `/account`, `/admin`

## Run

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```
