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

## Imagery

Three sources, three scripts. All of them are re-runnable and none of the
output is hand-edited.

| Script | Reads | Writes |
| --- | --- | --- |
| `extract_menu_art.py` | `assets/menu.pdf` | `public/menu/` product shots and category stickers |
| `cut_products.py` | `assets/menu.pdf` | `public/menu/cut-*.webp`, matted products |
| `process_generated.py` | `assets/generated/`, `assets/store-front.webp` | `public/scene/` backgrounds, cutouts, fruit pieces |
| `extract_scene_art.py` | `assets/menu.pdf` | `public/art/wood-plank.webp`, plaque grain |

```bash
python3 scripts/extract_menu_art.py     # needs poppler: brew install poppler
python3 scripts/cut_products.py
python3 scripts/process_generated.py    # needs pillow, numpy, scipy
```

**Product shots** come off the printed menu, which is six flattened 300 DPI
scans. Crops are framed to stay clear of the name plaques and price tags baked
into the page. Six products are matted properly; the rest use a circular crop,
because the cups are clear plastic and a flood fill run from the page border
goes through the cup wall and takes the cup with it.

**Scene art** is generated tropical photography, delivered on a flat `#00B140`
green. `process_generated.py` keys it on hue and saturation rather than on
greenness, because keying on greenness also deletes the palm fronds and the
limes. Despill runs only in a narrow band inside the matte for the same reason.
Fruit trays are split into individual pieces so a scatter can be composed one
piece at a time.

Generated imagery is scenery and framing only: sky, water, sand, leaves,
flowers, loose fruit. None of it is ever presented as a photo of something the
shop sells. Menu items use the real photography from the printed menu.

## The cinematic pass

The page is treated as a shot rather than a layout, and depth is the organising
idea:

- **Parallax carries real relative depth.** The sky lags 130px behind the
  scroll, the water 46, the product runs 58 ahead, and the foliage nearest the
  lens runs 210 ahead. The spread is what reads as depth; matching speeds read
  as sliding planes.
- **There is a focal plane.** The product stays sharp. Everything in front of it
  is blurred, one stop for the palms and two for the flowers at the very front.
- **A slow push-in opens the hero**, then scroll takes over as the camera move.
- **Atmosphere sits over the whole page**: a tiling grain plate, a light
  vignette, and a golden-hour grade on every photograph so they read as one
  shoot rather than as a library.
- **Easing has no overshoot anywhere.** A bounce reads as a page pleased with
  itself; a long settle reads as something with mass.

Everything above is dropped under `prefers-reduced-motion`, including the
opener, the grain and the vignette.

## Design concepts

Four directions are live side by side at `/preview/<concept>`, each a complete
clickable site:

| | Concept | Opens on | Argument |
| --- | --- | --- | --- |
| A | `/preview/storefront` | A full-bleed photo of the shop | This is a real place, come here |
| B | `/preview/beach` | A tropical scene, product on the shoreline | This is what the brand feels like |
| C | `/preview/menu-first` | A compact banner, then the menu | Here is the food and what it costs |
| D | `/preview/macro` | One product filling the frame | Look how good this looks |

They are built as one site, not four. `src/lib/concepts.ts` gives each concept a
hero, a section order and a set of token overrides; `ConceptTheme` scopes those
to the subtree; `ConceptHome` composes the page. Interior pages render the real
page components under the concept theme, so the only variable in the comparison
is the design.

A switcher pinned to the bottom of every preview carries the current path
across, so the menu page in concept A is one click from the menu page in
concept D.

Previews sit under their own root layout in `src/app/(preview)/`, are excluded
from the proxy, carry `noindex, nofollow`, and never appear in the sitemap.
Deleting `src/app/(preview)/` and `src/lib/concepts.ts` removes them entirely
once a direction is chosen.

Known limit: interior pages stay light in all four concepts. The macro
direction's dark ground applies to its home page only, because inverting the
menu cards for one concept that may be discarded is not worth the churn.

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
