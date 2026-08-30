"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Splash } from "@/components/Splash";
import { menu } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

/**
 * One real product per category, on its own paint splash.
 *
 * The sticker crops that used to sit here were small, soft and cut from the
 * same page scan; these are the full cutouts. The accent is what makes each
 * category its own thing, matching how the printed menu gives every section a
 * different colour. The English line stays one quiet sand for all five, so the
 * five accents read as a set rather than as a fight.
 */
const LOOK: Record<string, { art: string; w: number; h: number; accent: string; splash: string }> = {
  mangonadas: {
    art: "/menu/coctel-de-frutas.webp",
    w: 655,
    h: 500,
    accent: "var(--color-head-fruit)",
    splash: "var(--color-sunset-400)",
  },
  "nieves-de-garrafa": {
    art: "/menu/conchi-nieve.webp",
    w: 1106,
    h: 780,
    accent: "var(--color-mango-300)",
    splash: "var(--color-magenta-400)",
  },
  raspas: {
    art: "/menu/raspas-trio.webp",
    w: 812,
    h: 624,
    accent: "var(--color-magenta-300)",
    splash: "var(--color-ocean-300)",
  },
  antojitos: {
    art: "/menu/elote-chorreado.webp",
    w: 633,
    h: 582,
    accent: "var(--color-lime-400)",
    splash: "var(--color-mango-400)",
  },
  bebidas: {
    art: "/menu/float-fanta.webp",
    w: 390,
    h: 633,
    accent: "var(--color-ocean-200)",
    splash: "var(--color-lime-400)",
  },
};

/**
 * The section the mango surfs into. It is the deep water under the sunset, so
 * it carries no botanicals at all: the transition is the only event here.
 */
export function CategoryRow({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-ocean-800 py-20 sm:py-24" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">
        {locale === "en" ? "Menu categories" : "Categorías del menú"}
      </h2>

      <ul className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:gap-6 lg:px-8">
        {menu.map((category, index) => {
          const look = LOOK[category.slug];
          if (!look) return null;

          return (
            <motion.li
              key={category.slug}
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={path(locale, "menu", category.slug)}
                className="group flex flex-col items-center text-center"
              >
                <span className="relative block aspect-square w-full max-w-[12rem]">
                  <Splash
                    color={look.splash}
                    variant={index}
                    className="absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-pop)] group-hover:rotate-[8deg] group-hover:scale-105"
                  />
                  <Image
                    src={look.art}
                    alt=""
                    width={look.w}
                    height={look.h}
                    sizes="(max-width: 640px) 44vw, 12rem"
                    className="absolute inset-[8%] h-[84%] w-[84%] object-contain drop-shadow-[0_10px_14px_rgb(3_28_44/0.55)] transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-2 group-hover:scale-[1.06]"
                  />
                </span>

                <span
                  className="display mt-5 block text-[clamp(1.05rem,2.6vw,1.45rem)] leading-tight"
                  style={{ color: look.accent }}
                >
                  {category.shortName.es}
                </span>
                <span className="label-type mt-1 block text-sm text-sand-200/80 sm:text-base">
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
