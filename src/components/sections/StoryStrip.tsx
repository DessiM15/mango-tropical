import Image from "next/image";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { FramedPhoto } from "@/components/FramedPhoto";
import { Flora } from "@/components/Flora";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";

/** Sobre Nosotros, sitting out in the deep water like the mockup. */
export function StoryStrip({ locale }: { locale: Locale }) {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="story-heading"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Image src="/art/water-deep.webp" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ocean-700/45 mix-blend-multiply" />
      </div>

      <Flora name="plumeria-spray" className="left-[-6%] top-[-4%] w-40 opacity-90 sm:w-56" />
      <Flora name="hibiscus-pair" className="bottom-[-6%] right-[-3%] w-40 opacity-95 sm:w-60" drift />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal from="left" className="order-2 lg:order-1">
          <FramedPhoto
            src="/art/cover-scene.webp"
            alt={copy.about.frameAlt[locale]}
            caption={copy.about.frameCaption[locale]}
          />
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            es={copy.headings.about.es}
            en={copy.headings.about.en}
            titleId="story-heading"
            tone="garrafa"
            body={copy.about.body[0][locale]}
            align="left"
            onDark
          />
          <Reveal delay={0.2} className="mt-8">
            <MagneticButton href={path(locale, "about")} variant="cream">
              {copy.about.more[locale]}
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
