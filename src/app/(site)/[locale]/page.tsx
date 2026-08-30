import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TropicalHero } from "@/components/sections/TropicalHero";
import { CategoryRow } from "@/components/sections/CategoryRow";
import { Favorites } from "@/components/sections/Favorites";
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
      {/* Ordered the way the printed menu reads: the shop, then what is in it,
          then the favourites, then everything else. */}
      <TropicalHero locale={locale} />
      <CategoryRow locale={locale} />
      <Favorites locale={locale} />
      <FlavorShowcase locale={locale} />
      <ReviewWall locale={locale} />
      <StoryStrip locale={locale} />
      <FaqSection locale={locale} />
      <VisitSection locale={locale} />
      <JsonLd data={faqSchema} />
      <span className="sr-only">{site.tagline[locale]}</span>
    </>
  );
}
