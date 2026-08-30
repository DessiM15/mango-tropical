# Mango Tropical — Asset Library

Extracted from the client's printed menu PDF. Source pages are flattened 300 DPI scans, so every product had to be cut out of the page render rather than pulled out as a separate object.

## Folders

| Folder | What's in it | Use for |
|---|---|---|
| `pages/` | The six menu pages, full 300 DPI, 2550 × 3300 | Reference. Also usable as a downloadable PDF-style menu view on the site. |
| `cutouts/` | 30 transparent products, PNG and WebP | Poster-scale product placement on solid color fields. This is the main folder. |
| `products/` | The same 30 products as rectangular JPEGs with the menu background still attached | Fallback if a cutout edge looks wrong at large size, or for tinted texture bands. |
| `brand/` | Logo lockup and the isolated surfing mango character | The character is the site's signature element. |

Every cutout ships as both `.png` and `.webp`. Use the WebP through `next/image`.

## Sizes

Cutouts range from roughly 240px to 1720px on the long edge. Most of the cup products land between 800 and 1200px tall, which supports rendering at full poster scale without visible softening. The widest assets are `banana-split` (1544px), `brand-logo-lockup` (1720px), `conchi-nieve` (1106px), `chili-cheese-fries` (1144px) and `salchipapas` (1082px).

Two are small and should only be used at supporting scale, never as a section hero: `raspa-red` (240 × 285) and `raspa-blue` (272 × 596). Use `raspas-trio` instead when you need the snowballs at size.

## Known limitation: baked-in price labels

The printed menu overlays each product with its name and price. Where that label sits on top of the food itself it could not be separated, so it is still visible in the cutout.

**Clean, no label. Use these for hero and feature placement:**

```
brand-logo-lockup      brand-mango-character   chili-cheese-fries
coctel-de-frutas       conchi-nieve            elote-chorreado
loaded-nachos          nieve-fresa             nieve-limon
nieve-mango            nieve-mango-chamoy      nieve-tamarindo
raspa-blue             raspa-red               raspas-trio
salchipapas
```

**Label still visible. Fine at small or mid scale, or crop the label off:**

```
banana-royale      banana-split       canasta-waffle     chocolate-delight
elote-en-vaso      float-coke         float-fanta        float-squirt
fresas-con-crema   gansito-nieve      mangonada-tropical pepinada-tropical
raspa-tropical     sandia-tropical    strawberry-delight waffle-cone
```

Note that `mangonada-tropical` is on the second list. It is the signature product and the obvious hero candidate, so either crop below the label, or lead with `conchi-nieve`, `elote-chorreado` or `nieve-mango-chamoy` instead, all of which are clean and photograph well at size.

## One asset was dropped

`raspa-yellow` was not recoverable. The pale yellow shaved ice sits against a white foam cup and a light background, and no segmentation cleanly separated them. Use `raspas-trio` for the snowball lineup.

## Handling notes

- These are cutouts on transparent backgrounds. The whole point of the revision brief is that they render **large**, 800px to 1400px, bleeding off the section edge. At small scale in a card grid they will look exactly like the current site.
- Give each one a single soft contact shadow grounded to the color field beneath it. No outer glow, no stroke.
- One cutout per viewport.
- Edges came from automated segmentation, so inspect any asset before using it above about 1000px on screen. Minor roughness is invisible at normal scale but can show on a full-bleed hero.

## If the client signs

Replace all of this with a real photo shoot. These assets are good enough to win the pitch and good enough to launch, but the products photographed fresh on a seamless background, plus interior and staff shots, is what takes the site from strong to genuinely premium. Worth quoting as a line item.
