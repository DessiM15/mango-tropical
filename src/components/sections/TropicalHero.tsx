"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { SurfWash } from "@/components/SurfWash";
import { WoodSign } from "@/components/WoodSign";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { mapsUrl, site } from "@/lib/site";

/** True below the `sm` breakpoint, watched rather than read once. */
function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return narrow;
}

/**
 * The hero, built around one orchestrated move.
 *
 * The mango sits on the wave crest at the bottom left. As the page scrolls out
 * of the hero he rides that crest all the way across and off the right edge,
 * handing the visitor from the sunset half of the site into the ocean half.
 * It happens once, nothing else on the page competes with it, and on a narrow
 * screen it drops to a plain vertical parallax so a character never sweeps
 * across the reading column.
 *
 * The surf lane is a real row rather than an overlay. Absolutely positioning
 * the character put him straight through the buttons on any viewport shorter
 * than the one it was tuned on; as a row he cannot reach the copy at all.
 *
 * He and his board are two images, not one (see `SurfWash` for the water). The
 * single sprite could only ever be slid and turned as one piece, which is what
 * made him read as a sticker on the wall rather than as someone riding.
 */
export function TropicalHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const narrow = useNarrow();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 78, damping: 26, mass: 0.6 });

  // Positive lags behind the scroll, negative runs ahead of it.
  const skyY = useTransform(smooth, [0, 1], [0, 130]);
  const contentY = useTransform(smooth, [0, 1], [0, -30]);
  const productY = useTransform(smooth, [0, 1], [0, -58]);
  const frondY = useTransform(smooth, [0, 1], [0, -150]);
  const fade = useTransform(smooth, [0, 0.85], [1, 0.15]);

  // The ride. The crest sweeps a short way, he crosses the whole viewport.
  const crestX = useTransform(smooth, [0, 1], ["0vw", "18vw"]);
  const surferX = useTransform(smooth, [0, 1], ["0vw", "118vw"]);
  const surferY = useTransform(smooth, [0, 1], [0, narrow ? -90 : -26]);

  // The board and the rider are separate images, so they can be posed against
  // each other. The board takes the wave's tilt; he leans back across it, which
  // is the whole difference between someone riding and a sticker being slid.
  const boardTilt = useTransform(smooth, [0, 0.5, 1], [-4, 3, -6.5]);
  const riderLean = useTransform(smooth, [0, 0.5, 1], [2.5, -1.5, 3.5]);
  const spray = useTransform(smooth, [0, 0.12, 0.78, 1], [0, 0.85, 1, 0.35]);
  const sprayLift = useTransform(smooth, [0, 1], [0.78, 1.18]);

  const still = !!reduced;

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex h-[100svh] min-h-[38rem] flex-col overflow-hidden bg-ocean-400"
    >
      {/* Sky, furthest from the lens and slowest to move */}
      <motion.div
        aria-hidden="true"
        style={still ? undefined : { y: skyY }}
        className="absolute inset-x-0 top-0 -z-30 h-[86%]"
      >
        <div className={still ? "h-full w-full" : "push-in h-full w-full"}>
          <Image
            src="/scene/sunset-sky.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-sunset-600/20 via-transparent to-sunset-500/45" />
      </motion.div>

      {/* Light blooming off the sun, low and slightly right of centre */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-[86%] mix-blend-screen"
        style={{
          background:
            "radial-gradient(38% 30% at 58% 62%, rgb(255 214 138 / 0.55), rgb(255 170 80 / 0.16) 45%, transparent 72%)",
        }}
      />

      {/* One frond, top right. The matching one on the left was sitting on top
          of the logo and making the wordmark unreadable. */}
      <motion.div
        aria-hidden="true"
        style={still ? undefined : { y: frondY }}
        className="defocus-mid pointer-events-none absolute right-[-12%] top-[-10%] w-48 select-none sm:w-72 lg:w-[24rem]"
      >
        <div style={{ transform: "scaleX(-1)" }}>
          <Image src="/scene/palm-fronds.webp" alt="" width={963} height={952} sizes="(max-width: 640px) 38vw, 22vw" className="h-auto w-full" />
        </div>
      </motion.div>

      <motion.div
        style={still ? undefined : { y: contentY, opacity: fade }}
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 px-4 pt-24 sm:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] sm:px-6 sm:pt-28 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)] lg:gap-8 lg:px-8"
      >
        <div className="flex min-w-0 flex-col items-center text-center sm:items-start sm:text-left">
          <div className="mb-5 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full bg-white/95 px-5 py-2 shadow-soft">
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
            size="xl"
            tilt={-1.2}
            primary={copy.hero.signTop[locale]}
            secondary={copy.hero.signMain[locale]}
          >
            <p
              className="display text-outline-thin mt-2 text-[clamp(1.05rem,2.6vw,1.75rem)]"
              style={{ color: "var(--color-magenta-400)" }}
            >
              {copy.hero.signSub[locale]}
            </p>
          </WoodSign>

          <p className="mt-6 max-w-xl font-body text-base font-semibold leading-relaxed text-white [text-shadow:0_2px_10px_rgb(42_18_6_/_0.65)] sm:text-lg lg:text-xl">
            {copy.hero.sub[locale]}
          </p>

          <div className="mt-6 flex flex-row flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-4">
            <MagneticButton href={path(locale, "menu")} variant="solid">
              {copy.hero.primary[locale]}
            </MagneticButton>
            <MagneticButton href={mapsUrl} variant="outline" external>
              {copy.hero.secondary[locale]}
            </MagneticButton>
          </div>

          <a
            href={site.phoneHref}
            className="mt-5 font-label text-lg font-extrabold not-italic text-white [text-shadow:0_2px_8px_rgb(42_18_6_/_0.7)] underline decoration-mango-300 decoration-[3px] underline-offset-[7px] transition-colors hover:text-mango-300 sm:text-xl"
          >
            {site.phone}
          </a>
        </div>

        {/* The focal plane: the only thing in the frame that stays sharp. It is
            dropped on a phone, where the character carries the lower half and
            two products would leave no room for either. */}
        <motion.div
          style={still ? undefined : { y: productY }}
          className="pointer-events-none relative hidden h-full max-h-[26rem] min-w-0 self-center sm:block lg:max-h-[34rem]"
        >
          <div className="relative mx-auto h-full w-full">
            <div
              aria-hidden="true"
              className="absolute inset-x-[24%] bottom-[2%] h-6 rounded-[50%] bg-ink/40 blur-xl"
            />
            <Image
              src="/menu/nieve-mango-chamoy.webp"
              alt={copy.hero.cupAlt[locale]}
              fill
              priority
              sizes="(max-width: 1024px) 34vw, 32vw"
              className="z-10 object-contain drop-shadow-[0_18px_22px_rgb(42_18_6_/_0.42)]"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ---- the wave, and the one thing riding it ----
          The lane shrinks rather than holding its height. The copy above it
          cannot shrink below its own content, so a fixed lane pushed its own
          bottom past the section on a short viewport and took the board with
          it. Shrinking, it always ends exactly where the section does. */}
      <div
        aria-hidden="true"
        className="relative z-20 h-[36%] min-h-[11rem] shrink sm:h-[34%] lg:h-[40%]"
      >
        <motion.div
          style={still ? undefined : { x: crestX }}
          className="absolute inset-x-[-20%] bottom-0 top-0"
        >
          <div
            className="absolute inset-x-0 top-0 h-[66%]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 42%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 42%)",
            }}
          >
            <Image src="/scene/wave-crest.webp" alt="" fill sizes="140vw" className="object-cover object-bottom" />
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

        {/* The rig: board, the water it is cutting, and the rider on top. The
            box carries the art's own aspect ratio, so everything inside can be
            placed in the art's pixel coordinates and stay registered. */}
        <motion.div
          style={still ? undefined : narrow ? { y: surferY } : { x: surferX, y: surferY }}
          className="absolute bottom-[28%] left-[-6%] aspect-[971/809] h-[74%] sm:bottom-[24%] sm:left-[0%] sm:h-[80%] lg:bottom-[26%] lg:h-[70%]"
        >
          <motion.div
            style={still ? undefined : { rotate: boardTilt }}
            className="absolute inset-0 origin-[50%_88%]"
          >
            <Image
              src="/brand/surfboard.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 640px) 55vw, 30vw"
              className="object-contain drop-shadow-[0_12px_14px_rgb(42_18_6_/_0.45)]"
            />

            <SurfWash spray={spray} lift={sprayLift} still={still} />

            <motion.div
              style={still ? undefined : { rotate: riderLean }}
              className="absolute inset-0 origin-[51%_85.5%]"
            >
              <Image
                src="/brand/mango-rider.webp"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 55vw, 30vw"
                className="object-contain drop-shadow-[0_10px_14px_rgb(42_18_6_/_0.35)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
