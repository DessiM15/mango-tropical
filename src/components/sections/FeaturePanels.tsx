import Image from "next/image";
import Link from "next/link";
import { MenuGround } from "@/components/MenuGround";
import { Plaque, PrintedPrice } from "@/components/Plaque";
import { BurstBadge } from "@/components/Sticker";
import { Reveal } from "@/components/Reveal";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import type { MenuCategory } from "@/lib/menu";

/**
 * Four house favourites, laid out the way the printed menu lays out a page.
 *
 * These were four full-bleed panels of flat colour with a product on each.
 * That is a website's idea of a menu; the menu's own idea is one sheet of
 * palm-printed paper with the products standing on it at whatever size suits
 * them, each named on a small wooden plaque with the price underneath. So the
 * colour fields are gone and the paper is doing the work.
 *
 * The sizes and drops are deliberately uneven. Four products at one size on
 * one baseline is a grid, and a grid is the thing the printed menu never does.
 */
const PANELS: {
  slug: string;
  category: string;
  accent: MenuCategory["accent"];
  art: string;
  scale: number;
  drop: number;
  tilt: number;
  price: number;
  size: { en: string; es: string };
  name: { en: string; es: string };
  note: { en: string; es: string };
  flash?: { en: string[]; es: string[] };
}[] = [
  {
    slug: "mangonada-tropical",
    category: "mangonadas",
    accent: "orange",
    art: "/menu/mangonada-tropical.webp",
    scale: 1.18,
    drop: 0,
    tilt: -1.6,
    price: 8.5,
    size: { en: "16 OZ", es: "16 OZ" },
    name: { en: "Mangonada Tropical", es: "Mangonada Tropical" },
    note: { en: "Mango, chamoy, chile, tamarindo", es: "Mango, chamoy, chile, tamarindo" },
    flash: { en: ["THE", "ONE"], es: ["LA", "DE", "SIEMPRE"] },
  },
  {
    slug: "raspa-tropical",
    category: "raspas",
    accent: "blue",
    art: "/menu/raspa-tropical.webp",
    scale: 0.92,
    drop: 2.6,
    tilt: 1.4,
    price: 8.5,
    size: { en: "16 OZ", es: "16 OZ" },
    name: { en: "Raspa Tropical", es: "Raspa Tropical" },
    note: { en: "Shaved ice, fresh fruit, chamoy", es: "Raspa, fruta fresca, chamoy" },
  },
  {
    slug: "elote-chorreado",
    category: "antojitos",
    accent: "lime",
    art: "/menu/elote-chorreado.webp",
    scale: 1.06,
    drop: 1.1,
    tilt: -1,
    price: 9.5,
    size: { en: "EACH", es: "CADA UNO" },
    name: { en: "Elote Chorreado", es: "Elote Chorreado" },
    note: { en: "Hot Cheetos, nacho cheese, crema", es: "Hot Cheetos, queso nacho, crema" },
  },
  {
    slug: "conchi-nieve",
    category: "nieves-de-garrafa",
    accent: "magenta",
    art: "/menu/conchi-nieve.webp",
    scale: 1,
    drop: 3.2,
    tilt: 1.8,
    price: 7.5,
    size: { en: "EACH", es: "CADA UNO" },
    name: { en: "Conchi Nieve", es: "Conchi Nieve" },
    note: { en: "A concha stuffed with nieve", es: "Una concha rellena de nieve" },
  },
];

export function FeaturePanels({ locale }: { locale: Locale }) {
  return (
    <MenuGround
      labelledBy="favorites-heading"
      corners={["tr", "bl"]}
      surf
      className="pb-40 pt-16 sm:pb-52 sm:pt-20"
    >
      <h2 id="favorites-heading" className="sr-only">
        {copy.headings.favorites[locale === "en" ? "en" : "es"]}
      </h2>

      <ul className="mx-auto grid max-w-6xl grid-cols-2 items-start gap-x-4 gap-y-12 px-4 sm:px-6 lg:grid-cols-4 lg:gap-x-8 lg:px-8">
        {PANELS.map((panel, index) => (
          <li key={panel.slug} style={{ marginTop: `${panel.drop}rem` }}>
            <Reveal delay={index * 0.06}>
              <Link
                href={path(locale, "menu", panel.category)}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-full" style={{ height: `${13 * panel.scale}rem` }}>
                  {panel.flash ? (
                    <BurstBadge
                      lines={panel.flash[locale]}
                      className="absolute -right-1 -top-3 z-10 h-20 w-20 text-[13px] sm:h-24 sm:w-24 sm:text-[16px]"
                      fill="var(--color-chamoy-500)"
                      ring="var(--color-mango-400)"
                    />
                  ) : null}
                  <Image
                    src={panel.art}
                    alt={panel.name[locale]}
                    fill
                    sizes="(max-width: 640px) 46vw, 22vw"
                    className="object-contain drop-shadow-[0_16px_18px_rgb(42_18_6/0.38)] transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:-translate-y-2 group-hover:scale-[1.05]"
                  />
                </div>

                <Plaque accent={panel.accent} tilt={panel.tilt} className="-mt-3">
                  {panel.name[locale]}
                </Plaque>

                <PrintedPrice
                  prices={[{ label: panel.size, amount: panel.price }]}
                  locale={locale}
                  className="mt-2.5 text-[clamp(1rem,1.7vw,1.35rem)]"
                />

                <p className="mt-2 max-w-[18rem] font-body text-[14px] font-semibold leading-snug text-ink/85 [text-shadow:0_1px_0_rgb(255_255_255/0.45)]">
                  {panel.note[locale]}
                </p>

                <span
                  aria-hidden="true"
                  className="mt-3 inline-flex items-center gap-2 font-body text-[12px] font-extrabold uppercase tracking-widest text-chamoy-600 transition-colors group-hover:text-chamoy-500"
                >
                  {copy.menuSection.viewCategory[locale]}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </MenuGround>
  );
}
