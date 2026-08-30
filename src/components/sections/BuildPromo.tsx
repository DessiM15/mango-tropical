import Image from "next/image";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ChamoyDrip } from "@/components/Dividers";
import { copy } from "@/lib/copy";
import { path, type Locale } from "@/lib/i18n";

export function BuildPromo({ locale }: { locale: Locale }) {
  const steps = [
    copy.build.steps.size[locale],
    copy.build.steps.base[locale],
    copy.build.steps.fruit[locale],
    copy.build.steps.chamoy[locale],
    copy.build.steps.toppings[locale],
  ];

  return (
    <section className="relative overflow-hidden bg-mango-400 py-20 sm:py-28" aria-labelledby="build-heading">
      <ChamoyDrip className="absolute inset-x-0 top-0 h-14 sm:h-20" fill="var(--color-sand-50)" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <SectionHeading
            kicker={copy.build.kicker[locale]}
            title={copy.build.title[locale]}
          titleId="build-heading"
            body={copy.build.body[locale]}
            align="left"
          />

          <Reveal delay={0.15}>
            <ol className="mt-8 flex flex-wrap gap-2.5">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-2 rounded-full border-[3px] border-ink bg-sand-50 px-4 py-2 shadow-[3px_3px_0_0_var(--color-ink)]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink font-body text-xs font-black text-mango-300">
                    {index + 1}
                  </span>
                  <span className="font-body text-sm font-extrabold uppercase tracking-wide text-ink">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.25} className="mt-9">
            <MagneticButton href={path(locale, "build")} variant="solid">
              {copy.build.cta[locale]}
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal from="right" className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div
              className="absolute inset-0 rotate-[-6deg] rounded-[2.5rem] border-[4px] border-ink bg-sunset-400 shadow-[10px_12px_0_0_var(--color-ink)]"
              aria-hidden="true"
            />
            <div className="absolute inset-0 rotate-[3deg] overflow-hidden rounded-[2.5rem] border-[4px] border-ink shadow-[10px_12px_0_0_var(--color-ink)]">
              <Image
                src="/menu/mangonada-tropical.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
