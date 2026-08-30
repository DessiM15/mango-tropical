import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { copy } from "@/lib/copy";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { addressLine, site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}, Cypress, Texas`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Anton is fetched so the share card carries the same display type as the site.
 * The request deliberately sends no User-Agent, because Google then serves
 * TrueType and the renderer behind ImageResponse cannot parse woff2. If the
 * network is unavailable the card still renders in the default face.
 */
async function displayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Anton").then((r) => r.text());
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    const data = await fetch(url).then((r) => r.arrayBuffer());
    return data.byteLength > 0 ? data : null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  // The renderer decodes PNG and JPEG only, never WebP.
  const [font, logo, product] = await Promise.all([
    displayFont(),
    readFile(join(process.cwd(), "public", "logo.png")).catch(() => null),
    readFile(join(process.cwd(), "public", "art", "og-product.jpg")).catch(() => null),
  ]);

  const uri = (buffer: Buffer | null, mime: string) =>
    buffer ? `data:${mime};base64,${buffer.toString("base64")}` : undefined;

  const logoSrc = uri(logo, "image/png");
  const productSrc = uri(product, "image/jpeg");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: font ? "Anton" : "sans-serif",
          background: "#e67638",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            height: "100%",
            padding: "56px 56px 52px",
            backgroundImage: "linear-gradient(160deg, #fbb146 0%, #e67638 62%, #d25a28 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {logoSrc ? (
              <img
                src={logoSrc}
                width={84}
                height={84}
                style={{ borderRadius: 999, border: "5px solid #2a1206" }}
                alt=""
              />
            ) : null}
            <div style={{ display: "flex", fontSize: 42, color: "#fdf8ee", letterSpacing: -1 }}>
              MANGO TROPICAL
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 74,
                lineHeight: 0.94,
                color: "#fdf8ee",
                letterSpacing: -2,
                maxWidth: 640,
              }}
            >
              {copy.og.headline[locale]}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "#2a1206",
                marginTop: 22,
                letterSpacing: -0.5,
              }}
            >
              {copy.og.sub[locale]}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#2a1206",
              background: "#ffc61e",
              border: "5px solid #2a1206",
              borderRadius: 999,
              padding: "12px 26px",
              alignSelf: "flex-start",
            }}
          >
            {addressLine}
          </div>
        </div>

        <div style={{ display: "flex", width: 440, height: "100%", borderLeft: "8px solid #2a1206" }}>
          {productSrc ? (
            <img src={productSrc} width={432} height={630} style={{ objectFit: "cover" }} alt="" />
          ) : null}
        </div>
      </div>
    ),
    font
      ? { ...size, fonts: [{ name: "Anton", data: font, weight: 400 as const, style: "normal" as const }] }
      : size,
  );
}
