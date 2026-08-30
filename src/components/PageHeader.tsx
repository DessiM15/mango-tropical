import Image from "next/image";
import { Reveal } from "./Reveal";
import { Splash } from "./Splash";
import { Flora } from "./Flora";
import { WoodSign, type HeadingTone } from "./WoodSign";

/**
 * The banner every interior page opens with: the same sunset, palms and
 * flowers as the home page, with the title on a plaque.
 */
export function PageHeader({
  es,
  en,
  single,
  tone = "garrafa",
  body,
  feature,
  featureAlt,
  splash = "var(--color-mango-400)",
  children,
}: {
  es: string;
  en: string;
  /** Titles the page in one language instead of on a plaque. */
  single?: string;
  tone?: HeadingTone;
  body?: string;
  /** Large product image, shown beside the title on category pages. */
  feature?: string;
  featureAlt?: string;
  splash?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Image src="/scene/sunset-sky.webp" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-sunset-600/30 via-sunset-500/20 to-sunset-500/55" />
      </div>

      <Flora name="palms" className="left-[-7%] top-[4%] w-36 sm:w-52" />

      <div
        className={`relative mx-auto grid items-center gap-10 px-4 sm:px-6 lg:px-8 ${
          feature ? "max-w-6xl lg:grid-cols-[1.1fr_0.9fr]" : "max-w-4xl"
        }`}
      >
        <Reveal className={`flex flex-col ${feature ? "items-center text-center lg:items-start lg:text-left" : "items-center text-center"}`}>
          {single ? (
            <h1 className="display text-outline text-[clamp(2.4rem,6vw,4.5rem)] text-mango-300">
              {single}
            </h1>
          ) : (
            <WoodSign as="h1" primary={es} secondary={en} tone={tone} size="lg" tilt={-1.2} />
          )}
          {body ? (
            <p className="mt-7 max-w-2xl font-body text-lg leading-relaxed text-sand-50 [text-shadow:0_2px_0_rgb(42_18_6_/_0.45)] sm:text-xl">
              {body}
            </p>
          ) : null}
          {children}
        </Reveal>

        {feature ? (
          <Reveal from="right" className="relative mx-auto w-[80%] max-w-sm lg:w-full lg:max-w-md">
            <div className="relative aspect-[5/4]">
              <Splash color={splash} variant={2} className="absolute inset-[-10%] h-[120%] w-[120%] opacity-70 drift-slow" />
              <div aria-hidden="true" className="absolute inset-x-[18%] bottom-[6%] h-5 rounded-[50%] bg-ink/30 blur-xl" />
              <Image
                src={feature}
                alt={featureAlt ?? ""}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 34vw"
                className="bob object-contain drop-shadow-[0_16px_20px_rgb(42_18_6_/_0.38)]"
              />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
