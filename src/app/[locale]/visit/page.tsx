import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { VisitSection } from "@/components/sections/VisitSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { copy } from "@/lib/copy";
import { isLocale, locales, path, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

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
  const url = path(locale, "visit");
  return {
    title: copy.visit.metaTitle[locale],
    description: copy.visit.metaDescription[locale],
    alternates: {
      canonical: url,
      languages: {
        "en-US": path("en", "visit"),
        "es-US": path("es", "visit"),
        "x-default": path("en", "visit"),
      },
    },
    openGraph: { url: site.url + url, title: copy.visit.metaTitle[locale] },
  };
}

export default async function VisitPage({ params }: { params: Promise<{ locale: string }> }) {
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
        name: copy.nav.visit[locale],
        item: site.url + path(locale, "visit"),
      },
    ],
  };

  return (
    <>
      <PageHeader
        es={copy.headings.visit.es}
        en={copy.headings.visit.en}
        single={copy.headings.visit[locale]}
        body={copy.visit.body[locale]}
      />
      <VisitSection locale={locale} />
      <FaqSection locale={locale} />
      <JsonLd data={breadcrumbs} />
    </>
  );
}
