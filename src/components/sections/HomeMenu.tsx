import Link from "next/link";
import { ItemCard } from "@/components/MenuCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MagneticButton } from "@/components/MagneticButton";
import { copy } from "@/lib/copy";
import { menu, money, TOPPING_PRICE, toppings } from "@/lib/menu";
import { mapsUrl } from "@/lib/site";
import { path, type Locale } from "@/lib/i18n";

/**
 * The whole menu, on the home page. Used by the menu-first direction, where the
 * argument is that people arrive wanting the food and the prices rather than a
 * photograph of a beach.
 */
export function HomeMenu({ locale }: { locale: Locale }) {
  return (
    <section id="menu" className="scroll-mt-24 bg-[var(--band-warm)] py-16 sm:py-20" aria-labelledby="home-menu-heading">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.menu.es}
          en={copy.headings.menu.en}
          titleId="home-menu-heading"
          tone="fruit"
          body={copy.menuSection.body[locale]}
        />

        {menu.map((category) => (
          <section key={category.slug} className="mt-14 first:mt-12">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink/15 pb-3">
                <h3 className="display text-[clamp(1.5rem,4vw,2.5rem)] text-ink">
                  {category.shortName[locale]}
                </h3>
                <Link
                  href={path(locale, "menu", category.slug)}
                  className="font-body text-sm font-bold text-chamoy-500 underline underline-offset-4 hover:text-chamoy-600"
                >
                  {copy.menuSection.viewCategory[locale]}
                </Link>
              </div>
            </Reveal>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {category.sections.flatMap((section) =>
                section.items.map((item, index) => (
                  <Reveal key={item.slug} delay={index * 0.03}>
                    <ItemCard item={item} locale={locale} />
                  </Reveal>
                )),
              )}
            </div>
          </section>
        ))}

        <Reveal className="mt-14">
          <div className="rounded-2xl bg-mango-400 p-6 shadow-card sm:p-8">
            <h3 className="display text-2xl text-ink sm:text-3xl">
              {copy.menuSection.toppingsTitle[locale]}
            </h3>
            <p className="mt-1 font-body text-base font-bold text-ink-soft">
              {copy.menuSection.toppingsNote[locale]} {money(TOPPING_PRICE)}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {toppings.map((topping) => (
                <li
                  key={topping.en}
                  className="rounded-full bg-white px-3.5 py-1.5 font-body text-sm font-bold text-ink"
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

        <div className="mt-8 flex justify-center">
          <MagneticButton href={mapsUrl} variant="solid" external>
            {copy.visit.directions[locale]}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
