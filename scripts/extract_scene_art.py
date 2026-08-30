"""
Second asset pass: the decorative kit the layered layout is built from.

The first pass (extract_menu_art.py) pulled product photography. This one pulls
the scene: flower and leaf clusters as transparent cutouts, plus the watercolor
water, sand and wave plates that the sections sit on.

Wood plaques and paint splashes are not extracted. Their artwork has text baked
into it, so they are rebuilt as SVG components instead, which also lets them fit
any heading at any width.

Usage:  python3 scripts/extract_scene_art.py
Output: public/flora/*.png  and  public/art/*.webp
"""
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "assets" / "menu.pdf"
WORK = ROOT / ".menu-render"
OUT_FLORA = ROOT / "public" / "flora"
OUT_ART = ROOT / "public" / "art"

# Transparent cutouts. Every page frames its artwork with the same flowers and
# leaves, so these are picked from wherever they sit on the cleanest ground.
# page, box, flood tolerance, and whether the background is watercolour water. The hibiscus sit on
# watercolour water whose lighter spray survives a tolerance tuned for flat
# orange, so those two are cut with a wider one.
FLORA = {
    "plumeria-cluster":  (1, 1900,    0, 2550,  420, 34, False),
    "plumeria-spray":    (1,    0, 2880,  520, 3300, 34, False),
    "banana-leaves":     (2,    0,    0,  420,  330, 34, False),
    "hibiscus-pair":     (2, 2320, 2930, 2553, 3300, 40, True),
    "leaves-wide":       (5, 1950,    0, 2550,  300, 34, False),
    "hibiscus-yellow":   (1, 2190, 2760, 2550, 3110, 40, True),
}

# Watercolour plates. These sit behind whole sections, so small imperfections
# are covered by content.
PLATES = {
    "water-deep":      (3,  150, 2470,  900, 3000),
    "water-turquoise": (1,  500, 2620, 1900, 2900),
    "wave-crest":      (3,  150, 2280,  850, 2440),
    "sand-shore":      (6, 1450, 1785, 1985, 1898),
    # A clean patch of the TOPPINGS plaque, to the right of its lettering and
    # inside its frame. Used as a low-opacity grain overlay on the CSS-drawn
    # plank, which is what actually scales to any heading width.
    "wood-plank":      (6, 2310, 1185, 2352, 1340),
    # The menu cover's central artwork: the logo on the sunset and palm scene.
    # Stands in inside the About frame until the owner sends a photo of the shop.
    "cover-scene":     (1,  170,  260, 2390, 1960),
}

KEY = (255, 0, 255)


def render_pages() -> None:
    if shutil.which("pdftoppm") is None:
        sys.exit("pdftoppm not found. Install poppler: brew install poppler")
    WORK.mkdir(exist_ok=True)
    if not list(WORK.glob("page-*.png")):
        subprocess.run(["pdftoppm", "-r", "300", "-png", str(PDF), str(WORK / "page")], check=True)


def page_image(n: int) -> Image.Image:
    if n not in page_image.cache:
        page_image.cache[n] = Image.open(WORK / f"page-{n}.png").convert("RGB")
    return page_image.cache[n]
page_image.cache = {}


def cutout(
    page: int,
    box: tuple[int, int, int, int],
    tol: int = 34,
    pad: int = 12,
    key_water: bool = False,
) -> Image.Image:
    """
    Builds a matte by flood filling the background inward from the border, then
    takes colour from the untouched crop. Filling and sampling the same buffer
    leaves the fill colour showing wherever the matte is semi-transparent.
    """
    src = page_image(page).crop(box)
    w, h = src.size

    padded = Image.new("RGB", (w + pad * 2, h + pad * 2))
    padded.paste(src, (pad, pad))
    edge = np.array(padded)
    edge[:pad, pad:-pad] = edge[pad:pad + 1, pad:-pad]
    edge[-pad:, pad:-pad] = edge[-pad - 1:-pad, pad:-pad]
    edge[:, :pad] = edge[:, pad:pad + 1]
    edge[:, -pad:] = edge[:, -pad - 1:-pad]
    padded = Image.fromarray(edge)

    work = padded.copy()
    width, height = work.size
    seeds = (
        [(x, 2) for x in range(2, width - 2, 12)]
        + [(x, height - 3) for x in range(2, width - 2, 12)]
        + [(2, y) for y in range(2, height - 2, 12)]
        + [(width - 3, y) for y in range(2, height - 2, 12)]
    )
    for seed in seeds:
        if tuple(work.getpixel(seed)) != KEY:
            ImageDraw.floodfill(work, seed, KEY, thresh=tol)

    solid = ~np.all(np.array(work) == np.array(KEY), axis=-1)

    if key_water:
        # The hibiscus sit on watercolour water. A flood fill stalls at the
        # white marbling running through it, but neither flower contains any
        # blue, so anything blue-leaning or foam-white is background by
        # definition. Red, yellow and green all keep blue below red.
        rgb = np.array(padded).astype(np.int16)
        water = rgb[:, :, 2] > rgb[:, :, 0] * 0.95
        solid &= ~water

    solid = ndimage.binary_fill_holes(solid)

    # Keep only clusters worth showing, so stray specks of leftover background
    # do not float around the finished cutout.
    labels, count = ndimage.label(solid)
    if count > 0:
        sizes = ndimage.sum(solid, labels, range(1, count + 1))
        keep = np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s >= solid.size * 0.004])
        solid = keep

    alpha = Image.fromarray(np.where(solid, 255, 0).astype(np.uint8))
    # Pull the matte inside the silhouette so its soft edge samples foreground
    # colour rather than the ground it was cut from.
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))

    out = padded.convert("RGBA")
    out.putalpha(alpha)
    return out.crop(out.getbbox())


def main() -> None:
    render_pages()
    OUT_FLORA.mkdir(parents=True, exist_ok=True)
    OUT_ART.mkdir(parents=True, exist_ok=True)

    for name, (*spec, tol, key_water) in FLORA.items():
        page, *box = spec
        art = cutout(page, tuple(box), tol=tol, key_water=key_water)
        # Corner decoration never renders wider than about 420 CSS pixels, so
        # 840 covers 2x. WebP keeps the alpha at a fraction of PNG's weight.
        if art.width > 840:
            art = art.resize((840, round(art.height * 840 / art.width)), Image.LANCZOS)
        art.save(OUT_FLORA / f"{name}.webp", "WEBP", quality=88, method=6)

    for name, (page, *box) in PLATES.items():
        page_image(page).crop(tuple(box)).save(
            OUT_ART / f"{name}.webp", "WEBP", quality=84, method=6
        )

    print(f"wrote {len(FLORA)} cutouts to public/flora and {len(PLATES)} plates to public/art")


if __name__ == "__main__":
    main()
