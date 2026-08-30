import Image from "next/image";
import { MagneticButton } from "@/components/MagneticButton";
import { OpenStatus } from "@/components/OpenStatus";
import { Marquee } from "@/components/Marquee";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";
import { addressLine, mapsUrl, site } from "@/lib/site";

/**
 * Concept C. No photographic hero at all.
 *
 * A compact band carrying the name, the one line that matters, whether the shop
 * is open, and where it is. The menu starts immediately underneath, because for
 * a shop this size the thing people arrive wanting is the food and the prices.
 */
export function MenuFirstHero({ locale }: { locale: Locale }) {
  return (
    <section className="relative isolate overflow-hidden bg-sunset-500 pt-24 sm:pt-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,var(--color-sunset-400),var(--color-sunset-600))]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pb-14 lg:grid-cols-[auto_1fr_auto] lg:gap-10 lg:px-8">
        <Image
          src="/logo.webp"
          alt=""
          width={206}
          height={206}
          priority
          className="h-24 w-24 rounded-full shadow-card sm:h-28 sm:w-28"
        />

        <div>
          <h1 id="hero-title" className="display text-[clamp(2.25rem,6vw,4rem)] leading-[0.92] text-white">
            <span className="block">{copy.hero.signTop[locale]}</span>
            <span className="block text-mango-300">{copy.hero.signMain[locale]}</span>
          </h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-white/95 sm:text-lg">
            {copy.hero.sub[locale]}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <div className="inline-flex items-center rounded-full bg-white/95 px-4 py-2 shadow-soft">
            <OpenStatus locale={locale} className="text-ink" />
          </div>
          <p className="font-body text-sm text-white/90">{addressLine}</p>
          <a
            href={site.phoneHref}
            className="font-label text-xl font-extrabold not-italic text-white underline decoration-mango-300 decoration-[3px] underline-offset-4 hover:text-mango-300"
          >
            {site.phone}
          </a>
          <div className="mt-1 flex gap-3">
            <MagneticButton href={mapsUrl} variant="cream" external className="!px-5 !py-2.5">
              {copy.hero.secondary[locale]}
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="border-y-2 border-ink/15 bg-mango-400 py-1.5 text-ink">
        <Marquee text={copy.marquee[locale]} seconds={46} />
      </div>

      <a href="#menu" className="sr-only focus:not-sr-only focus:block focus:p-4 focus:text-white">
        {copy.menuSection.viewAll[locale]}
      </a>
      <span className="sr-only">{path(locale, "menu")}</span>
    </section>
  );
}
