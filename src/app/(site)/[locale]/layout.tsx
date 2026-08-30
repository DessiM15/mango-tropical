import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Anton, Grandstander, Nunito } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { copy } from "@/lib/copy";
import { htmlLang, isLocale, locales, path, type Locale } from "@/lib/i18n";
import { addressLine, openingHoursSpecification, site } from "@/lib/site";
import "../../globals.css";

// The "latin" subset already covers the accented characters and inverted
// punctuation Spanish needs, so latin-ext would only add weight. Weights are
// pinned to the ones actually used, which keeps the variable families from
// shipping their full axis.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const grandstander = Grandstander({
  weight: ["800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-grandstander",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#e67638",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${copy.home.metaTitle[locale]}`,
      template: `%s | ${site.name}`,
    },
    description: copy.home.metaDescription[locale],
    applicationName: site.name,
    alternates: {
      canonical: path(locale, "home"),
      languages: {
        "en-US": "/",
        "es-US": "/es",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "en" ? "en_US" : "es_US",
      alternateLocale: locale === "en" ? "es_US" : "en_US",
      url: site.url + path(locale, "home"),
      title: `${site.name} | ${copy.home.metaTitle[locale]}`,
      description: copy.home.metaDescription[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} | ${copy.home.metaTitle[locale]}`,
      description: copy.home.metaDescription[locale],
    },
    icons: {
      icon: [
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/icon-180.png", sizes: "180x180" }],
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: true, address: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["IceCreamShop", "Restaurant"],
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.tagline[locale],
    url: site.url,
    telephone: site.phone,
    priceRange: site.priceRange,
    servesCuisine: [...site.servesCuisine],
    image: `${site.url}/logo.png`,
    logo: `${site.url}/logo.png`,
    hasMenu: `${site.url}${path(locale, "menu")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [site.social.instagram, site.social.facebook],
    areaServed: [
      { "@type": "City", name: "Cypress" },
      { "@type": "City", name: "Houston" },
      { "@type": "City", name: "Katy" },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: htmlLang[locale],
    publisher: { "@id": `${site.url}/#business` },
  };

  return (
    // The inline script below adds a class to <html> before React hydrates, so
    // the class list is expected to differ from the server output.
    <html
      lang={htmlLang[locale]}
      suppressHydrationWarning
      className={`${anton.variable} ${grandstander.variable} ${nunito.variable}`}
    >
      <head>
        {/* Marks that scripting is available before first paint, which is what
            gates the scroll reveals. Without it every section stays visible. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="grain vignette graded min-h-dvh antialiased">
        <SiteHeader locale={locale} />
        <main id="main">{children}</main>
        <SiteFooter locale={locale} />
        <JsonLd data={[localBusiness, website]} />
        <span className="sr-only">{addressLine}</span>
      </body>
    </html>
  );
}
