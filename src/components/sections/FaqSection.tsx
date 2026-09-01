import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TornEdge } from "@/components/Dividers";
import { PropScatter } from "@/components/Confetti";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

/**
 * Plain details and summary elements, so the accordion works with no
 * JavaScript and every answer is in the HTML for crawlers to read.
 */
export function FaqSection({ locale }: { locale: Locale }) {
  return (
    <section
      className="paper relative overflow-hidden bg-sand-50 pb-24 pt-28 sm:pb-28 sm:pt-32"
      aria-labelledby="faq-heading"
    >
      <TornEdge className="absolute inset-x-0 top-0 h-10 sm:h-14" fill="var(--color-sand-50)" flip />
      <PropScatter
        items={[
          { name: "chile", x: 4, y: 22, size: 3.4, rotate: -18, motion: "bob", opacity: 0.4 },
          { name: "star", x: 93, y: 16, size: 3, rotate: 14, motion: "spin", opacity: 0.35 },
          { name: "mango", x: 94, y: 70, size: 4, rotate: -8, motion: "drift", opacity: 0.35 },
        ]}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
              <details className="paper-card group transition-shadow">
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
