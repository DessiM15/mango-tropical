"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Splash } from "@/components/Splash";
import { Flora } from "@/components/Flora";
import { menu } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

/** Sticker and splash colour for each category, taken from the menu's palette. */
const LOOK: Record<string, { sticker: string; splash: string }> = {
  mangonadas: { sticker: "/menu/sticker-mangonada.webp", splash: "var(--color-sunset-400)" },
  "nieves-de-garrafa": { sticker: "/menu/sticker-nieve.webp", splash: "var(--color-magenta-300)" },
  raspas: { sticker: "/menu/sticker-raspa.webp", splash: "var(--color-ocean-300)" },
  antojitos: { sticker: "/menu/sticker-chorreado.webp", splash: "var(--color-mango-400)" },
  bebidas: { sticker: "/menu/sticker-float.webp", splash: "var(--color-lime-400)" },
};

/**
 * The row directly under the hero: one splash-backed sticker per category with
 * the Spanish name over the English, the way the printed menu titles every
 * section.
 */
export function CategoryRow({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-sand-100 py-16 sm:py-24"
      aria-labelledby="categories-heading"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "url(/scene/wet-sand-tile.webp)", backgroundSize: "cover" }}
      />
      {/* Wet sand where the water above meets the beach. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,var(--color-ocean-400),transparent)] opacity-45"
      />
      <Flora name="palms" className="left-[-7%] top-[-8%] w-40 opacity-70 sm:w-56" flip />
      <Flora name="flowers" className="bottom-[-12%] right-[-5%] w-36 opacity-70 sm:w-52" />

      <h2 id="categories-heading" className="sr-only">
        {locale === "en" ? "Menu categories" : "Categorías del menú"}
      </h2>

      <ul className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-9 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:gap-6 lg:px-8">
        {menu.map((category, index) => {
          const look = LOOK[category.slug];
          if (!look) return null;

          return (
            <motion.li
              key={category.slug}
              initial={reduced ? false : { opacity: 0, y: 26, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Link
                href={path(locale, "menu", category.slug)}
                className="group flex flex-col items-center text-center"
              >
                <span className="relative block aspect-square w-full max-w-[11rem]">
                  <Splash
                    color={look.splash}
                    variant={index}
                    className="absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-pop)] group-hover:rotate-[10deg] group-hover:scale-110"
                  />
                  <Image
                    src={look.sticker}
                    alt=""
                    width={520}
                    height={520}
                    sizes="(max-width: 640px) 42vw, 11rem"
                    className="absolute inset-[11%] h-[78%] w-[78%] rounded-full object-cover shadow-card transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-1.5 group-hover:scale-105"
                  />
                </span>

                <span className="display mt-4 block text-[clamp(0.95rem,2.4vw,1.25rem)] leading-tight text-ink">
                  {category.shortName.es}
                </span>
                <span className="label-type mt-0.5 block text-sm text-ocean-500 sm:text-base">
                  {category.shortName.en}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
