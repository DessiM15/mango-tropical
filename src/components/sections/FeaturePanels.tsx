import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { money } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

/**
 * Four house favourites as full-bleed panels, edge to edge, with no card and no
 * container around them.
 *
 * The product photography comes off a 300 DPI scan of a printed page, so it
 * cannot fill a tall panel sharply. Each panel therefore runs the same shot
 * twice: scaled up and thrown out of focus as the ground, and sharp as a cutout
 * on top. The blur is doing real work rather than hiding a mistake, and the
 * detail all sits in the cutout where the eye goes.
 */
const PANELS = [
  {
    slug: "mangonada-tropical",
    category: "mangonadas",
    cutout: "/menu/cut-mangonada.webp",
    ground: "/menu/mangonada-tropical.webp",
    price: 8.5,
    tint: "from-sunset-600/85",
    name: { en: "Mangonada Tropical", es: "Mangonada Tropical" },
    note: { en: "Mango, chamoy, chile, tamarindo", es: "Mango, chamoy, chile, tamarindo" },
  },
  {
    slug: "raspa-tropical",
    category: "raspas",
    cutout: "/menu/cut-raspa.webp",
    ground: "/menu/raspa-tropical.webp",
    price: 8.5,
    tint: "from-ocean-700/85",
    name: { en: "Raspa Tropical", es: "Raspa Tropical" },
    note: { en: "Shaved ice, fresh fruit, chamoy", es: "Raspa, fruta fresca, chamoy" },
  },
  {
    slug: "elote-chorreado",
    category: "antojitos",
    cutout: "/menu/cut-chorreado.webp",
    ground: "/menu/elote-chorreado.webp",
    price: 9.5,
    tint: "from-lime-600/85",
    name: { en: "Elote Chorreado", es: "Elote Chorreado" },
    note: { en: "Hot Cheetos, nacho cheese, crema", es: "Hot Cheetos, queso nacho, crema" },
  },
  {
    slug: "conchi-nieve",
    category: "nieves-de-garrafa",
    cutout: "/menu/cut-conchi.webp",
    ground: "/menu/conchi-nieve.webp",
    price: 7.5,
    tint: "from-magenta-500/85",
    name: { en: "Conchi Nieve", es: "Conchi Nieve" },
    note: { en: "A concha stuffed with nieve", es: "Una concha rellena de nieve" },
  },
];

export function FeaturePanels({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="favorites-heading" className="relative bg-ink">
      <h2 id="favorites-heading" className="sr-only">
        {copy.headings.favorites.en}
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {PANELS.map((panel) => (
          <li key={panel.slug}>
            <Link
              href={path(locale, "menu", panel.category)}
              className="group relative flex h-[62svh] min-h-[26rem] items-end overflow-hidden lg:h-[78svh]"
            >
              <Image
                src={panel.ground}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="scale-125 object-cover blur-[18px] saturate-150 transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.35]"
              />
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-t ${panel.tint} via-ink/45 to-ink/25`}
              />

              <Image
                src={panel.cutout}
                alt={panel.name[locale]}
                width={900}
                height={640}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                className="absolute inset-x-[6%] top-[12%] h-auto w-[88%] object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.55)] transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
              />

              <div className="relative w-full p-7 sm:p-8">
                <p className="display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[0.95] text-white">
                  {panel.name[locale]}
                </p>
                <p className="mt-2 font-body text-sm leading-snug text-white/80">
                  {panel.note[locale]}
                </p>
                <p className="label-type mt-4 text-2xl text-mango-300">{money(panel.price)}</p>
                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex items-center gap-2 font-body text-[13px] font-bold uppercase tracking-widest text-white/70 transition-colors group-hover:text-white"
                >
                  {copy.menuSection.viewCategory[locale]}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>

              {/* A hairline between panels, the way the reference rows separate them. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 right-0 hidden w-px bg-white/15 lg:block"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
