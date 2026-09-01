import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { WaveDivider } from "@/components/Dividers";
import { PropScatter } from "@/components/Confetti";
import { OpenStatus } from "@/components/OpenStatus";
import { weekRows } from "@/components/SiteFooter";
import { copy } from "@/lib/copy";
import { mapsEmbedQuery, mapsUrl, site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export function VisitSection({ locale }: { locale: Locale }) {
  const rows = weekRows(locale);

  return (
    <section
      className="lit halftone relative overflow-hidden bg-ocean-600 pb-20 pt-24 text-ocean-200 sm:pb-28 sm:pt-32"
      aria-labelledby="visit-heading"
      style={{ ["--lit-strength" as string]: "0.14", ["--dot-opacity" as string]: "0.14" }}
    >
      <PropScatter
        items={[
          { name: "lime", x: 3, y: 30, size: 3.4, rotate: -16, motion: "drift", opacity: 0.7 },
          { name: "star", x: 95, y: 24, size: 2.6, rotate: 10, motion: "spin", opacity: 0.6 },
          { name: "ice", x: 92, y: 80, size: 3.4, rotate: 14, motion: "bob", opacity: 0.55 },
        ]}
      />
      <WaveDivider className="absolute inset-x-0 top-0 h-14 sm:h-20" back="var(--color-ocean-400)" mid="var(--color-ocean-500)" front="var(--color-ocean-600)" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.visit.es}
          en={copy.headings.visit.en}
          titleId="visit-heading"
          tone="comida"
          body={copy.visit.body[locale]}
          onDark
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal from="left">
            <div className="paper-card h-full p-6 sm:p-8">
              <OpenStatus locale={locale} className="text-ink" />

              <h3 className="display mt-6 text-2xl text-ink">{copy.visit.addressTitle[locale]}</h3>
              <address className="mt-2 not-italic font-body text-lg leading-relaxed text-ink-soft">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
                <br />
                <span className="text-base">{site.crossStreets}</span>
              </address>

              <h3 className="display mt-7 text-2xl text-ink">{copy.visit.phoneTitle[locale]}</h3>
              <a
                href={site.phoneHref}
                className="mt-1 inline-block font-label text-2xl font-extrabold not-italic text-chamoy-500 underline decoration-mango-400 decoration-[3px] underline-offset-4"
              >
                {site.phone}
              </a>

              <h3 className="display mt-7 text-2xl text-ink">{copy.visit.hoursTitle[locale]}</h3>
              <dl className="mt-2 space-y-1.5">
                {rows.map((row) => (
                  <div
                    key={row.day}
                    className="flex justify-between gap-4 border-b border-ink/12 pb-1.5 font-body text-[15px] text-ink-soft"
                  >
                    <dt className="font-bold">{row.name}</dt>
                    <dd className="tabular-nums">
                      {row.open} to {row.close}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <MagneticButton href={mapsUrl} variant="solid" external className="flex-1">
                  {copy.visit.directions[locale]}
                </MagneticButton>
                <MagneticButton href={site.phoneHref} variant="cream" className="flex-1">
                  {copy.visit.callUs[locale]}
                </MagneticButton>
              </div>
            </div>
          </Reveal>

          <Reveal from="right">
            {/* The map is stuck to the page like a photograph, not dropped in
                as a widget: white border, a strip of tape, a slight angle. */}
            <div
              className="paper-card tape relative h-full min-h-[28rem] p-3"
              style={{ transform: "rotate(0.8deg)", ["--tape-tilt" as string]: "4deg" }}
            >
              {/* Pinned to the padded box rather than sized by it: the frame's
                  own height comes from the column beside it, which a
                  percentage height inside cannot resolve against. */}
              <div className="absolute inset-3 overflow-hidden rounded-[1.4rem]">
              <iframe
                title={copy.visit.mapTitle[locale]}
                src={`https://maps.google.com/maps?q=${mapsEmbedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
