import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { FeatureItem, ItemCard, NameList } from "@/components/MenuCard";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { MagneticButton } from "@/components/MagneticButton";
import { copy } from "@/lib/copy";
import { menu, money, TOPPING_PRICE, toppings } from "@/lib/menu";
import { alternateHref, isLocale, locales, path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/**
 * Each category opens on a full-bleed colour band carrying its two-language
 * name, the way every page of the printed menu opens on a headline block. The
 * five bands are the only place on the site that still pairs the languages,
 * which is exactly what the printed menu does.
 */
const BANDS: Record<string, { field: string; feature: string }> = {
  mangonadas: { field: "bg-sunset-500", feature: "bg-chamoy-500" },
  "nieves-de-garrafa": { field: "bg-magenta-500", feature: "bg-magenta-600" },
  raspas: { field: "bg-ocean-600", feature: "bg-ocean-700" },
  antojitos: { field: "bg-lime-500", feature: "bg-lime-600" },
  bebidas: { field: "bg-chamoy-500", feature: "bg-chamoy-600" },
};

/** The three the shop is known for. Everything else is a list row. */
const SIGNATURES = new Set(["mangonada-tropical", "elote-chorreado", "conchi-nieve"]);

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
  const url = path(locale, "menu");
  return {
    title: copy.menuPage.metaTitle[locale],
    description: copy.menuPage.metaDescription[locale],
    alternates: {
      canonical: url,
      languages: {
        "en-US": path("en", "menu"),
        "es-US": path("es", "menu"),
        "x-default": path("en", "menu"),
      },
    },
    openGraph: { url: site.url + url, title: copy.menuPage.metaTitle[locale] },
  };
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${site.name} Menu`,
    inLanguage: locale === "en" ? "en-US" : "es-US",
    url: site.url + path(locale, "menu"),
    hasMenuSection: menu.map((category) => ({
      "@type": "MenuSection",
      name: category.name[locale],
      description: category.intro[locale],
      hasMenuItem: category.sections.flatMap((section) =>
        section.items.map((item) => ({
          "@type": "MenuItem",
          name: item.name[locale],
          description: item.description[locale],
          offers: item.prices.map((price) => ({
            "@type": "Offer",
            price: price.amount.toFixed(2),
            priceCurrency: "USD",
            name: price.label[locale],
          })),
        })),
      ),
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: site.url + path(locale, "home") },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.nav.menu[locale],
        item: site.url + path(locale, "menu"),
      },
    ],
  };

  return (
    <>
      <PageHeader
        es={copy.headings.menu.es}
        en={copy.headings.menu.en}
        single={copy.headings.menu[locale]}
        body={copy.menuSection.body[locale]}
      >
        <nav aria-label={copy.nav.menu[locale]} className="mt-8 flex flex-wrap justify-center gap-2.5">
          {menu.map((category) => (
            <Link
              key={category.slug}
              href={`#${category.slug}`}
              className="rounded-full bg-sand-50 px-4 py-2 font-label text-sm font-extrabold not-italic uppercase tracking-wide text-ink shadow-card transition-transform hover:-translate-y-0.5 sm:text-base"
            >
              {category.name[locale]}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className="relative bg-sand-50 pb-20">
        {menu.map((category) => {
          const band = BANDS[category.slug];
          return (
            <section key={category.slug} id={category.slug} className="scroll-mt-24">
              {/* Full-bleed headline block, not a small heading above a list. */}
              <div className={`${band.field} px-4 py-14 sm:px-6 sm:py-16 lg:px-8`}>
                <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="display text-outline text-[clamp(2.1rem,5.5vw,3.6rem)] leading-[0.95] text-mango-300">
                      {category.shortName.es}
                    </h2>
                    <p className="label-type mt-2 text-xl text-white sm:text-2xl">
                      {category.shortName.en}
                    </p>
                    <p className="mt-3 max-w-xl font-body text-base text-white/85">
                      {category.kicker[locale]}
                    </p>
                  </div>
                  <Link
                    href={path(locale, "menu", category.slug)}
                    className="shrink-0 rounded-full bg-white px-5 py-2.5 font-body text-[13px] font-extrabold uppercase tracking-widest text-ink shadow-card transition-transform hover:-translate-y-0.5"
                  >
                    {copy.menuSection.viewCategory[locale]}
                  </Link>
                </div>
              </div>

              <div className="mx-auto max-w-5xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
                {category.sections.map((section) => {
                  const signatures = section.items.filter((item) => SIGNATURES.has(item.slug));
                  const rest = section.items.filter((item) => !SIGNATURES.has(item.slug));

                  return (
                    <div key={section.slug} className="mt-8 first:mt-0">
                      {category.sections.length > 1 ? (
                        <h3 className="label-type mb-4 text-2xl text-ink-soft">
                          {section.title[locale]}
                        </h3>
                      ) : null}

                      {signatures.map((item, index) => (
                        <Reveal key={item.slug} className="mb-10">
                          <FeatureItem
                            item={item}
                            locale={locale}
                            field={band.feature}
                            flip={index % 2 === 1}
                          />
                        </Reveal>
                      ))}

                      {section.flavors ? (
                        <Reveal className="mb-2">
                          <NameList
                            title={copy.menuSection.flavorsTitle[locale]}
                            names={section.flavors.map((flavor) => flavor[locale])}
                            note={section.note?.[locale]}
                          />
                        </Reveal>
                      ) : null}

                      <div className={`grid gap-x-12 ${rest.length > 2 ? "sm:grid-cols-2" : ""} divide-y divide-ink/12`}>
                        {rest.map((item, index) => (
                          <Reveal key={item.slug} delay={index * 0.04}>
                            <ItemCard item={item} locale={locale} />
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mt-6 rounded-3xl bg-mango-400 p-6 shadow-card sm:p-8">
              <h2 className="display text-3xl text-ink sm:text-4xl">
                {copy.menuSection.toppingsTitle[locale]}
              </h2>
              <p className="mt-1 font-body text-base font-bold text-ink-soft">
                {copy.menuSection.toppingsNote[locale]} {money(TOPPING_PRICE)}
              </p>
              <ul className="mt-5 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {toppings.map((topping) => (
                  <li
                    key={topping.en}
                    className="label-type border-b border-ink/20 py-2.5 text-lg text-ink"
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
        </div>
      </div>

      <JsonLd data={[menuSchema, breadcrumbs]} />
      <link rel="alternate" hrefLang={locale === "en" ? "es" : "en"} href={alternateHref(path(locale, "menu"), locale)} />
    </>
  );
}
