# Mango Tropical

Marketing site for Mango Tropical, a nieveria and antojitos shop at FM 529 and
Fry Road in Cypress, Texas.

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4. Fully
static: all 20 pages prerender at build time.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
```

## How the two languages work

English lives at the root and Spanish under `/es`, and each language uses its
own URL words so both trees compete for their own searches.

| Page | English | Spanish |
| --- | --- | --- |
| Home | `/` | `/es` |
| Menu | `/menu` | `/es/menu` |
| Category | `/menu/mangonadas` | `/es/menu/mangonadas` |
| Our story | `/our-story` | `/es/nosotros` |
| Visit | `/visit` | `/es/visita` |

Next resolves a single internal route tree under `src/app/[locale]`.
`src/proxy.ts` rewrites the public slug to the internal one without changing the
address bar, and rejects a slug used against the wrong language (`/es/our-story`
returns 404). Route definitions live in `src/lib/i18n.ts`; adding a page means
adding one entry to `routes` and one folder under `src/app/[locale]`.

## Where the content lives

Everything writable is data, not markup.

| File | Holds |
| --- | --- |
| `src/lib/site.ts` | Name, address, phone, hours, socials, geo, production URL |
| `src/lib/menu.ts` | Every category, item, price and flavor, in both languages |
| `src/lib/copy.ts` | Every interface string, in both languages |
| `src/lib/reviews.ts` | The Google reviews wall |

Prices in `menu.ts` are transcribed from the printed in-store menu. Hours in
`site.ts` drive the open/closed badge, the footer, the visit page and the
`openingHoursSpecification` in the LocalBusiness schema, so changing them in one
place updates all of it.

## Product photography

The client had no photo library, so all 34 images were extracted from the
printed menu PDF, which is six flattened 300 DPI scans. `scripts/extract_menu_art.py`
holds the crop box for every product and regenerates `public/menu` and
`public/art` from `assets/menu.pdf`:

```bash
python3 scripts/extract_menu_art.py    # needs poppler: brew install poppler
```

Crops are framed to stay clear of the printed name plaques and price tags baked
into the page. If a crop needs adjusting, change its box in that file and re-run.

## Checking your work

`scripts/shoot.mjs` screenshots any set of routes at mobile, tablet and desktop,
and fails if a page overflows horizontally or logs a console error. It scrolls
each page first so the scroll reveals fire.

```bash
npm run dev
node scripts/shoot.mjs / /menu /our-story /es
```

Screenshots land in `.shots/`. It drives the Chrome already installed on the
machine through `puppeteer-core`, so there is no browser download.

## SEO

- Five category landing pages, each targeting its own local search, in both languages
- `LocalBusiness` / `IceCreamShop`, `Menu`, `FAQPage` and `BreadcrumbList` structured data
- `hreflang` pairs on every page, plus a sitemap that declares both language versions
- Social cards generated per language at `/opengraph-image`
- Scroll reveals degrade to visible content when JavaScript does not run

### Reviews and structured data

`src/lib/reviews.ts` ships with placeholder entries. They are deliberately
excluded from `Review` structured data: marking up invented reviews violates
Google's policy and can get a business's rich results suppressed. Replace the
placeholders with real review text and first names, set `placeholder` to false,
and fill in `aggregate` from the live Google listing. The schema switches on by
itself once real reviews are present.

## Before launch

1. Register the domain and set `NEXT_PUBLIC_SITE_URL` (see `.env.example`).
   Leave it unset rather than blank: a blank value is treated as unset and the
   fallback origin is used, but a wrong value would be published everywhere.
2. Replace the placeholder reviews in `src/lib/reviews.ts`.
3. Confirm the coordinates in `site.ts` against the Google Business Profile. They
   are currently derived from the FM 529 and Fry Road intersection.
4. Ask the owner for photos of the shop and of the products on a plain
   background. Everything on the site today is cropped out of the printed menu,
   which is why product shots carry the menu's orange page behind them.
