"""
Extract product photography and background art from the printed menu PDF.

The menu is six flattened 300 DPI scans, so every product has to be cropped by
hand. Crop boxes are tuned to frame the loaded top of each item and to stay
clear of the printed name plaques and price tags baked into the page.

Usage:  python3 scripts/extract_menu_art.py
Output: public/menu/*.webp  and  public/art/*.webp
"""
import subprocess, sys, shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "assets" / "menu.pdf"
WORK = ROOT / ".menu-render"
OUT_MENU = ROOT / "public" / "menu"
OUT_ART = ROOT / "public" / "art"

# name -> (page, left, top, right, bottom)
PRODUCTS = {
    # Page 2, Antojitos con Fruta
    "pepinada-tropical":  (2,  150,  440,  790, 1190),
    "fresas-con-crema":   (2,  945,  470, 1500, 1080),
    "coctel-de-frutas":   (2, 1460,  680, 2150, 1290),
    "mangonada-tropical": (2,   95, 1590,  745, 2170),
    "raspa-tropical":     (2, 1000, 1590, 1660, 2090),
    "sandia-tropical":    (2, 1700, 1550, 2360, 2170),
    "banana-split":       (2,  500, 2650, 2080, 3060),
    # Page 3, Antojitos de Nieve
    "chocolate-delight":  (3,  190,  440,  840, 1100),
    "strawberry-delight": (3, 1090,  480, 1840,  975),
    "banana-royale":      (3,  640, 1490, 1320, 1980),
    "gansito-nieve":      (3, 1540, 1230, 2240, 1970),
    "conchi-nieve":       (3,  900, 2340, 1790, 3040),
    # Page 4, Nieves de Garrafa
    "nieve-mangonada":    (4,  100,  800,  630, 1400),
    "nieve-limon":        (4,  720,  930, 1300, 1460),
    "nieve-mango":        (4, 1830,  830, 2410, 1330),
    "nieve-tamarindo":    (4, 1290, 1390, 1880, 1950),
    "nieve-fresa":        (4,  120, 1770,  710, 2280),
    "canasta-waffle":     (4,  620, 1980, 1370, 2720),
    "waffle-cone":        (4, 1880, 1920, 2420, 2760),
    # Page 5, Antojitos de Comida
    "elote-en-vaso":      (5,  180,  470,  750, 1020),
    "elote-chorreado":    (5, 1050,  530, 2330, 1190),
    "chili-cheese-fries": (5,  230, 1410, 1260, 1990),
    "loaded-nachos":      (5, 1310, 1820, 2330, 2350),
    "salchipapas":        (5,  180, 2330, 1310, 2875),
    # Page 6, Raspas and Floats
    "raspas-trio":        (6, 1560,   90, 2410,  910),
    "helados-flotantes":  (6,  120, 1320, 1500, 2290),
}

# Background plates reused as page art and as the fill inside the hero type.
# Background plates. All taken from the cover, which is the only page with
# large areas of artwork that carry no printed text or product photography.
ART = {
    "palms-left":   (1,    0,  330,  335, 1900),
    "palms-right":  (1, 2215,  980, 2550, 1900),
    "paper-orange": (1,  900,  160, 1450,  375),
    "ocean-water":  (3,  150, 2470,  800, 3000),
}

# Circular sticker crops for hero and feature moments.
STICKERS = {
    "sticker-mangonada": (2,  130, 1600,  700, 2170),
    "sticker-raspa":     (6, 1640,   90, 2400,  850),
    "sticker-elote":     (5,  190,  470,  740, 1020),
}


def render_pages() -> None:
    if shutil.which("pdftoppm") is None:
        sys.exit("pdftoppm not found. Install poppler: brew install poppler")
    WORK.mkdir(exist_ok=True)
    if not list(WORK.glob("page-*.png")):
        subprocess.run(
            ["pdftoppm", "-r", "300", "-png", str(PDF), str(WORK / "page")],
            check=True,
        )


def page_image(n: int) -> Image.Image:
    if n not in page_image.cache:
        page_image.cache[n] = Image.open(WORK / f"page-{n}.png").convert("RGB")
    return page_image.cache[n]
page_image.cache = {}


def save_webp(im: Image.Image, path: Path, quality: int = 86) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)


def circle_mask(im: Image.Image) -> Image.Image:
    from PIL import ImageDraw
    side = min(im.size)
    im = im.crop((
        (im.width - side) // 2, (im.height - side) // 2,
        (im.width - side) // 2 + side, (im.height - side) // 2 + side,
    ))
    mask = Image.new("L", (side * 4, side * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, side * 4, side * 4), fill=255)
    mask = mask.resize((side, side), Image.LANCZOS)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def main() -> None:
    render_pages()
    for name, (page, *box) in PRODUCTS.items():
        save_webp(page_image(page).crop(tuple(box)), OUT_MENU / f"{name}.webp")
    for name, (page, *box) in ART.items():
        save_webp(page_image(page).crop(tuple(box)), OUT_ART / f"{name}.webp", 82)
    for name, (page, *box) in STICKERS.items():
        crop = page_image(page).crop(tuple(box))
        circle_mask(crop).save(OUT_MENU / f"{name}.png")
    # The social card renderer cannot decode WebP, so it gets a JPEG.
    og = page_image(2).crop((95, 1590, 745, 2170)).resize((470, 630), Image.LANCZOS)
    og.save(OUT_ART / "og-product.jpg", "JPEG", quality=88, optimize=True)

    total = len(PRODUCTS) + len(ART) + len(STICKERS) + 1
    print(f"wrote {total} files to public/menu and public/art")


if __name__ == "__main__":
    main()
