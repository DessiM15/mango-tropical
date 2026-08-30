import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TornEdge } from "@/components/Dividers";
import { Flora } from "@/components/Flora";
import { copy } from "@/lib/copy";
import { aggregate, hasRealReviews, reviews } from "@/lib/reviews";
import { mapsUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

const TILTS = ["-2.2deg", "1.6deg", "-1.1deg", "2.4deg", "-1.8deg", "1.2deg"];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={`h-5 w-5 ${index < rating ? "fill-mango-400" : "fill-ink/15"}`}
          aria-hidden="true"
        >
          <path
            d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"
            stroke="var(--color-ink)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export function ReviewWall({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-magenta-400 py-20 sm:py-28" aria-labelledby="reviews-heading">
      <TornEdge className="absolute inset-x-0 top-0 h-10 sm:h-14" fill="var(--color-ocean-100)" flip />
      <Flora name="palms" className="left-[-6%] top-[8%] w-40 opacity-80 sm:w-56" />
      <Flora name="flowers" className="bottom-[-6%] right-[-4%] w-40 opacity-85 sm:w-56" flip />

      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.reviews.es}
          en={copy.headings.reviews.en}
          titleId="reviews-heading"
          tone="nieve"
          onDark
        >
          {aggregate ? (
            <p className="mt-5 flex items-center gap-3 rounded-full bg-sand-50 px-5 py-2 shadow-card">
              <Stars rating={Math.round(aggregate.rating)} />
              <span className="font-label text-lg font-extrabold not-italic text-ink">
                {aggregate.rating.toFixed(1)} ({aggregate.count})
              </span>
            </p>
          ) : null}
        </SectionHeading>

        {!hasRealReviews ? (
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border-[3px] border-dashed border-sand-50/70 px-5 py-3 text-center font-body text-sm font-bold text-sand-50">
            {copy.reviews.placeholder[locale]}
          </p>
        ) : null}

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li key={`${review.author}-${index}`} className="h-full">
              <Reveal delay={index * 0.06} from="scale" className="h-full">
                <div
                  className="flex h-full flex-col rounded-[1.75rem] bg-white p-6 shadow-card transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1.5 hover:!rotate-0"
                  style={{ transform: `rotate(${TILTS[index % TILTS.length]})` }}
                >
                  <Stars rating={review.rating} />
                  <blockquote className="mt-4 flex-1 font-body text-[17px] leading-relaxed text-ink">
                    {review.body}
                  </blockquote>
                  <footer className="mt-5 flex items-center gap-3 border-t-2 border-dashed border-ink/25 pt-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mango-400 font-label text-lg font-extrabold not-italic text-ink"
                      aria-hidden="true"
                    >
                      {review.author.charAt(0)}
                    </span>
                    <cite className="label-type text-lg text-ink">{review.author}</cite>
                  </footer>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12 flex justify-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full bg-sand-50 px-7 py-3.5 font-label text-lg font-extrabold not-italic uppercase tracking-wide text-ink shadow-card transition-transform hover:-translate-y-1 sm:text-xl"
          >
            {copy.reviews.readAll[locale]}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
