"""
Crops the printed name-and-price label off the product cutouts.

The printed menu overlays each product with a wooden plaque carrying its name
and price, and on most shots that plaque sits low on the cup with the Mango
Tropical roundel under it. Where it lies over the food it cannot be separated,
so the label is cut away and the product is shown anchored to the top of its
frame, running off the bottom edge. That reads as a deliberate crop; a plaque
reading "16 OZ $8.50" baked into the photograph reads as a mistake.

Fractions are of the source height, measured off the cutouts by eye. The two
cups whose label sits across the middle of the drink are rebuilt instead, in
delabel.py, because cropping them would leave half a cup.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "assets/mango-tropical-assets/cutouts"
OUT = "public/menu"

# name -> fraction of the height to keep
KEEP_TOP = {
    "banana-royale": 0.51,
    "canasta-waffle": 0.86,
    "chocolate-delight": 0.50,
    "elote-en-vaso": 0.53,
    "float-coke": 0.60,
    "float-squirt": 0.63,
    "fresas-con-crema": 0.54,
    "gansito-nieve": 0.60,
    "pepinada-tropical": 0.57,
    "sandia-tropical": 0.58,
    "strawberry-delight": 0.57,
    "waffle-cone": 0.76,
}

# The banana split is a wide shot with its plaque off to the right of the tray,
# so it loses width rather than height.
KEEP_LEFT = {"banana-split": 0.66}


def tidy(im):
    """Re-trim to the content and drop fragments the crop left stranded."""
    a = np.array(im.convert("RGBA"))
    solid = a[..., 3] > 40
    if not solid.any():
        return im
    lab, n = ndimage.label(solid, structure=np.ones((3, 3), bool))
    sizes = ndimage.sum(solid, lab, range(1, n + 1))
    biggest = sizes.max()
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > biggest * 0.02])
    a[..., 3] = np.where(keep, a[..., 3], 0)
    ys, xs = np.where(a[..., 3] > 8)
    return Image.fromarray(a).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def main():
    for name, frac in sorted(KEEP_TOP.items()):
        im = Image.open(f"{SRC}/{name}.png").convert("RGBA")
        cut = im.crop((0, 0, im.width, int(im.height * frac)))
        out = tidy(cut)
        out.save(f"{OUT}/{name}.webp", "WEBP", quality=92, method=6)
        print(f"{name:22} {im.size} -> {out.size}")

    for name, frac in sorted(KEEP_LEFT.items()):
        im = Image.open(f"{SRC}/{name}.png").convert("RGBA")
        cut = im.crop((0, 0, int(im.width * frac), im.height))
        out = tidy(cut)
        out.save(f"{OUT}/{name}.webp", "WEBP", quality=92, method=6)
        print(f"{name:22} {im.size} -> {out.size}")


if __name__ == "__main__":
    sys.exit(main())
