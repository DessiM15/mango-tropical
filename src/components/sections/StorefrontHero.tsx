"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { addressLine, mapsUrl, site } from "@/lib/site";

/**
 * Concept A. The shop itself, full bleed.
 *
 * The photograph is portrait, so a wide desktop crop keeps the sign and loses
 * the door. That is the right thing to lose: the sign is what people look for
 * from the road. The focal point is pinned to the top so the crop never eats it.
 */
export function StorefrontHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 });
  const photoY = useTransform(smooth, [0, 1], [0, 120]);
  const copyY = useTransform(smooth, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink">
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: photoY }}
        className="absolute inset-0 -z-10 scale-110"
      >
        <Image
          src="/scene/storefront.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_22%]"
        />
      </motion.div>

      {/* Two scrims: one to seat the copy, one to keep the sky from blowing out
          the header links at the top of the frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(21_15_10/0.62)_0%,rgb(21_15_10/0.12)_28%,rgb(21_15_10/0.28)_58%,rgb(21_15_10/0.9)_100%)]"
      />

      <motion.div
        style={reduced ? undefined : { y: copyY }}
        className="relative mx-auto w-full max-w-5xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 lg:px-8"
      >
        <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-full bg-white/95 px-5 py-2 shadow-soft">
          <span className="font-label text-sm font-extrabold uppercase not-italic tracking-wider text-ink sm:text-base">
            {copy.hero.eyebrow[locale]}
          </span>
          <span className="hidden h-4 w-px bg-ink/25 sm:block" aria-hidden="true" />
          <OpenStatus locale={locale} className="text-ink" />
        </div>

        <h1
          id="hero-title"
          className="display mt-6 max-w-3xl text-[clamp(2.5rem,7.5vw,5.5rem)] leading-[0.92] text-white [text-shadow:0_4px_24px_rgb(21_15_10/0.75)]"
        >
          <span className="block">{copy.hero.signTop[locale]}</span>
          <span className="block text-mango-300">{copy.hero.signMain[locale]}</span>
        </h1>

        <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-white/95 [text-shadow:0_2px_12px_rgb(21_15_10/0.8)] sm:text-xl">
          {copy.hero.sub[locale]}
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <MagneticButton href={path(locale, "menu")} variant="solid">
            {copy.hero.primary[locale]}
          </MagneticButton>
          <MagneticButton href={mapsUrl} variant="outline" external>
            {copy.hero.secondary[locale]}
          </MagneticButton>
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 font-body text-sm text-white/85">
          <span>{addressLine}</span>
          <a href={site.phoneHref} className="font-bold underline decoration-mango-300 decoration-2 underline-offset-4 hover:text-mango-300">
            {site.phone}
          </a>
        </p>
      </motion.div>
    </section>
  );
}
