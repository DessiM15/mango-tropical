import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

/**
 * Plain details and summary elements, so the accordion works with no
 * JavaScript and every answer is in the HTML for crawlers to read.
 */
export function FaqSection({ locale }: { locale: Locale }) {
  return (
    <section className="relative bg-sand-50 pb-24 pt-24 sm:pb-28 sm:pt-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.faq.es}
          en={copy.headings.faq.en}
          single={copy.headings.faq[locale]}
          singleColor="var(--color-chamoy-500)"
          titleId="faq-heading"
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
                <p className="border-t border-ink/12 px-5 pb-5 pt-4 font-body text-[17px] leading-relaxed text-ink-soft sm:px-6 sm:pb-6">
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
