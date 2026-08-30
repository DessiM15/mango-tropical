"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { WoodSign } from "@/components/WoodSign";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/**
 * Loose fruit at the cup's base, on the focal plane with it. Small independent
 * offsets keep the group from sliding as one flat sheet.
 */
const SCATTER = [
  { src: "/scene/fruit-mango-1.webp", className: "bottom-[1%] left-[-2%] w-[24%]", depth: 14, rotate: -12 },
  { src: "/scene/fruit-mango-2.webp", className: "bottom-[-1%] right-[8%] w-[22%]", depth: 10, rotate: 7 },
  { src: "/scene/fruit-citrus-3.webp", className: "bottom-[3%] right-[-4%] w-[17%]", depth: 18, rotate: 14 },
  { src: "/scene/fruit-citrus-4.webp", className: "bottom-[8%] left-[16%] w-[14%]", depth: 12, rotate: -8 },
  { src: "/scene/fruit-strawberry-1.webp", className: "bottom-[2%] left-[34%] w-[12%]", depth: 9, rotate: 10 },
  { src: "/scene/tamarindo-sticks-1.webp", className: "bottom-[6%] left-[-12%] w-[26%]", depth: 13, rotate: -4 },
];

/**
 * The hero as a shot rather than a layout.
 *
 * Depth is the organising idea. The sky lags furthest behind the scroll, the
 * water sits mid-ground, the product holds the focal plane sharp, and the
 * foliage nearest the lens travels fastest and sits out of focus. A slow
 * push-in opens on it. Every part of that is dropped for reduced motion.
 */
export function TropicalHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 78, damping: 26, mass: 0.6 });

  // Positive lags behind the scroll, negative runs ahead of it. The spread is
  // what makes the frame read as having depth rather than as sliding planes.
  const skyY = useTransform(smooth, [0, 1], [0, 130]);
  const waterY = useTransform(smooth, [0, 1], [0, 46]);
  const contentY = useTransform(smooth, [0, 1], [0, -30]);
  const productY = useTransform(smooth, [0, 1], [0, -58]);
  const nearY = useTransform(smooth, [0, 1], [0, -150]);
  const nearestY = useTransform(smooth, [0, 1], [0, -210]);
  const fade = useTransform(smooth, [0, 0.85], [1, 0.15]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ocean-400">
      {/* Sky, furthest from the lens and slowest to move */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: skyY }}
        className="absolute inset-x-0 top-0 -z-30 h-[80%]"
      >
        <div className={reduced ? "h-full w-full" : "push-in h-full w-full"}>
          <Image
            src="/scene/sunset-sky.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-sunset-600/20 via-transparent to-sunset-500/40" />
      </motion.div>

      {/* Light blooming off the sun, low and slightly right of centre */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-[80%] mix-blend-screen"
        style={{
          background:
            "radial-gradient(38% 30% at 58% 62%, rgb(255 214 138 / 0.55), rgb(255 170 80 / 0.16) 45%, transparent 72%)",
        }}
      />

      {/* Shoreline, mid-ground */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[38%] min-h-[16rem]">
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

      {/* Foliage nearest the lens: fastest, and off the focal plane */}
      <NearLayer y={nearY} reduced={!!reduced} blur="defocus-mid" className="left-[-10%] top-[-6%] w-56 sm:w-80 lg:w-[26rem]">
        <Image src="/scene/palm-fronds.webp" alt="" width={963} height={952} sizes="(max-width: 640px) 38vw, 22vw" className="h-auto w-full" />
      </NearLayer>
      <NearLayer y={nearY} reduced={!!reduced} blur="defocus-mid" className="right-[-12%] top-[-10%] w-52 sm:w-72 lg:w-[24rem]" flip>
        <Image src="/scene/palm-fronds.webp" alt="" width={963} height={952} sizes="(max-width: 640px) 38vw, 22vw" className="h-auto w-full" />
      </NearLayer>
      <NearLayer y={nearestY} reduced={!!reduced} blur="defocus-near" className="bottom-[-4%] left-[-6%] w-40 sm:w-56 lg:w-72">
        <Image src="/scene/flowers-cluster.webp" alt="" width={972} height={997} sizes="(max-width: 640px) 38vw, 22vw" className="h-auto w-full" />
      </NearLayer>
      <NearLayer y={nearestY} reduced={!!reduced} blur="defocus-near" className="bottom-[2%] right-[-5%] w-36 sm:w-52 lg:w-64">
        <Image src="/scene/hibiscus-pair.webp" alt="" width={1200} height={904} sizes="(max-width: 640px) 38vw, 22vw" className="h-auto w-full" />
      </NearLayer>

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: fade }}
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
            <MagneticButton href={mapsUrl} variant="outline" external>
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

        {/* The focal plane: the only thing in the frame that stays sharp. */}
        <motion.div
          style={reduced ? undefined : { y: productY }}
          className="pointer-events-none relative mx-auto w-[92%] max-w-md self-end lg:absolute lg:bottom-[13%] lg:right-[2%] lg:mx-0 lg:w-[46%] lg:max-w-xl"
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
}

function NearLayer({
  y,
  reduced,
  blur,
  className,
  flip = false,
  children,
}: {
  y: ReturnType<typeof useTransform<number, number>>;
  reduced: boolean;
  blur: string;
  className: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={reduced ? undefined : { y }}
      className={`pointer-events-none absolute select-none ${blur} ${className}`}
    >
      <div style={flip ? { transform: "scaleX(-1)" } : undefined}>{children}</div>
    </motion.div>
  );
}

function ScatterPiece({
  src,
  className,
  depth,
  rotate,
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
