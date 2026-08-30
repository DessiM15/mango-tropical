"""
Product cutouts for the places a product is shown large.

The cups are clear plastic. A flood fill started at the page border runs
through the cup wall, so trying to keep the whole cup either deletes it or
drags the printed background art through it as a stain. What the fill does
handle cleanly is the food and the container's opaque edge, which is the part
worth showing large anyway.

So: flood the background, keep the single largest region, and stop the crop
above the printed name plaque, which on most pages is laid over the lower half
of the cup.

Usage:  python3 scripts/cut_products.py
Output: public/menu/cut-*.webp
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
OUT = ROOT / "public" / "menu"
KEY = (255, 0, 255)

# name -> page, crop box, flood tolerance.
# Tolerance has to clear the darker palm silhouettes printed behind the
# products without eating into the food itself.
PRODUCTS = {
    "mangonada":  (2, (60, 1470, 760, 2140), 48),
    "pepinada":   (2, (100, 350, 830, 1330), 48),
    "raspa":      (2, (960, 1520, 1700, 2130), 48),
    "chorreado":  (5, (1000, 470, 2390, 1180), 48),
    "conchi":     (3, (850, 2290, 1840, 3050), 48),
    # Fresas con Crema and Sandia Tropical are deliberately absent. Loose
    # whipped cream fragments under the fill, and the sandia's tamarindo stick
    # bridges to the printed plaque behind it and drags it along. Both keep
    # their circular crops.
    "banana":     (2, (450, 2590, 2130, 3050), 48),
}


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


def cut(page: int, box, tol: int) -> Image.Image:
    src = page_image(page).crop(box)
    width, height = src.size

    work = src.copy()
    seeds = (
        [(x, 0) for x in range(0, width, 6)]
        + [(x, height - 1) for x in range(0, width, 6)]
        + [(0, y) for y in range(0, height, 6)]
        + [(width - 1, y) for y in range(0, height, 6)]
    )
    for seed in seeds:
        if tuple(work.getpixel(seed)) != KEY:
            ImageDraw.floodfill(work, seed, KEY, thresh=tol)

    solid = ndimage.binary_fill_holes(~np.all(np.array(work) == np.array(KEY), axis=-1))

    # One product per crop, so anything not connected to the biggest region is
    # printed background art that the fill could not reach.
    labels, count = ndimage.label(solid)
    if count:
        sizes = ndimage.sum(solid, labels, range(1, count + 1))
        solid = labels == int(np.argmax(sizes)) + 1

    alpha = Image.fromarray(np.where(solid, 255, 0).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))

    out = src.convert("RGBA")
    out.putalpha(alpha)
    return out.crop(out.getbbox())


def main() -> None:
    render_pages()
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (page, box, tol) in PRODUCTS.items():
        art = cut(page, box, tol)
        if art.width > 900:
            art = art.resize((900, round(art.height * 900 / art.width)), Image.LANCZOS)
        art.save(OUT / f"cut-{name}.webp", "WEBP", quality=90, method=6)
        print(f"cut-{name}.webp  {art.width}x{art.height}")


if __name__ == "__main__":
    main()
