import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { money } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

/**
 * Four house favourites, each on its own solid colour field.
 *
 * These used to run the same photograph twice, blurred up as a ground and
 * sharp on top. The blur was covering for a soft 300 DPI crop; with the real
 * cutouts there is nothing to cover for, so the ground is a flat field lifted
 * off the printed menu and the product is the only thing in the frame. Four
 * fields in a row is also what stops the page sitting on one continuous
 * orange.
 */
const PANELS = [
  {
    slug: "mangonada-tropical",
    category: "mangonadas",
    art: "/menu/mangonada-tropical.webp",
    w: 652,
    h: 1069,
    field: "bg-sunset-500",
    price: 8.5,
    name: { en: "Mangonada Tropical", es: "Mangonada Tropical" },
    note: { en: "Mango, chamoy, chile, tamarindo", es: "Mango, chamoy, chile, tamarindo" },
  },
  {
    slug: "raspa-tropical",
    category: "raspas",
    art: "/menu/raspa-tropical.webp",
    w: 587,
    h: 984,
    field: "bg-ocean-500",
    price: 8.5,
    name: { en: "Raspa Tropical", es: "Raspa Tropical" },
    note: { en: "Shaved ice, fresh fruit, chamoy", es: "Raspa, fruta fresca, chamoy" },
  },
  {
    slug: "elote-chorreado",
    category: "antojitos",
    art: "/menu/elote-chorreado.webp",
    w: 633,
    h: 582,
    field: "bg-lime-500",
    price: 9.5,
    name: { en: "Elote Chorreado", es: "Elote Chorreado" },
    note: { en: "Hot Cheetos, nacho cheese, crema", es: "Hot Cheetos, queso nacho, crema" },
  },
  {
    slug: "conchi-nieve",
    category: "nieves-de-garrafa",
    art: "/menu/conchi-nieve.webp",
    w: 1106,
    h: 780,
    field: "bg-magenta-500",
    price: 7.5,
    name: { en: "Conchi Nieve", es: "Conchi Nieve" },
    note: { en: "A concha stuffed with nieve", es: "Una concha rellena de nieve" },
  },
];

export function FeaturePanels({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="favorites-heading" className="relative">
      <h2 id="favorites-heading" className="sr-only">
        {copy.headings.favorites.en}
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {PANELS.map((panel) => (
          <li key={panel.slug}>
            <Link
              href={path(locale, "menu", panel.category)}
              className={`group relative flex h-[64svh] min-h-[26rem] flex-col overflow-hidden ${panel.field} lg:h-[74svh]`}
            >
              {/* The product owns the top of the panel and runs off its edges.
                  Nothing sits on top of it, so no scrim is needed to read the
                  type underneath. */}
              <div className="relative flex-1">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[22%] bottom-[6%] h-6 rounded-[50%] bg-ink/30 blur-xl"
                />
                <Image
                  src={panel.art}
                  alt={panel.name[locale]}
                  width={panel.w}
                  height={panel.h}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="absolute inset-x-[-4%] top-[4%] h-[96%] w-[108%] object-contain drop-shadow-[0_18px_24px_rgb(42_18_6/0.4)] transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
                />
              </div>

              <div className="relative p-7 sm:p-8">
                <p className="display text-[clamp(1.7rem,2.8vw,2.5rem)] leading-[0.95] text-white [text-shadow:2px_2px_0_rgb(42_18_6/0.35)]">
                  {panel.name[locale]}
                </p>
                <p className="mt-2 font-body text-sm leading-snug text-white/85">
                  {panel.note[locale]}
                </p>
                <p className="label-type mt-4 text-2xl text-mango-300">{money(panel.price)}</p>
                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex items-center gap-2 font-body text-[13px] font-bold uppercase tracking-widest text-white/75 transition-colors group-hover:text-white"
                >
                  {copy.menuSection.viewCategory[locale]}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
