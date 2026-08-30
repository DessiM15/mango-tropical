import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard, NameList } from "@/components/MenuCard";
import { Reveal } from "@/components/Reveal";
import { TornEdge } from "@/components/Dividers";
import { JsonLd } from "@/components/JsonLd";
import { MagneticButton } from "@/components/MagneticButton";
import { copy } from "@/lib/copy";
import { menu, money, TOPPING_PRICE, toppings } from "@/lib/menu";
import { alternateHref, isLocale, locales, path, type Locale } from "@/lib/i18n";
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
        tone="fruit"
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

      <div className="relative bg-sand-50 pb-20 pt-16 sm:pb-28">
        <TornEdge className="absolute inset-x-0 top-0 h-10 -translate-y-full sm:h-14" fill="var(--color-sunset-500)" flip />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {menu.map((category) => (
            <section key={category.slug} id={category.slug} className="scroll-mt-28 pb-16 last:pb-0">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
                  <div>
                    <h2 className="display text-[clamp(2rem,5.5vw,3.5rem)] text-ink">
                      {category.name[locale]}
                    </h2>
                    <p className="label-type mt-1 text-lg text-chamoy-500">
                      {category.kicker[locale]}
                    </p>
                  </div>
                  <Link
                    href={path(locale, "menu", category.slug)}
                    className="label-type rounded-full bg-ink px-4 py-2 text-sm text-mango-300 transition-colors hover:bg-chamoy-400 hover:text-white"
                  >
                    {copy.menuSection.viewCategory[locale]}
                  </Link>
                </div>
              </Reveal>

              {category.sections.map((section) => (
                <div key={section.slug} className="mt-8">
                  {category.sections.length > 1 ? (
                    <h3 className="label-type mb-4 text-2xl text-ink-soft">{section.title[locale]}</h3>
                  ) : null}

                  {section.flavors ? (
                    <Reveal className="mb-2">
                      <NameList
                        title={copy.menuSection.flavorsTitle[locale]}
                        names={section.flavors.map((flavor) => flavor[locale])}
                        note={section.note?.[locale]}
                      />
                    </Reveal>
                  ) : null}

                  <div className={`grid gap-x-12 ${section.items.length > 2 ? "sm:grid-cols-2" : ""} divide-y divide-ink/12`}>
                    {section.items.map((item, index) => (
                      <Reveal key={item.slug} delay={index * 0.04}>
                        <ItemCard item={item} locale={locale} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}

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
