import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { MenuPreview } from "@/components/sections/MenuPreview";
import { BuildPromo } from "@/components/sections/BuildPromo";
import { ReviewWall } from "@/components/sections/ReviewWall";
import { FlavorShowcase } from "@/components/sections/FlavorShowcase";
import { StoryStrip } from "@/components/sections/StoryStrip";
import { FaqSection } from "@/components/sections/FaqSection";
import { VisitSection } from "@/components/sections/VisitSection";
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
  return {
    title: copy.home.metaTitle[locale],
    description: copy.home.metaDescription[locale],
    alternates: {
      canonical: path(locale, "home"),
      languages: { "en-US": "/", "es-US": "/es", "x-default": "/" },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q[locale],
      acceptedAnswer: { "@type": "Answer", text: item.a[locale] },
    })),
  };

  return (
    <>
      <Hero locale={locale} />
      <MenuPreview locale={locale} />
      <BuildPromo locale={locale} />
      <ReviewWall locale={locale} />
      <FlavorShowcase locale={locale} />
      <StoryStrip locale={locale} />
      <FaqSection locale={locale} />
      <VisitSection locale={locale} />
      <JsonLd data={faqSchema} />
      <link rel="preload" as="image" href="/art/ocean-water.webp" />
      <span className="sr-only">{site.tagline[locale]}</span>
    </>
  );
}
