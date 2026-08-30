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
  tone = "garrafa",
  body,
  feature,
  featureAlt,
  splash = "var(--color-mango-400)",
  children,
}: {
  es: string;
  en: string;
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
        <div className="absolute inset-0 bg-[linear-gradient(178deg,var(--color-sunset-300)_0%,var(--color-sunset-400)_45%,var(--color-sunset-500)_100%)]" />
        <div
          className="absolute inset-0 opacity-45 mix-blend-multiply"
          style={{ backgroundImage: "url(/art/paper-orange.webp)", backgroundSize: "520px auto" }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[34%] max-w-[22rem] bg-[url(/art/palms-left.webp)] bg-cover bg-right [mask-image:linear-gradient(to_right,black,transparent)]"
        />
        <div
          className="absolute inset-y-0 right-0 w-[34%] max-w-[22rem] bg-[url(/art/palms-right.webp)] bg-cover bg-left [mask-image:linear-gradient(to_left,black,transparent)]"
        />
      </div>

      <Flora name="banana-leaves" className="left-[-6%] top-[8%] w-36 sm:w-52" />
      <Flora name="plumeria-cluster" className="right-[-4%] top-[2%] w-40 sm:w-60" />

      <div
        className={`relative mx-auto grid items-center gap-10 px-4 sm:px-6 lg:px-8 ${
          feature ? "max-w-6xl lg:grid-cols-[1.1fr_0.9fr]" : "max-w-4xl"
        }`}
      >
        <Reveal className={`flex flex-col ${feature ? "items-center text-center lg:items-start lg:text-left" : "items-center text-center"}`}>
          <WoodSign as="h1" primary={es} secondary={en} tone={tone} size="lg" tilt={-1.2} />
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
