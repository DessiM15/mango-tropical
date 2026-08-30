import Image from "next/image";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";

/**
 * The storefront is the only real environmental photograph we have, so it gets
 * a full-bleed band of its own rather than sitting in a frame on a generated
 * water backdrop. The warm tint is what keeps the copy legible over it.
 */
export function StoryStrip({ locale }: { locale: Locale }) {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="story-heading">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Image
          src="/scene/storefront.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* Warm tint, not a gradient: the photograph is doing the work and a
          fade would just soften it. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sunset-700/80 mix-blend-multiply" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/25" />

      <div className="relative mx-auto flex min-h-[32rem] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:min-h-[36rem] lg:px-8">
        <Reveal className="flex flex-col items-center">
          <h2
            id="story-heading"
            className="display text-outline text-[clamp(2.25rem,5vw,3.75rem)] text-mango-300"
          >
            {locale === "en" ? copy.headings.about.en : copy.headings.about.es}
          </h2>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-sand-50 [text-shadow:0_2px_8px_rgb(42_18_6_/_0.8)] sm:text-xl">
            {copy.about.body[0][locale]}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-9">
          <MagneticButton href={path(locale, "about")} variant="cream">
            {copy.about.more[locale]}
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
