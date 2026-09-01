"""
The printed menu's own world: its paper, its water, its sand, its foliage.

An earlier pass cut this artwork and then threw it away, replacing it with
generated photographic scenery on the grounds that the menu's flat vector art
was less dimensional. That was the wrong call for this shop. The menu is the
brand: a warm orange ground printed with palm silhouettes, tropical foliage
pushed into all four corners, and a painted ocean washing across the bottom of
every page. This puts it back.

What comes out:

  menu-paper    a seamlessly tiling patch of the palm-printed orange ground
  menu-water    a patch of the painted ocean, used to fill wave shapes
  leaves-*      the green corner clusters, keyed off the ground
  flowers-*     the plumeria and hibiscus corners, same

There is no sand here. Every stretch of beach on these six pages has a cup
standing on it, and the site's own sand tile and warm paper colours already
cover what it would have been used for.

Both grounds tile. They are cut from a clean part of a page and then
mirrored into a four-up block, so opposite edges of the block are reflections
of each other and meet exactly. Mirroring is visible on a regular texture and
invisible on an organic one, which is what these are.

Usage:  python3 scripts/extract_menu_world.py
Output: public/menu-world/*.webp
"""
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFile, ImageFilter
from scipy import ndimage

ImageFile.LOAD_TRUNCATED_IMAGES = True

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "assets" / "menu.pdf"
WORK = ROOT / ".menu-render"
OUT = ROOT / "public" / "menu-world"

# name -> (page, left, top, right, bottom) as fractions of the page.
# Every one of these is a stretch of ground with nothing printed on it.
GROUNDS = {
    # The left margin of the cover, clear of the wordmark and the water.
    "menu-paper": (1, 0.03, 0.22, 0.14, 0.42),
    # Open water at the foot of the cover, inside of the hibiscus.
    "menu-water": (1, 0.675, 0.915, 0.775, 0.975),
}

# name -> (page, box, which corner the art points into).
#
# The corner art is drawn over the ground rather than beside it, so there is no
# edge to cut along; it comes off by colour instead. Everything in these boxes
# is either foliage or ground, and the ground is the one orange thing.
# Both are taken off an inside page rather than the cover. The cover's lower
# corners sit on painted water, where the white of a plumeria petal and the
# white of surf foam are the same white and no colour test can separate them.
# On an inside page every corner sits on orange, and the site flips these two
# into the other two corners exactly as the print does.
CORNERS = {
    "leaves-corner": (4, (0.00, 0.00, 0.235, 0.145)),
    "flowers-corner": (4, (0.75, 0.00, 1.00, 0.145)),
}


def render_pages() -> None:
    if shutil.which("pdftoppm") is None:
        sys.exit("pdftoppm not found. Install poppler: brew install poppler")
    WORK.mkdir(exist_ok=True)
    if not list(WORK.glob("page-*.png")):
        subprocess.run(
            ["pdftoppm", "-r", "300", "-png", str(PDF), str(WORK / "page")], check=True
        )


def page(n: int) -> Image.Image:
    if n not in page.cache:
        page.cache[n] = Image.open(WORK / f"page-{n}.png").convert("RGB")
    return page.cache[n]


page.cache = {}


def crop(n: int, box) -> Image.Image:
    image = page(n)
    left, top, right, bottom = box
    return image.crop(
        (
            round(left * image.width),
            round(top * image.height),
            round(right * image.width),
            round(bottom * image.height),
        )
    )


def tileable(patch: Image.Image, size: int) -> Image.Image:
    """Four-up mirror, so the block's left edge equals its right edge."""
    patch = patch.resize((size // 2, size // 2), Image.LANCZOS)
    block = Image.new("RGB", (size, size))
    block.paste(patch, (0, 0))
    block.paste(patch.transpose(Image.FLIP_LEFT_RIGHT), (size // 2, 0))
    block.paste(patch.transpose(Image.FLIP_TOP_BOTTOM), (0, size // 2))
    block.paste(patch.transpose(Image.ROTATE_180), (size // 2, size // 2))
    return block


def key_ground(patch: Image.Image) -> Image.Image:
    """
    Drop the printed ground, keep the art drawn on top of it.

    The ground is one warm orange, in a band of shades because the palm print
    darkens it. The foliage is green, white, yellow and red, none of which is
    in that band, so a hue test separates them where no edge exists to cut on.
    """
    pixels = np.array(patch).astype(np.int16)
    red, green, blue = pixels[:, :, 0], pixels[:, :, 1], pixels[:, :, 2]

    high = pixels.max(axis=2)
    low = pixels.min(axis=2)
    chroma = high - low

    # Orange on this page runs red > green > blue with a wide gap to blue.
    orange = (red > green) & (green >= blue) & (chroma > 24) & (red > 120)
    # Its hue, as sixths of the wheel, sits between yellow-orange and red.
    with np.errstate(divide="ignore", invalid="ignore"):
        hue = np.where(chroma > 0, (green - blue) / np.maximum(chroma, 1), 0.0)
    ground = orange & (hue > 0.16) & (hue < 0.92)

    keep = ~ground

    # Speckle both ways: drop stray ground pixels inside a leaf, and stray leaf
    # pixels out in the open.
    keep = ndimage.binary_closing(keep, np.ones((5, 5)))
    keep = ndimage.binary_opening(keep, np.ones((5, 5)))
    labels, count = ndimage.label(keep)
    if count > 1:
        sizes = ndimage.sum(keep, labels, range(1, count + 1))
        big = {i + 1 for i, size in enumerate(sizes) if size >= sizes.max() * 0.02}
        keep = np.isin(labels, list(big))

    out = Image.fromarray(np.dstack([pixels.astype(np.uint8), (keep * 255).astype(np.uint8)]))
    # A one pixel key is a hard jaggy edge on flat vector art; soften it.
    alpha = out.getchannel("A").filter(ImageFilter.GaussianBlur(1.1))
    out.putalpha(alpha)
    bounds = out.getbbox()
    return out.crop(bounds) if bounds else out


def main() -> int:
    if not PDF.exists():
        print(f"missing {PDF}", file=sys.stderr)
        return 1
    render_pages()
    OUT.mkdir(parents=True, exist_ok=True)

    for name, (number, *box) in GROUNDS.items():
        block = tileable(crop(number, box), 768 if name == "menu-paper" else 512)
        block.save(OUT / f"{name}.webp", quality=88, method=6)
        print(f"  {name}.webp  {block.width}x{block.height}")

    for name, (number, box) in CORNERS.items():
        art = key_ground(crop(number, box))
        if max(art.size) > 900:
            scale = 900 / max(art.size)
            art = art.resize(
                (round(art.width * scale), round(art.height * scale)), Image.LANCZOS
            )
        art.save(OUT / f"{name}.webp", quality=90, method=6)
        print(f"  {name}.webp  {art.width}x{art.height}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
