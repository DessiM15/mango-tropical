"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/**
 * Concept D. The food, as large as it will go, on a dark ground.
 *
 * The product photography comes off a 300 DPI scan of a printed page, so it
 * cannot be blown up sharp across a whole viewport. The ground is therefore the
 * same shot scaled up and thrown out of focus, which is a treatment rather than
 * a compromise: the blur is doing the work and the sharp cutout on top carries
 * the detail.
 */
export function MacroHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 });
  const groundY = useTransform(smooth, [0, 1], [0, 90]);
  const productY = useTransform(smooth, [0, 1], [0, -90]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#150f0a]"
    >
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: groundY }}
        className="absolute inset-0 -z-20 scale-125"
      >
        <Image
          src="/menu/mangonada-tropical.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover blur-[26px] saturate-150"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_70%_45%,rgb(21_15_10/0.25),rgb(21_15_10/0.88)_72%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:px-8">
        <div>
          <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-full bg-white/12 px-5 py-2 ring-1 ring-white/25 backdrop-blur-sm">
            <span className="font-label text-sm font-extrabold uppercase not-italic tracking-wider text-white sm:text-base">
              {copy.hero.eyebrow[locale]}
            </span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />
            <OpenStatus locale={locale} className="text-white" />
          </div>

          <h1
            id="hero-title"
            className="display mt-6 text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-white"
          >
            <span className="block">{copy.hero.signTop[locale]}</span>
            <span className="block text-mango-400">{copy.hero.signMain[locale]}</span>
          </h1>

          <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-white/85 sm:text-xl">
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

          <a
            href={site.phoneHref}
            className="mt-7 inline-block font-label text-xl font-extrabold not-italic text-white underline decoration-mango-400 decoration-[3px] underline-offset-[7px] hover:text-mango-400"
          >
            {site.phone}
          </a>
        </div>

        <motion.div
          style={reduced ? undefined : { y: productY }}
          className="relative mx-auto w-[92%] max-w-lg lg:w-full lg:max-w-none"
        >
          <div className="relative aspect-[5/4]">
            <div
              aria-hidden="true"
              className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgb(255_198_30/0.35),transparent_70%)] blur-2xl"
            />
            <Image
              src="/menu/cut-mangonada.webp"
              alt={copy.hero.cupAlt[locale]}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.65)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
