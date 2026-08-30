"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { WoodSign } from "@/components/WoodSign";
import { Flora } from "@/components/Flora";
import { Splash } from "@/components/Splash";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/**
 * The hero rebuilt as a scene rather than a poster: sunset sky, palms, the
 * watercolour shoreline, flowers framing both corners and the plaque holding
 * the headline, which is how the printed menu's cover is composed.
 */
export function TropicalHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });

  const palmsY = useTransform(smooth, [0, 1], [0, 110]);
  const waterY = useTransform(smooth, [0, 1], [0, -60]);
  const cupY = useTransform(smooth, [0, 1], [0, -130]);
  const contentY = useTransform(smooth, [0, 1], [0, -50]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      {/* Sky */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[linear-gradient(178deg,var(--color-sunset-300)_0%,var(--color-sunset-400)_38%,var(--color-sunset-500)_66%,var(--color-sunset-400)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 opacity-45 mix-blend-multiply"
        style={{ backgroundImage: "url(/art/paper-orange.webp)", backgroundSize: "540px auto" }}
      />

      {/* Palms, the slowest moving layer */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: palmsY }}
        className="absolute inset-0 -z-20"
      >
        <div className="absolute inset-y-0 left-0 w-[42%] max-w-[28rem] sm:w-[32%]">
          <Image
            src="/art/palms-left.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 42vw, 32vw"
            className="object-cover object-right [mask-image:linear-gradient(to_right,black_0%,black_40%,transparent_100%)]"
          />
        </div>
        <div className="absolute inset-y-0 right-0 w-[42%] max-w-[28rem] sm:w-[32%]">
          <Image
            src="/art/palms-right.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 42vw, 32vw"
            className="object-cover object-left [mask-image:linear-gradient(to_left,black_0%,black_40%,transparent_100%)]"
          />
        </div>
      </motion.div>

      {/* Shoreline. Sand fades in first, then the wave breaks along the very
          bottom edge, so the water never cuts across the headline. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[36%] min-h-[15rem]">
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{
            backgroundImage: "url(/art/sand-shore.webp)",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x",
            maskImage: "linear-gradient(to bottom, transparent, black 70%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 70%)",
          }}
        />
        {/* The plate is a rectangular crop, so its top edge is masked off and
            the foam is layered over the join. Otherwise the water reads as a
            blue band ruled across the page. */}
        <motion.div
          style={reduced ? undefined : { y: waterY }}
          className="absolute inset-x-0 bottom-0 top-[22%]"
        >
          <div
            className="absolute inset-0"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 34%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 34%)",
            }}
          >
            <Image src="/art/wave-crest.webp" alt="" fill sizes="100vw" className="object-cover object-top" />
          </div>
          <div
            className="wave-shift absolute inset-x-0 top-0 h-24 opacity-80"
            style={{
              backgroundImage: "url(/art/wave-crest.webp)",
              backgroundSize: "1200px 100%",
              backgroundRepeat: "repeat-x",
              maskImage: "linear-gradient(to bottom, transparent, black 45%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 45%, transparent)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-[linear-gradient(180deg,transparent,var(--color-ocean-400)_88%)]" />
        </motion.div>
      </div>

      <Flora name="banana-leaves" className="left-[-6%] top-0 w-44 sm:w-64 lg:w-80" drift />
      <Flora name="plumeria-cluster" className="right-[-4%] top-[-2%] w-48 sm:w-72 lg:w-[26rem]" drift />
      <Flora name="plumeria-spray" className="bottom-[6%] left-[-5%] hidden w-52 sm:block lg:w-72" flip drift />
      <Flora name="hibiscus-pair" className="bottom-[2%] right-[-3%] w-36 sm:w-52 lg:w-64" drift />

      <motion.div
        style={reduced ? undefined : { y: contentY }}
        className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-4 pb-[19rem] pt-28 sm:px-6 sm:pb-[17rem] sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-[15rem] lg:px-8"
      >
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full bg-sand-50 px-5 py-2 shadow-card">
            <span className="font-label text-sm font-extrabold uppercase not-italic tracking-wider text-ink sm:text-base">
              {copy.hero.eyebrow[locale]}
            </span>
            <span className="hidden h-4 w-px bg-ink/30 sm:block" aria-hidden="true" />
            <OpenStatus locale={locale} className="text-ink" />
          </div>

          <WoodSign
            as="h1"
            id="hero-title"
            tone="garrafa"
            size="lg"
            tilt={-1.2}
            primary={copy.hero.signTop[locale]}
            secondary={copy.hero.signMain[locale]}
          >
            <p
              className="display text-outline-thin mt-2 text-[clamp(0.95rem,2.4vw,1.5rem)]"
              style={{ color: "var(--color-magenta-400)" }}
            >
              {copy.hero.signSub[locale]}
            </p>
          </WoodSign>

          <p className="mt-7 max-w-xl font-body text-lg font-semibold leading-relaxed text-sand-50 [text-shadow:0_2px_0_rgb(42_18_6_/_0.5)] sm:text-xl">
            {copy.hero.sub[locale]}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <MagneticButton href={path(locale, "menu")} variant="solid">
              {copy.hero.primary[locale]}
            </MagneticButton>
            <MagneticButton href={mapsUrl} variant="cream" external>
              {copy.hero.secondary[locale]}
            </MagneticButton>
          </div>

          <a
            href={site.phoneHref}
            className="mt-6 font-label text-xl font-extrabold not-italic text-white [text-shadow:0_2px_6px_rgb(42_18_6_/_0.55)] underline decoration-mango-300 decoration-[3px] underline-offset-[7px] transition-colors hover:text-mango-300"
          >
            {site.phone}
          </a>
        </div>

        {/* A die-cut sticker rather than a cutout: the cups are clear plastic,
            so matting them removes the cup along with the background. */}
        <motion.div
          style={reduced ? undefined : { y: cupY }}
          className="relative mx-auto w-[88%] max-w-md lg:w-full lg:max-w-lg"
        >
          <div className="relative aspect-[5/4]">
            <Splash
              color="var(--color-mango-400)"
              variant={1}
              className="absolute inset-[-10%] h-[120%] w-[120%] opacity-75 drift-slow"
            />
            {/* Sits on the sand rather than on top of the page. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[16%] bottom-[4%] h-6 rounded-[50%] bg-ink/35 blur-xl"
            />
            <Image
              src="/menu/cut-mangonada.webp"
              alt={copy.hero.cupAlt[locale]}
              fill
              priority
              sizes="(max-width: 1024px) 82vw, 38vw"
              className="bob object-contain drop-shadow-[0_18px_22px_rgb(42_18_6_/_0.4)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
