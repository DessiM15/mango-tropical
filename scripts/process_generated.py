"""
Turn the generated scene art into site assets.

The cutouts arrive on a flat chroma green. Keying on "how green is this pixel"
would also delete the palm fronds and leaves, which are green too. The
separation that works is hue plus saturation: the backdrop sits around hue 145
at near-full saturation, while foliage sits nearer hue 125 at roughly two
thirds. Everything keyed also gets despilled, because a green backdrop throws
green onto the edges of whatever stands in front of it.

Usage:  python3 scripts/process_generated.py
Output: public/scene/*.webp
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "generated"
OUT = ROOT / "public" / "scene"

# Backdrop hue sits at 145 degrees; foliage lands near 125. The window is kept
# tight and paired with a high saturation floor so leaves survive.
HUE_CENTRE = 145.0
HUE_WIDTH = 17.0
SAT_FLOOR = 0.72
VAL_FLOOR = 0.18

# stem -> longest edge in the finished asset
CUTOUTS = {
    "flowers-cluster": 1400,
    "palm-fronds": 1400,
    "hibiscus-pair": 1200,
    "fruit-citrus": 1400,
    "fruit-strawberry": 1400,
    "fruit-mango": 1400,
    "tamarindo-sticks": 1200,
}

# Fruit arrives as a tray of separated pieces. Splitting it lets each piece be
# placed individually, which is what makes a scatter read as scattered rather
# than as one pasted photograph.
SPLIT = {
    "fruit-citrus": 7,
    "fruit-strawberry": 7,
    "fruit-mango": 8,
    "tamarindo-sticks": 4,
}

PLATES = {
    "sunset-sky": 1920,
    "wave-crest": 1920,
    "water-surface": 1400,
}


def find(stem: str) -> Path | None:
    """Filenames came back with doubled extensions, so match on the stem."""
    for candidate in sorted(SRC.glob(f"{stem}*")):
        if candidate.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
            return candidate
    return None


def hsv(pixels: np.ndarray):
    scaled = pixels.astype(np.float32) / 255.0
    r, g, b = scaled[..., 0], scaled[..., 1], scaled[..., 2]
    mx = scaled.max(axis=-1)
    mn = scaled.min(axis=-1)
    delta = mx - mn

    hue = np.zeros_like(mx)
    safe = delta > 1e-6
    red = safe & (mx == r)
    green = safe & (mx == g)
    blue = safe & (mx == b)
    hue[red] = (60 * ((g - b) / np.where(delta == 0, 1, delta)))[red] % 360
    hue[green] = (60 * (2 + (b - r) / np.where(delta == 0, 1, delta)))[green]
    hue[blue] = (60 * (4 + (r - g) / np.where(delta == 0, 1, delta)))[blue]

    saturation = np.where(mx > 0, delta / np.where(mx == 0, 1, mx), 0)
    return hue, saturation, mx


def key_green(path: Path, longest: int) -> Image.Image:
    src = Image.open(path).convert("RGB")
    pixels = np.array(src)
    hue, saturation, value = hsv(pixels)

    hue_distance = np.abs(hue - HUE_CENTRE)
    backdrop = (hue_distance < HUE_WIDTH) & (saturation > SAT_FLOOR) & (value > VAL_FLOOR)

    # A soft shoulder either side of the hard key, so edges are not stair-stepped.
    shoulder = (
        (hue_distance < HUE_WIDTH * 1.7)
        & (saturation > SAT_FLOOR * 0.82)
        & (value > VAL_FLOOR)
        & ~backdrop
    )

    alpha = np.where(backdrop, 0.0, 1.0)
    alpha[shoulder] = 0.45

    # Fill any holes the key punched inside the subject, then drop specks of
    # backdrop the key missed.
    solid = ndimage.binary_fill_holes(alpha > 0.5)
    labels, count = ndimage.label(~solid)
    if count:
        sizes = ndimage.sum(~solid, labels, range(1, count + 1))
        tiny = [i + 1 for i, s in enumerate(sizes) if s < solid.size * 0.0004]
        if tiny:
            solid |= np.isin(labels, tiny)
    alpha = np.where(solid, np.maximum(alpha, 0.5), alpha)
    alpha = np.where(solid & (alpha >= 0.5), 1.0, alpha)

    # Despill, but only in a narrow band just inside the matte. Spill is a rim
    # effect from light bouncing off the backdrop, so correcting the whole image
    # instead turns every legitimately green thing brown: the palm fronds, the
    # leaves under the flowers, and the limes.
    inside = alpha > 0.5
    rim = ndimage.binary_dilation(~inside, iterations=5) & inside

    out = pixels.astype(np.float32)
    ceiling = (out[..., 0] + out[..., 2]) / 2 + 18
    over = (out[..., 1] > ceiling) & rim
    out[..., 1] = np.where(over, ceiling, out[..., 1])

    image = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert("RGBA")
    matte = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    image.putalpha(matte)

    image = image.crop(image.getbbox())
    if image.width > longest:
        image = image.resize((longest, round(image.height * longest / image.width)), Image.LANCZOS)
    return image


def split_pieces(art: Image.Image, stem: str, limit: int) -> int:
    """Saves the largest separate pieces of a keyed tray as their own files."""
    alpha = np.array(art.getchannel("A"))
    labels, count = ndimage.label(alpha > 128)
    if not count:
        return 0

    sizes = ndimage.sum(alpha > 128, labels, range(1, count + 1))
    ranked = np.argsort(sizes)[::-1][:limit]
    written = 0

    for index, label in enumerate(ranked, start=1):
        if sizes[label] < alpha.size * 0.0015:
            continue
        piece = np.array(art).copy()
        piece[..., 3] = np.where(labels == label + 1, piece[..., 3], 0)
        cut = Image.fromarray(piece, "RGBA")
        box = cut.getbbox()
        if box is None:
            continue
        cut = cut.crop(box)
        if max(cut.size) > 300:
            scale = 300 / max(cut.size)
            cut = cut.resize((max(1, round(cut.width * scale)), max(1, round(cut.height * scale))), Image.LANCZOS)
        cut.save(OUT / f"{stem}-{index}.webp", "WEBP", quality=92, method=6)
        written += 1

    return written


def plate(path: Path, longest: int) -> Image.Image:
    image = Image.open(path).convert("RGB")
    if image.width > longest:
        image = image.resize((longest, round(image.height * longest / image.width)), Image.LANCZOS)
    return image


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    missing = []

    for stem, longest in CUTOUTS.items():
        path = find(stem)
        if path is None:
            missing.append(stem)
            continue
        art = key_green(path, longest)
        art.save(OUT / f"{stem}.webp", "WEBP", quality=90, method=6)
        note = ""
        if stem in SPLIT:
            note = f"  + {split_pieces(art, stem, SPLIT[stem])} pieces"
        print(f"cutout  {stem:20s} {art.width}x{art.height}{note}")

    for stem, longest in PLATES.items():
        path = find(stem)
        if path is None:
            missing.append(stem)
            continue
        art = plate(path, longest)
        art.save(OUT / f"{stem}.webp", "WEBP", quality=86, method=6)
        print(f"plate   {stem:20s} {art.width}x{art.height}")

    # Sand is used as a raw CSS background in several sections, which bypasses
    # the image optimiser entirely, so the full plate would ship at full size
    # every time. A small tile carries the same texture at a fraction of it.
    sand = find("wet-sand")
    if sand is not None:
        tile = Image.open(sand).convert("RGB")
        tile = tile.resize((640, round(tile.height * 640 / tile.width)), Image.LANCZOS)
        tile.save(OUT / "wet-sand-tile.webp", "WEBP", quality=74, method=6)
        print(f"tile    wet-sand-tile        {tile.width}x{tile.height}")

    # The one real photograph of the shop.
    front = ROOT / "assets" / "store-front.webp"
    if front.exists():
        photo = Image.open(front).convert("RGB")
        if photo.height > 1600:
            photo = photo.resize((round(photo.width * 1600 / photo.height), 1600), Image.LANCZOS)
        photo.save(OUT / "storefront.webp", "WEBP", quality=88, method=6)
        print(f"photo   storefront           {photo.width}x{photo.height}")

    if missing:
        print("\nmissing:", ", ".join(missing))


if __name__ == "__main__":
    main()
