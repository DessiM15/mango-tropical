import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard } from "@/components/MenuCard";
import { MenuGround } from "@/components/MenuGround";
import { BrushBanner } from "@/components/BrushBanner";
import { WoodSign, type HeadingTone } from "@/components/WoodSign";
import { Reveal } from "@/components/Reveal";
import { Sticker } from "@/components/Sticker";
import { JsonLd } from "@/components/JsonLd";
import { MagneticButton } from "@/components/MagneticButton";
import { copy } from "@/lib/copy";
import { menu, money, TOPPING_PRICE, toppings } from "@/lib/menu";
import { alternateHref, isLocale, locales, path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/**
 * Each category is a page of the printed menu.
 *
 * It used to be a full-bleed colour band with a list under it. The menu does
 * not work that way: every section is one sheet of palm-printed paper with a
 * wooden sign at the top, the products standing straight on it, and the
 * painted ocean washing across the foot of the page before the next one
 * begins. Five of those in a column is the menu, scrolled.
 *
 * The name colours and the swash behind each flavour list are the ones the
 * printed pages use for that section.
 */
const PAGES: Record<string, { tone: HeadingTone; swash: string }> = {
  mangonadas: { tone: "fruit", swash: "var(--color-chamoy-500)" },
  "nieves-de-garrafa": { tone: "nieve", swash: "var(--color-magenta-500)" },
  raspas: { tone: "float", swash: "var(--color-ocean-600)" },
  antojitos: { tone: "comida", swash: "var(--color-lime-600)" },
  bebidas: { tone: "garrafa", swash: "var(--color-sunset-600)" },
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

      <>
        {menu.map((category, page) => {
          const look = PAGES[category.slug];
          const last = page === menu.length - 1;

          return (
            <MenuGround
              key={category.slug}
              id={category.slug}
              corners={page % 2 === 0 ? ["tl", "br"] : ["tr", "bl"]}
              surf={!last}
              className={`scroll-mt-24 pt-14 sm:pt-16 ${last ? "pb-16" : "pb-40 sm:pb-52"}`}
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                  <WoodSign
                    as="h2"
                    primary={category.shortName.es}
                    secondary={category.shortName.en}
                    tone={look.tone}
                    size="md"
                    tilt={page % 2 === 0 ? -1.2 : 1}
                  />
                  <p className="mt-5 max-w-2xl font-body text-base font-bold text-ink/85 [text-shadow:0_1px_0_rgb(255_255_255/0.5)] sm:text-lg">
                    {category.kicker[locale]}
                  </p>
                  <Link
                    href={path(locale, "menu", category.slug)}
                    className="mt-5 rounded-full bg-white/90 px-5 py-2.5 font-body text-[13px] font-extrabold uppercase tracking-widest text-ink shadow-card transition-transform hover:-translate-y-0.5"
                  >
                    {copy.menuSection.viewCategory[locale]}
                  </Link>
                </div>

                {category.sections.map((section) => (
                  <div key={section.slug} className="mt-14">
                    {category.sections.length > 1 ? (
                      <h3 className="display mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] text-ink [text-shadow:0_2px_0_rgb(255_255_255/0.55)]">
                        {section.title[locale]}
                      </h3>
                    ) : null}

                    {section.flavors ? (
                      <Reveal className="mb-12">
                        <BrushBanner color={look.swash}>
                          <h4 className="display text-center text-[clamp(1.1rem,2.4vw,1.6rem)] text-mango-300">
                            {copy.menuSection.flavorsTitle[locale]}
                          </h4>
                          <ul className="mt-4 grid gap-x-8 text-center sm:grid-cols-2 lg:grid-cols-3">
                            {section.flavors.map((flavor) => (
                              <li
                                key={flavor.en}
                                className="display py-1 text-[clamp(0.95rem,1.9vw,1.2rem)] text-white"
                              >
                                {flavor[locale]}
                              </li>
                            ))}
                          </ul>
                          {section.note ? (
                            <p className="mt-4 text-center font-body text-sm font-bold italic text-white/85">
                              {section.note[locale]}
                            </p>
                          ) : null}
                        </BrushBanner>
                      </Reveal>
                    ) : null}

                    {/* One board, every item on it. The three the shop is
                        known for simply take more of the page, which is what
                        the printed menu does with them. */}
                    <div className="grid grid-cols-2 items-start gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
                      {section.items.map((item, index) => {
                        const hero = SIGNATURES.has(item.slug);
                        return (
                          <Reveal
                            key={item.slug}
                            delay={index * 0.04}
                            className={hero ? "col-span-2 sm:col-span-3" : ""}
                          >
                            <ItemCard
                              item={item}
                              locale={locale}
                              accent={category.accent}
                              index={index}
                              feature={hero}
                            />
                          </Reveal>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </MenuGround>
          );
        })}
      </>

      <div className="paper relative overflow-hidden bg-sand-50 pb-20 pt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div
              className="lit halftone relative mt-6 overflow-hidden rounded-3xl bg-mango-400 p-6 text-sunset-600/60 shadow-card sm:p-8"
              style={{ ["--lit-strength" as string]: "0.3", ["--dot-opacity" as string]: "0.16" }}
            >
              <h2 className="display text-3xl text-ink sm:text-4xl">
                {copy.menuSection.toppingsTitle[locale]}
              </h2>
              <p className="mt-1 font-body text-base font-bold text-ink-soft">
                {copy.menuSection.toppingsNote[locale]}{" "}
                <Sticker tone="chamoy" tilt={-7} className="ml-1 align-middle text-base">
                  {money(TOPPING_PRICE)}
                </Sticker>
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
