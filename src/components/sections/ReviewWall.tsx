import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ChamoyDrip } from "@/components/Dividers";
import { Flora } from "@/components/Flora";
import { JsonLd } from "@/components/JsonLd";
import { copy } from "@/lib/copy";
import { aggregate, reviews } from "@/lib/reviews";
import { mapsUrl, site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

/** Google's mark, so the source of the quotes is unambiguous. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.1 7.1 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
    </svg>
  );
}

export function ReviewWall({ locale }: { locale: Locale }) {
  // Only reviews carrying a rating are marked up, so the structured data can
  // never claim a score that was not actually given.
  const rated = reviews.filter((review) => review.rating !== undefined);
  const schema =
    rated.length > 0
      ? {
          "@context": "https://schema.org",
          "@id": `${site.url}/#business`,
          review: rated.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.author },
            reviewBody: review.body,
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
            },
          })),
          ...(aggregate
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: aggregate.rating,
                  reviewCount: aggregate.count,
                },
              }
            : {}),
        }
      : null;

  return (
    <section className="relative overflow-hidden bg-magenta-400 py-20 sm:py-28" aria-labelledby="reviews-heading">
      <ChamoyDrip className="absolute inset-x-0 top-0 h-14 sm:h-20" fill="var(--color-ocean-100)" />
      <Flora name="palms" className="left-[-6%] top-[8%] w-40 opacity-80 sm:w-56" />
      <Flora name="flowers" className="bottom-[-6%] right-[-4%] w-40 opacity-85 sm:w-56" flip />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.reviews.es}
          en={copy.headings.reviews.en}
          titleId="reviews-heading"
          tone="nieve"
          onDark
        >
          {aggregate ? (
            <p className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-card">
              <span className="display text-3xl text-ink">{aggregate.rating.toFixed(1)}</span>
              <span className="font-body text-sm font-bold text-ink-soft">
                {aggregate.count} {copy.reviews.onGoogle[locale]}
              </span>
            </p>
          ) : null}
        </SectionHeading>

        <ul className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:balance]">
          {reviews.map((review) => (
            <li key={review.author} className="mb-6 break-inside-avoid">
              <Reveal from="scale">
                <figure className="rounded-2xl bg-white p-7 shadow-card">
                  <blockquote className="font-body text-[17px] leading-[1.65] text-ink">
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-2.5">
                    <GoogleMark />
                    <span className="label-type text-[17px] text-ink">{review.author}</span>
                    <span className="font-body text-[13px] text-ink-soft/70">{review.when}</span>
                  </figcaption>
                  {review.translated ? (
                    <p className="mt-2 font-body text-[12px] italic text-ink-soft/60">
                      {copy.reviews.translated[locale]}
                    </p>
                  ) : null}
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12 flex justify-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 font-label text-lg font-extrabold not-italic uppercase tracking-wide text-ink shadow-soft transition-shadow hover:shadow-lift"
          >
            <GoogleMark />
            {copy.reviews.readAll[locale]}
          </a>
        </Reveal>
      </div>

      {schema ? <JsonLd data={schema} /> : null}
    </section>
  );
}
