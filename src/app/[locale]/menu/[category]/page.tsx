import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard } from "@/components/MenuCard";
import { Reveal } from "@/components/Reveal";
import { TornEdge } from "@/components/Dividers";
import { JsonLd } from "@/components/JsonLd";
import { MagneticButton } from "@/components/MagneticButton";
import { VisitSection } from "@/components/sections/VisitSection";
import { copy } from "@/lib/copy";
import type { HeadingTone } from "@/components/WoodSign";
import { findCategory, menu, money, TOPPING_PRICE, toppings } from "@/lib/menu";
import { isLocale, locales, path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/** Each category's menu accent mapped to the heading colour pair it uses. */
const CATEGORY_TONE: Record<string, HeadingTone> = {
  orange: "garrafa",
  yellow: "garrafa",
  magenta: "nieve",
  blue: "float",
  lime: "comida",
};

/** Splash colour behind the category's feature image. */
const CATEGORY_SPLASH: Record<string, string> = {
  orange: "var(--color-mango-400)",
  yellow: "var(--color-sunset-300)",
  magenta: "var(--color-magenta-300)",
  blue: "var(--color-ocean-300)",
  lime: "var(--color-lime-400)",
};

export function generateStaticParams() {
  return locales.flatMap((locale) => menu.map((category) => ({ locale, category: category.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: raw, category: slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const category = findCategory(slug);
  if (!category) return {};

  const url = path(locale, "menu", category.slug);
  return {
    title: category.metaTitle[locale],
    description: category.metaDescription[locale],
    alternates: {
      canonical: url,
      languages: {
        "en-US": path("en", "menu", category.slug),
        "es-US": path("es", "menu", category.slug),
        "x-default": path("en", "menu", category.slug),
      },
    },
    openGraph: {
      url: site.url + url,
      title: category.metaTitle[locale],
      description: category.metaDescription[locale],
      images: [{ url: category.image, alt: category.name[locale] }],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: raw, category: slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const category = findCategory(slug);
  if (!category) notFound();

  const others = menu.filter((c) => c.slug !== category.slug);

  const menuSectionSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: category.name[locale],
    description: category.intro[locale],
    inLanguage: locale === "en" ? "en-US" : "es-US",
    url: site.url + path(locale, "menu", category.slug),
    hasMenuSection: category.sections.map((section) => ({
      "@type": "MenuSection",
      name: section.title[locale],
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name[locale],
        description: item.description[locale],
        image: item.image ? site.url + item.image : undefined,
        offers: item.prices.map((price) => ({
          "@type": "Offer",
          price: price.amount.toFixed(2),
          priceCurrency: "USD",
          name: price.label[locale],
          availability: "https://schema.org/InStock",
          seller: { "@id": `${site.url}/#business` },
        })),
      })),
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: site.url + path(locale, "home") },
      { "@type": "ListItem", position: 2, name: copy.nav.menu[locale], item: site.url + path(locale, "menu") },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name[locale],
        item: site.url + path(locale, "menu", category.slug),
      },
    ],
  };

  return (
    <>
      <PageHeader
        es={category.shortName.es}
        en={category.shortName.en}
        tone={CATEGORY_TONE[category.accent]}
        body={category.intro[locale]}
        feature={category.feature}
        featureAlt={category.name[locale]}
        splash={CATEGORY_SPLASH[category.accent]}
      >
        <nav aria-label="Breadcrumb" className="mt-6 order-first">
          <ol className="flex items-center gap-2 font-body text-sm font-bold text-sand-50/90">
            <li>
              <Link href={path(locale, "home")} className="underline underline-offset-4 hover:text-mango-300">
                {site.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={path(locale, "menu")} className="underline underline-offset-4 hover:text-mango-300">
                {copy.nav.menu[locale]}
              </Link>
            </li>
          </ol>
        </nav>
      </PageHeader>

      <div className="relative bg-sand-50 pb-20 pt-16 sm:pb-28">
        <TornEdge className="absolute inset-x-0 top-0 h-10 -translate-y-full sm:h-14" fill="var(--color-sunset-500)" flip />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {category.sections.map((section) => (
            <section key={section.slug} className="pb-14 last:pb-0">
              {category.sections.length > 1 ? (
                <Reveal>
                  <h2 className="display pb-3 text-[clamp(1.75rem,5vw,3rem)] text-ink">
                    {section.title[locale]}
                  </h2>
                </Reveal>
              ) : null}

              {section.flavors ? (
                <Reveal className="mt-6">
                  <div className="rounded-3xl border-[3px] border-dashed border-ink/40 bg-mango-200/60 p-5">
                    <p className="font-body text-sm font-extrabold uppercase tracking-wide text-ink-soft">
                      {copy.menuSection.flavorsTitle[locale]}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {section.flavors.map((flavor) => (
                        <li
                          key={flavor.en}
                          className="rounded-full bg-sand-50 px-3 py-1 font-body text-sm font-bold text-ink"
                        >
                          {flavor[locale]}
                        </li>
                      ))}
                    </ul>
                    {section.note ? (
                      <p className="mt-3 font-body text-sm italic text-ink-soft">{section.note[locale]}</p>
                    ) : null}
                  </div>
                </Reveal>
              ) : null}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {section.items.map((item, index) => (
                  <Reveal key={item.slug} delay={index * 0.04}>
                    <ItemCard item={item} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}

          <Reveal>
            <div className="rounded-3xl bg-mango-400 p-6 shadow-card sm:p-8">
              <h2 className="display text-3xl text-ink sm:text-4xl">
                {copy.menuSection.toppingsTitle[locale]}
              </h2>
              <p className="mt-1 font-body text-base font-bold text-ink-soft">
                {copy.menuSection.toppingsNote[locale]} {money(TOPPING_PRICE)}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {toppings.map((topping) => (
                  <li
                    key={topping.en}
                    className="rounded-full bg-sand-50 px-3.5 py-1.5 font-body text-sm font-bold text-ink"
                  >
                    {topping[locale]}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <p className="mt-8 text-center font-body text-sm italic text-ink-soft">
            {copy.menuSection.priceNote[locale]}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton href={mapsUrl} variant="solid" external>
              {copy.visit.directions[locale]}
            </MagneticButton>
            <MagneticButton href={site.phoneHref} variant="cream">
              {copy.visit.callUs[locale]}
            </MagneticButton>
          </div>

          <Reveal className="mt-16">
            <h2 className="display text-center text-3xl text-ink sm:text-4xl">
              {copy.menuSection.kicker[locale]}
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={path(locale, "menu", other.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-transform hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={other.image}
                        alt={other.name[locale]}
                        fill
                        sizes="(max-width: 640px) 92vw, 22vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="label-type p-4 text-lg text-ink">{other.name[locale]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <VisitSection locale={locale} />
      <JsonLd data={[menuSectionSchema, breadcrumbs]} />
    </>
  );
}
