"""
Product cutouts from the studio set in assets/new-menu-items.

These replace the flood-filled crops the older scripts pulled out of the
printed menu PDF. They arrive already masked, so there is no keying to do; what
they carry is litter from the page they were cut off. Three kinds:

  1. Loose fragments of the neighbouring product, unconnected to the subject.
     Every one of these is a separate region in the alpha, so keeping only the
     largest region clears them without a single hand-placed box.
  2. Fragments that touch the subject, and the printed name plaques with the
     in-store price baked into them. Those have to come off by hand, which is
     what ERASE is for. The site sets its own prices; a photograph that carries
     last season's price is a photograph that will be wrong.
  3. Background kept as part of the subject (the sand behind the canasta).
     KEEP crops to the part worth having.

Boxes are fractions of the frame, so they stay right if the set is ever
re-exported at another size.

Usage:  python3 scripts/cut_new_products.py
Output: public/menu/*.webp
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFile
from scipy import ndimage

# A couple of the source files are truncated a few bytes early. They decode
# fine to the last row, so read them rather than dropping the product.
ImageFile.LOAD_TRUNCATED_IMAGES = True

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "new-menu-items"
OUT = ROOT / "public" / "menu"

# The float photographs have printed page graphics composited into the drink
# itself, well inside the cup rather than around it. Nothing croppable, so they
# are left out until the set is re-exported and the old float art stays.
SKIP = {"28_coke_float", "29_squirt_float", "30_fanta_float"}

# source stem -> slug the site asks for
NAMES = {
    "01_pepinada_tropical": "pepinada-tropical",
    "02_fresas_con_crema": "fresas-con-crema",
    "03_coctel_de_frutas": "coctel-de-frutas",
    "04_mangonada_tropical": "mangonada-tropical",
    "05_raspa_tropical": "raspa-tropical",
    "06_sandia_tropical": "sandia-tropical",
    "07_banana_split": "banana-split",
    "08_chocolate_delight": "chocolate-delight",
    "09_strawberry_delight": "strawberry-delight",
    "10_banana_royale": "banana-royale",
    "11_gansito_nieve": "gansito-nieve",
    "12_conchi_nieve": "conchi-nieve",
    "13_nieve_mango_chamoy_cup": "nieve-mango-chamoy",
    "14_nieve_limon_cup": "nieve-limon",
    "15_nieve_mango_vanilla_cup": "nieve-mango",
    "16_nieve_fresa_cup": "nieve-fresa",
    "17_nieve_tamarindo_cup": "nieve-tamarindo",
    "18_canasta_waffle": "canasta-waffle",
    "19_waffle_cone": "waffle-cone",
    "20_elote_en_vaso": "elote-en-vaso",
    "21_elote_chorreado": "elote-chorreado",
    "22_chili_cheese_fries": "chili-cheese-fries",
    "23_loaded_nachos": "loaded-nachos",
    "24_salchi_papas": "salchipapas",
    "25_snowball_red": "snowball-red",
    "26_snowball_yellow": "snowball-yellow",
    "27_snowball_blue": "snowball-blue",
}

# stem -> boxes to clear, as (left, top, right, bottom) fractions.
ERASE = {
    # the edge of a concha, under the cup and out to its left
    "11_gansito_nieve": [(0.00, 0.795, 0.33, 1.00), (0.00, 0.905, 0.62, 1.00)],
    # the rim and plate of the cup photographed behind it
    # the printed logo on the cup behind it, which is not white and so
    # survives the WHITE_OUT that takes the rest of that cup
    "12_conchi_nieve": [(0.48, 0.00, 0.80, 0.26)],
    # sand from the page, in the corner the basket does not fill
    "18_canasta_waffle": [(0.385, 0.00, 0.62, 0.335), (0.572, 0.00, 0.62, 0.66)],
    # printed name plaques, several carrying the in-store price
    "20_elote_en_vaso": [(0.00, 0.745, 1.00, 1.00)],
    "21_elote_chorreado": [(0.00, 0.72, 1.00, 1.00)],
    "24_salchi_papas": [(0.18, 0.645, 0.58, 0.78)],
    # the tray it was shot in, and a skewer under it
    "23_loaded_nachos": [(0.00, 0.00, 1.00, 0.275), (0.00, 0.715, 1.00, 1.00)],
}

# stem -> the one region worth keeping, same fractions.
KEEP = {
    # the basket, without the sand it was photographed on
    "18_canasta_waffle": (0.00, 0.00, 0.60, 0.652),
    # The name plaque is printed across the cone rather than under it, so the
    # cone cannot be kept whole. Cut above the plaque: everywhere this one is
    # used it sits in a chip that crops the bottom anyway.
    "19_waffle_cone": (0.00, 0.00, 1.00, 0.74),
}

# stem -> box to clear the white out of.
#
# The conchi was photographed with the white plate of the next product behind
# it. The plate has no edge to cut along, but nothing in that corner of the
# frame is white except the plate, so it comes off by colour instead: anything
# bright and unsaturated inside the box goes.
WHITE_OUT = {
    "12_conchi_nieve": (0.45, 0.00, 1.00, 0.40),
}

# stem -> (axis, from) fractions.
#
# The mangonada is the one product where the litter sits *on* the subject: a
# waffle from the next photograph covers the bottom right of the cup, so there
# is no box that takes the waffle without taking cup with it. The cup is a
# symmetrical moulded one, and its bottom left is clean, so the right side is
# rebuilt from the left rather than cut away. This is the site's hero product;
# a cup with a bite out of it was not worth shipping.
MIRROR = {
    "04_mangonada_tropical": (0.481, 0.745),
}

# The raspa category is shown as the three snowball colours together. Built
# here rather than by hand so it stays in step with the cutouts it is made of.
TRIO = ["snowball-red", "snowball-yellow", "snowball-blue"]

LONG_EDGE = 1200


def clean(path: Path, stem: str) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    pixels = np.array(image)
    alpha = pixels[:, :, 3]
    height, width = alpha.shape

    def box(fractions):
        left, top, right, bottom = fractions
        return (
            slice(int(top * height), int(bottom * height)),
            slice(int(left * width), int(right * width)),
        )

    if stem in KEEP:
        rows, cols = box(KEEP[stem])
        outside = np.ones_like(alpha, dtype=bool)
        outside[rows, cols] = False
        alpha[outside] = 0

    for fractions in ERASE.get(stem, []):
        rows, cols = box(fractions)
        alpha[rows, cols] = 0

    if stem in WHITE_OUT:
        rows, cols = box(WHITE_OUT[stem])
        patch = pixels[rows, cols, :3].astype(int)
        pale = (patch.max(axis=2) > 228) & (patch.max(axis=2) - patch.min(axis=2) < 26)
        alpha[rows, cols] = np.where(pale, 0, alpha[rows, cols])

    if stem in MIRROR:
        axis_at, from_at = MIRROR[stem]
        axis, top = int(axis_at * width), int(from_at * height)
        reach = min(axis, width - axis)
        left = pixels[top:, axis - reach : axis]
        pixels[top:, axis : axis + reach] = left[:, ::-1]
        alpha = pixels[:, :, 3]

    # Everything that is not the subject is now its own island, so the subject
    # is the biggest one. Every product in this set is a single connected
    # object, which is what makes the rule safe to apply across all of them.
    solid = alpha > 40
    labels, count = ndimage.label(solid)
    if count > 1:
        sizes = ndimage.sum(solid, labels, range(1, count + 1))
        alpha = np.where(labels == int(np.argmax(sizes)) + 1, alpha, 0)

    pixels[:, :, 3] = alpha
    trimmed = Image.fromarray(pixels)
    bounds = trimmed.getbbox()
    if bounds:
        trimmed = trimmed.crop(bounds)

    if max(trimmed.size) > LONG_EDGE:
        scale = LONG_EDGE / max(trimmed.size)
        trimmed = trimmed.resize(
            (round(trimmed.width * scale), round(trimmed.height * scale)), Image.LANCZOS
        )
    return trimmed


def save(image: Image.Image, slug: str) -> None:
    image.save(OUT / f"{slug}.webp", quality=90, method=6)
    print(f"  {slug}.webp  {image.width}x{image.height}")


def main() -> int:
    if not SRC.is_dir():
        print(f"missing {SRC}", file=sys.stderr)
        return 1
    OUT.mkdir(parents=True, exist_ok=True)

    cut: dict[str, Image.Image] = {}
    for path in sorted(SRC.glob("*.png")):
        if path.stem in SKIP:
            print(f"  skipped {path.stem} (page graphics inside the cup)")
            continue
        slug = NAMES.get(path.stem)
        if not slug:
            print(f"  unmapped {path.stem}", file=sys.stderr)
            continue
        image = clean(path, path.stem)
        cut[slug] = image
        save(image, slug)

    # The trio, laid out with the two outer cups dropped and scaled back so the
    # group reads as a photograph of three cups rather than three photographs.
    parts = [cut[slug] for slug in TRIO if slug in cut]
    if len(parts) == 3:
        height = max(part.height for part in parts)
        scales, drops = (0.82, 1.0, 0.82), (0.13, 0.0, 0.13)
        placed = [
            part.resize(
                (round(part.width * height * scale / part.height), round(height * scale)),
                Image.LANCZOS,
            )
            for part, scale in zip(parts, scales)
        ]
        overlap = round(min(part.width for part in placed) * 0.16)
        canvas = Image.new(
            "RGBA",
            (sum(part.width for part in placed) - 2 * overlap, round(height * 1.14)),
            (0, 0, 0, 0),
        )
        x = 0
        for part, drop in zip(placed, drops):
            canvas.alpha_composite(part, (x, round(height * (1.0 - part.height / height + drop))))
            x += part.width - overlap
        bounds = canvas.getbbox()
        save(canvas.crop(bounds) if bounds else canvas, "raspas-trio")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
