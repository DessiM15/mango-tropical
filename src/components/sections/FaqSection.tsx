import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TornEdge } from "@/components/Dividers";
import { Flora } from "@/components/Flora";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

/**
 * Plain details and summary elements, so the accordion works with no
 * JavaScript and every answer is in the HTML for crawlers to read.
 */
export function FaqSection({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-sand-100 pb-20 pt-20 sm:pb-28 sm:pt-24" aria-labelledby="faq-heading">
      <TornEdge className="absolute inset-x-0 top-0 h-10 sm:h-14" fill="var(--color-ocean-700)" flip />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70"
        style={{ backgroundImage: "url(/art/sand-shore.webp)", backgroundSize: "auto 280px" }}
      />
      <Flora name="plumeria-cluster" className="right-[-5%] top-[6%] w-36 opacity-70 sm:w-52" />
      <Flora name="banana-leaves" className="bottom-[-4%] left-[-6%] w-36 opacity-70 sm:w-52" flip />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.faq.es}
          en={copy.headings.faq.en}
          titleId="faq-heading"
          tone="fruit"
        />

        <div className="mt-12 space-y-4">
          {copy.faq.items.map((item, index) => (
            <Reveal key={item.q.en} delay={index * 0.05}>
              <details className="group rounded-3xl bg-white shadow-card transition-shadow open:shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="label-type text-lg text-ink sm:text-xl">{item.q[locale]}</h3>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mango-400 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4 stroke-ink" strokeWidth="3" strokeLinecap="round">
                      <path d="M10 4v12M4 10h12" />
                    </svg>
                  </span>
                </summary>
                <p className="border-t-2 border-dashed border-ink/25 px-5 pb-5 pt-4 font-body text-[17px] leading-relaxed text-ink-soft sm:px-6 sm:pb-6">
                  {item.a[locale]}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
