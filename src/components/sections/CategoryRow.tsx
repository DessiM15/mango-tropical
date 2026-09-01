"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Splash } from "@/components/Splash";
import { PropScatter } from "@/components/Confetti";
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
    w: 1200,
    h: 826,
    accent: "var(--color-head-fruit)",
    splash: "var(--color-sunset-400)",
  },
  "nieves-de-garrafa": {
    art: "/menu/conchi-nieve.webp",
    w: 1200,
    h: 887,
    accent: "var(--color-mango-300)",
    splash: "var(--color-magenta-400)",
  },
  raspas: {
    art: "/menu/raspas-trio.webp",
    w: 1429,
    h: 1356,
    accent: "var(--color-magenta-300)",
    splash: "var(--color-ocean-300)",
  },
  antojitos: {
    art: "/menu/elote-chorreado.webp",
    w: 1200,
    h: 748,
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

/** Ice and fruit drifting in the deep water, well outside the five tiles. */
const DRIFT = [
  { name: "mango", x: 3, y: 16, size: 3.6, rotate: -14, motion: "bob", opacity: 0.9 },
  { name: "star", x: 94, y: 20, size: 2.8, rotate: 12, motion: "spin", opacity: 0.8 },
  { name: "lime", x: 6, y: 74, size: 3.2, rotate: 20, motion: "drift", opacity: 0.85 },
  { name: "strawberry", x: 92, y: 70, size: 3.2, rotate: 8, motion: "bob", opacity: 0.85 },
  { name: "chile", x: 49, y: 91, size: 2.6, rotate: -8, motion: "drift", opacity: 0.7 },
] as const;

/**
 * The section the mango surfs into: the deep water under the sunset.
 *
 * The ground is lit from above and screened with a dot pattern, because a flat
 * navy across the full width of a browser is the single flattest thing this
 * page can do. The tiles themselves are unchanged - splash, product, two lines
 * - since that part was already working.
 */
export function CategoryRow({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();

  return (
    <section
      className="lit halftone relative overflow-hidden bg-ocean-800 py-20 text-ocean-200 sm:py-24"
      aria-labelledby="categories-heading"
      style={{ ["--lit-strength" as string]: "0.13", ["--dot-opacity" as string]: "0.16" }}
    >
      <PropScatter items={DRIFT.map((item) => ({ ...item }))} />

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
                  className="display mt-5 block text-[clamp(1.05rem,2.6vw,1.45rem)] leading-tight [text-shadow:0_2px_0_rgb(3_28_44/0.55)]"
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
