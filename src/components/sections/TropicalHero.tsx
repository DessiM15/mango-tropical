"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { WoodSign } from "@/components/WoodSign";
import { Flora } from "@/components/Flora";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/**
 * Loose fruit around the cup. Each piece carries its own depth so the group
 * separates on scroll instead of moving as one flat sheet, and its own delay so
 * the bobbing never falls into step.
 */
const SCATTER = [
  { src: "/scene/fruit-mango-1.webp", className: "bottom-[1%] left-[-2%] w-[24%]", depth: 26, rotate: -12, delay: 0 },
  { src: "/scene/fruit-mango-2.webp", className: "bottom-[-1%] right-[8%] w-[22%]", depth: 20, rotate: 7, delay: 0.7 },
  { src: "/scene/fruit-citrus-3.webp", className: "bottom-[3%] right-[-4%] w-[17%]", depth: 32, rotate: 14, delay: 1.4 },
  { src: "/scene/fruit-citrus-4.webp", className: "bottom-[8%] left-[16%] w-[14%]", depth: 22, rotate: -8, delay: 2.1 },
  { src: "/scene/fruit-strawberry-1.webp", className: "bottom-[2%] left-[34%] w-[12%]", depth: 18, rotate: 10, delay: 1 },
  { src: "/scene/tamarindo-sticks-1.webp", className: "bottom-[6%] left-[-12%] w-[26%]", depth: 24, rotate: -4, delay: 0.4 },
];

export function TropicalHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });

  const skyY = useTransform(smooth, [0, 1], [0, 90]);
  const waterY = useTransform(smooth, [0, 1], [0, -50]);
  const contentY = useTransform(smooth, [0, 1], [0, -45]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ocean-400">
      {/* Sky */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: skyY }}
        className="absolute inset-x-0 top-0 -z-30 h-[78%]"
      >
        <Image
          src="/scene/sunset-sky.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sunset-600/25 via-transparent to-sunset-500/45" />
      </motion.div>

      {/* Shoreline: the wave breaks along the bottom, sand underneath it. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-20 h-[38%] min-h-[16rem]">
        <motion.div style={reduced ? undefined : { y: waterY }} className="absolute inset-0">
          <div
            className="absolute inset-x-0 top-0 h-[62%]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 45%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 45%)",
            }}
          >
            <Image src="/scene/wave-crest.webp" alt="" fill sizes="100vw" className="object-cover object-bottom" />
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-[46%]"
            style={{
              backgroundImage: "url(/scene/wet-sand-tile.webp)",
              backgroundSize: "cover",
              maskImage: "linear-gradient(to bottom, transparent, black 40%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%)",
            }}
          />
        </motion.div>
      </div>

      <Flora name="palms" className="left-[-10%] top-[-6%] w-56 sm:w-80 lg:w-[26rem]" priority />
      <Flora name="palms" className="right-[-12%] top-[-10%] w-52 sm:w-72 lg:w-[24rem]" flip priority />
      <Flora name="flowers" className="bottom-[-4%] left-[-6%] w-40 sm:w-56 lg:w-72" drift />
      <Flora name="hibiscus" className="bottom-[2%] right-[-5%] w-36 sm:w-52 lg:w-64" drift />

      <motion.div
        style={reduced ? undefined : { y: contentY }}
        className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-4 pb-[15rem] pt-28 sm:px-6 sm:pb-[13rem] sm:pt-32 lg:max-w-7xl lg:grid-cols-[minmax(0,40rem)] lg:pb-[16rem] lg:px-8"
      >
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full bg-white/95 px-5 py-2 shadow-soft">
            <span className="font-label text-sm font-extrabold uppercase not-italic tracking-wider text-ink sm:text-base">
              {copy.hero.eyebrow[locale]}
            </span>
            <span className="hidden h-4 w-px bg-ink/25 sm:block" aria-hidden="true" />
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

          <p className="mt-7 max-w-xl font-body text-lg font-semibold leading-relaxed text-white [text-shadow:0_2px_10px_rgb(42_18_6_/_0.65)] sm:text-xl">
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
            className="mt-6 font-label text-xl font-extrabold not-italic text-white [text-shadow:0_2px_8px_rgb(42_18_6_/_0.7)] underline decoration-mango-300 decoration-[3px] underline-offset-[7px] transition-colors hover:text-mango-300"
          >
            {site.phone}
          </a>
        </div>

        <div className="pointer-events-none relative mx-auto w-[92%] max-w-md self-end lg:absolute lg:bottom-[13%] lg:right-[2%] lg:mx-0 lg:w-[46%] lg:max-w-xl">
          <div className="relative aspect-[5/4]">
            <div
              aria-hidden="true"
              className="absolute inset-x-[22%] bottom-[8%] h-5 rounded-[50%] bg-ink/50 blur-lg"
            />
            <Image
              src="/menu/cut-mangonada.webp"
              alt={copy.hero.cupAlt[locale]}
              fill
              priority
              sizes="(max-width: 1024px) 88vw, 40vw"
              className="z-10 object-contain drop-shadow-[0_10px_14px_rgb(42_18_6_/_0.4)]"
            />

            {SCATTER.map((piece) => (
              <ScatterPiece key={piece.src} {...piece} progress={smooth} reduced={!!reduced} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ScatterPiece({
  src,
  className,
  depth,
  rotate,
  delay,
  progress,
  reduced,
}: (typeof SCATTER)[number] & { progress: ReturnType<typeof useSpring>; reduced: boolean }) {
  const y = useTransform(progress, [0, 1], [0, depth]);

  return (
    <motion.div
      aria-hidden="true"
      style={reduced ? { rotate } : { y, rotate }}
      className={`pointer-events-none absolute ${className}`}
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute inset-x-[12%] bottom-[-6%] h-2 rounded-[50%] bg-ink/45 blur-[6px]"
        />
        <Image
          src={src}
          alt=""
          width={300}
          height={300}
          sizes="(max-width: 640px) 22vw, 11vw"
          className="relative h-auto w-full drop-shadow-[0_6px_8px_rgb(42_18_6_/_0.35)]"
        />
      </div>
    </motion.div>
  );
}
