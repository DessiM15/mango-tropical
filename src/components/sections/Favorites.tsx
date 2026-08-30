"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { WoodSign } from "@/components/WoodSign";
import { Flora } from "@/components/Flora";
import { MagneticButton } from "@/components/MagneticButton";
import { copy } from "@/lib/copy";
import { favorites, money } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

/**
 * The house favourites, on the water. A native scroll container with snap
 * points, so it works by swipe, by wheel, by keyboard and by the arrows, and
 * needs no carousel library.
 */
export function Favorites({ locale }: { locale: Locale }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const items = favorites();

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  function nudge(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="favorites-heading">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Image
          src="/scene/water-surface.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ocean-400/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-300/45 via-transparent to-ocean-600/40" />
      </div>

      <Flora name="palms" className="left-[-6%] top-[-6%] w-40 opacity-90 sm:w-60" />
      <Flora name="hibiscus" className="bottom-[-6%] right-[-4%] w-32 opacity-90 sm:w-48" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <WoodSign
            id="favorites-heading"
            tone="garrafa"
            tilt={-1}
            size="md"
            primary={copy.favorites.title.es}
            secondary={locale === "en" ? copy.favorites.title.en : undefined}
          />
        </div>

        <div className="relative mt-10">
          <ul
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map(({ item, category }) => (
              <li
                key={item.slug}
                className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]"
              >
                <Link
                  href={path(locale, "menu", category.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-card transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-2 hover:rotate-[-1deg]"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={item.image ?? category.image}
                      alt={item.name[locale]}
                      fill
                      sizes="(max-width: 640px) 68vw, (max-width: 1024px) 42vw, 23vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center p-4 text-center">
                    <h3 className="display text-lg leading-tight text-ink sm:text-xl">
                      {item.name[locale]}
                    </h3>
                    <p className="label-type mt-2 text-2xl text-chamoy-500">
                      {money(item.prices[item.prices.length - 1].amount)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label={copy.favorites.previous[locale]}
            className="absolute left-[-0.5rem] top-[38%] hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-card transition disabled:opacity-35 sm:flex lg:left-[-1.5rem]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-ink" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label={copy.favorites.next[locale]}
            className="absolute right-[-0.5rem] top-[38%] hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-card transition disabled:opacity-35 sm:flex lg:right-[-1.5rem]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-ink" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <MagneticButton href={path(locale, "menu")} variant="solid">
            {copy.menuSection.viewAll[locale]}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
