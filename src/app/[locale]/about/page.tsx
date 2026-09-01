import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { TornEdge } from "@/components/Dividers";
import { PropScatter } from "@/components/Confetti";
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

  /*
   * Four products, stuck to the page rather than framed by it.
   *
   * These were square photographs cropped with object-cover, which took a
   * transparent cutout and cut the cup off at the ankles. Each one now sits
   * whole on a colour card of its own, taped on at an angle, which is what a
   * shop actually does with the pictures of its own food.
   */
  const tiles = [
    { src: "/menu/mangonada-tropical.webp", tilt: -3, field: "bg-sunset-400", tape: -4 },
    { src: "/menu/elote-chorreado.webp", tilt: 2.5, field: "bg-lime-400", tape: 5 },
    { src: "/menu/raspas-trio.webp", tilt: 2, field: "bg-ocean-300", tape: 3 },
    { src: "/menu/conchi-nieve.webp", tilt: -2.5, field: "bg-magenta-300", tape: -6 },
  ];

  // The opening paragraph, split at its first full stop.
  const opening = copy.about.body[0][locale];
  const breakAt = opening.indexOf(". ");
  const lead = breakAt === -1 ? opening : opening.slice(0, breakAt + 1);
  const tail = breakAt === -1 ? "" : opening.slice(breakAt + 2);

  return (
    <>
      <PageHeader
        es={copy.headings.about.es}
        en={copy.headings.about.en}
        single={copy.headings.about[locale]}
        body={site.tagline[locale]}
      />

      <div className="paper relative overflow-hidden bg-sand-50 pb-20 pt-16 sm:pb-28">
        <TornEdge className="absolute inset-x-0 top-0 h-10 -translate-y-full sm:h-14" fill="var(--color-sunset-500)" flip />

        <PropScatter
          items={[
            { name: "mango", x: 3, y: 9, size: 4.4, rotate: -14, motion: "drift", opacity: 0.4 },
            { name: "lime", x: 93, y: 17, size: 3.8, rotate: 18, motion: "bob", opacity: 0.4 },
            { name: "tamarindo", x: 2, y: 52, size: 3.4, rotate: 12, motion: "bob", opacity: 0.35 },
            { name: "strawberry", x: 94, y: 62, size: 3.6, rotate: -10, motion: "drift", opacity: 0.35 },
          ]}
        />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* The opening claim is the whole argument of the page, so it is set
              as a poster. Only the first sentence, though: nine lines of
              condensed capitals is a wall, and the rest of the paragraph reads
              perfectly well underneath it in body type. */}
          <Reveal>
            <blockquote
              className="lit halftone relative overflow-hidden rounded-[2rem] bg-chamoy-500 p-7 text-white/60 shadow-lift sm:p-10"
              style={{ ["--lit-strength" as string]: "0.2", ["--dot-opacity" as string]: "0.15" }}
            >
              <p className="display text-[clamp(1.9rem,4.6vw,3.1rem)] leading-[0.98] text-white [text-shadow:2px_3px_0_rgb(42_18_6/0.3)]">
                {lead}
              </p>
              {tail ? (
                <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-white/90">
                  {tail}
                </p>
              ) : null}
            </blockquote>
          </Reveal>

          {copy.about.body.slice(1).map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <p className="mt-6 font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
                {paragraph[locale]}
              </p>
            </Reveal>
          ))}

          <Reveal className="mt-12">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {tiles.map((tile) => (
                <div
                  key={tile.src}
                  className={`tape lit halftone relative aspect-square rounded-[1.75rem] text-white/60 shadow-card ${tile.field}`}
                  style={{
                    transform: `rotate(${tile.tilt}deg)`,
                    ["--tape-tilt" as string]: `${tile.tape}deg`,
                    ["--lit-strength" as string]: "0.24",
                    ["--dot-opacity" as string]: "0.15",
                  }}
                >
                  <Image
                    src={tile.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 45vw, 22rem"
                    className="scale-[0.84] object-contain drop-shadow-[0_14px_18px_rgb(42_18_6/0.35)]"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="display text-3xl text-ink sm:text-4xl">
              {copy.about.factsTitle[locale]}
            </h2>
            <dl className="paper-card mt-6 divide-y-2 divide-dashed divide-ink/20 px-6">
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
