import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { BuildTool } from "@/components/BuildTool";
import { TornEdge } from "@/components/Dividers";
import { JsonLd } from "@/components/JsonLd";
import { VisitSection } from "@/components/sections/VisitSection";
import { copy } from "@/lib/copy";
import { isLocale, locales, path, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const meta = {
  title: {
    en: "Build Your Own Mangonada",
    es: "Arma Tu Propia Mangonada",
  },
  description: {
    en: "Pick your size, nieve flavor, fruit, chamoy level and toppings, see the price add up, then bring it to the counter at Mango Tropical in Cypress, Texas.",
    es: "Escoge tamaño, sabor de nieve, fruta, nivel de chamoy y toppings, mira el precio sumarse, y llévalo al mostrador en Mango Tropical, Cypress, Texas.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const url = path(locale, "build");
  return {
    title: meta.title[locale],
    description: meta.description[locale],
    alternates: {
      canonical: url,
      languages: {
        "en-US": path("en", "build"),
        "es-US": path("es", "build"),
        "x-default": path("en", "build"),
      },
    },
    openGraph: { url: site.url + url, title: meta.title[locale], description: meta.description[locale] },
  };
}

export default async function BuildPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: site.url + path(locale, "home") },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.nav.build[locale],
        item: site.url + path(locale, "build"),
      },
    ],
  };

  return (
    <>
      <PageHeader
        es={copy.headings.build.es}
        en={copy.headings.build.en}
        tone="comida"
        body={copy.build.body[locale]}
      />

      <div className="relative bg-mango-400 pb-20 pt-16 sm:pb-28">
        <TornEdge className="absolute inset-x-0 top-0 h-10 -translate-y-full sm:h-14" fill="var(--color-sunset-500)" flip />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* The tool reads the shared build out of the query string, which
              needs a boundary so the rest of the page still prerenders. */}
          <Suspense
            fallback={
              <div className="h-[42rem] rounded-[2rem] bg-sand-50 shadow-card" />
            }
          >
            <BuildTool locale={locale} />
          </Suspense>
        </div>
      </div>

      <VisitSection locale={locale} />
      <JsonLd data={breadcrumbs} />
    </>
  );
}
