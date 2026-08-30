"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { FilledHeadline } from "@/components/FilledHeadline";
import { MagneticButton } from "@/components/MagneticButton";
import { Marquee } from "@/components/Marquee";
import { OpenStatus } from "@/components/OpenStatus";
import { HeroBackground } from "./HeroBackground";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/** Floating product stickers, positioned per breakpoint and given their own depth. */
const STICKERS = [
  {
    src: "/menu/sticker-mangonada.png",
    className: "left-[-4%] top-[16%] w-28 sm:left-[2%] sm:top-[20%] sm:w-40 lg:w-52",
    depth: 90,
    rotate: -12,
    delay: 0,
  },
  {
    src: "/menu/sticker-raspa.png",
    className: "right-[-5%] top-[10%] w-24 sm:right-[3%] sm:top-[14%] sm:w-36 lg:w-44",
    depth: 150,
    rotate: 10,
    delay: 0.6,
  },
  {
    src: "/menu/sticker-elote.png",
    className: "bottom-[19%] right-[4%] hidden w-32 sm:block lg:w-44",
    depth: 60,
    rotate: 8,
    delay: 1.2,
  },
];

export function Hero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const typeY = useTransform(smooth, [0, 1], [0, -70]);
  const fade = useTransform(smooth, [0, 0.75], [1, 0]);

  const headlineLines = [copy.hero.line1[locale], copy.hero.line2[locale]];

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-sunset-500">
      <HeroBackground />

      {STICKERS.map((sticker) => (
        <FloatingSticker key={sticker.src} {...sticker} progress={smooth} reduced={!!reduced} />
      ))}

      <motion.div
        style={reduced ? undefined : { y: typeY, opacity: fade }}
        className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-4 pb-28 pt-28 text-center sm:px-6 sm:pb-32 sm:pt-32"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border-[3px] border-ink bg-sand-50 px-5 py-2 shadow-[4px_4px_0_0_var(--color-ink)]">
          <span className="font-label text-sm font-extrabold uppercase not-italic tracking-wider text-ink sm:text-base">
            {copy.hero.eyebrow[locale]}
          </span>
          <span className="hidden h-4 w-px bg-ink/30 sm:block" aria-hidden="true" />
          <OpenStatus locale={locale} className="text-ink" />
        </div>

        <div className="mt-7 w-full sm:mt-9">
          <FilledHeadline lines={headlineLines} fill="art" id="hero-title" />
        </div>

        <p className="mx-auto mt-7 max-w-2xl font-body text-lg font-semibold leading-relaxed text-sand-50 [text-shadow:0_2px_0_rgb(42_18_6_/_0.45)] sm:mt-8 sm:text-xl">
          {copy.hero.sub[locale]}
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <MagneticButton href={path(locale, "menu")} variant="solid">
            {copy.hero.primary[locale]}
          </MagneticButton>
          <MagneticButton href={mapsUrl} variant="cream" external>
            {copy.hero.secondary[locale]}
          </MagneticButton>
        </div>

        <a
          href={site.phoneHref}
          className="mt-7 font-label text-lg font-extrabold not-italic text-sand-50 underline decoration-mango-300 decoration-[3px] underline-offset-[6px] hover:text-mango-300"
        >
          {site.phone}
        </a>
      </motion.div>

      <div className="relative z-10 border-y-[4px] border-ink bg-mango-400 py-2 text-ink">
        <Marquee text={copy.marquee[locale]} seconds={42} />
      </div>

    </section>
  );
}

function FloatingSticker({
  src,
  className,
  depth,
  rotate,
  delay,
  progress,
  reduced,
}: (typeof STICKERS)[number] & {
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  const y = useTransform(progress, [0, 1], [0, depth]);

  return (
    <motion.div
      aria-hidden="true"
      style={reduced ? { rotate } : { y, rotate }}
      className={`pointer-events-none absolute -z-[5] ${className}`}
    >
      <div className={reduced ? "" : "bob"} style={{ animationDelay: `${delay}s` }}>
        <Image
          src={src}
          alt=""
          width={420}
          height={420}
          className="h-auto w-full drop-shadow-[6px_10px_0_rgb(42_18_6_/_0.25)]"
        />
      </div>
    </motion.div>
  );
}
