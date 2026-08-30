import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { TornEdge } from "@/components/Dividers";
import { JsonLd } from "@/components/JsonLd";
import { MagneticButton } from "@/components/MagneticButton";
import { FlavorShowcase } from "@/components/sections/FlavorShowcase";
import { VisitSection } from "@/components/sections/VisitSection";
import { copy } from "@/lib/copy";
import { isLocale, locales, path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

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
  const url = path(locale, "about");
  return {
    title: copy.about.metaTitle[locale],
    description: copy.about.metaDescription[locale],
    alternates: {
      canonical: url,
      languages: {
        "en-US": path("en", "about"),
        "es-US": path("es", "about"),
        "x-default": path("en", "about"),
      },
    },
    openGraph: { url: site.url + url, title: copy.about.metaTitle[locale] },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
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
        name: copy.nav.about[locale],
        item: site.url + path(locale, "about"),
      },
    ],
  };

  const tiles = [
    { src: "/menu/mangonada-tropical.webp", tilt: "-3deg" },
    { src: "/menu/elote-chorreado.webp", tilt: "2.5deg" },
    { src: "/menu/raspas-trio.webp", tilt: "2deg" },
    { src: "/menu/conchi-nieve.webp", tilt: "-2.5deg" },
  ];

  return (
    <>
      <PageHeader
        es={copy.headings.about.es}
        en={copy.headings.about.en}
        single={copy.headings.about[locale]}
        body={site.tagline[locale]}
      />

      <div className="relative bg-sand-50 pb-20 pt-16 sm:pb-28">
        <TornEdge className="absolute inset-x-0 top-0 h-10 -translate-y-full sm:h-14" fill="var(--color-sunset-500)" flip />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {copy.about.body.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <p
                className={`font-body leading-relaxed text-ink ${
                  index === 0
                    ? "text-xl font-semibold sm:text-2xl"
                    : "mt-6 text-lg text-ink-soft sm:text-xl"
                }`}
              >
                {paragraph[locale]}
              </p>
            </Reveal>
          ))}

          <Reveal className="mt-12">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {tiles.map((tile) => (
                <div
                  key={tile.src}
                  className="relative aspect-square overflow-hidden rounded-[1.75rem] shadow-card"
                  style={{ transform: `rotate(${tile.tilt})` }}
                >
                  <Image
                    src={tile.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 45vw, 22rem"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="display text-3xl text-ink sm:text-4xl">
              {copy.about.factsTitle[locale]}
            </h2>
            <dl className="mt-6 divide-y-2 divide-dashed divide-ink/20 rounded-3xl bg-white px-6 shadow-card">
              {copy.about.facts.map((fact) => (
                <div key={fact.label.en} className="py-5 sm:flex sm:gap-8">
                  <dt className="label-type shrink-0 text-lg text-chamoy-500 sm:w-48">
                    {fact.label[locale]}
                  </dt>
                  <dd className="mt-1 font-body text-lg text-ink sm:mt-0">{fact.value[locale]}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <MagneticButton href={path(locale, "menu")} variant="solid">
              {copy.menuSection.viewAll[locale]}
            </MagneticButton>
            <MagneticButton href={mapsUrl} variant="cream" external>
              {copy.visit.directions[locale]}
            </MagneticButton>
          </div>
        </div>
      </div>

      <FlavorShowcase locale={locale} />
      <VisitSection locale={locale} />
      <JsonLd data={breadcrumbs} />
    </>
  );
}
