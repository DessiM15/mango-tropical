import Image from "next/image";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ChamoyDrip } from "@/components/Dividers";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";

export function StoryStrip({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-ocean-300 pb-20 pt-24 sm:pb-28 sm:pt-32" aria-labelledby="story-heading">
      <ChamoyDrip className="absolute inset-x-0 top-0 h-14 sm:h-20" fill="var(--color-ocean-100)" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal from="left" className="relative order-2 lg:order-1">
          <div className="relative mx-auto grid max-w-md grid-cols-2 gap-4">
            {[
              { src: "/menu/nieve-mango.webp", tilt: "-4deg" },
              { src: "/menu/nieve-limon.webp", tilt: "3deg" },
              { src: "/menu/nieve-fresa.webp", tilt: "2deg" },
              { src: "/menu/nieve-tamarindo.webp", tilt: "-3deg" },
            ].map((tile) => (
              <div
                key={tile.src}
                className="relative aspect-square overflow-hidden rounded-[1.75rem] border-[4px] border-ink shadow-[6px_8px_0_0_var(--color-ink)]"
                style={{ transform: `rotate(${tile.tilt})` }}
              >
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            kicker={copy.about.kicker[locale]}
            title={copy.about.title[locale]}
          titleId="story-heading"
            body={copy.about.body[0][locale]}
            align="left"
          />
          <Reveal delay={0.2} className="mt-8">
            <MagneticButton href={path(locale, "about")} variant="cream">
              {copy.nav.about[locale]}
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
