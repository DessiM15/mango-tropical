import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { menu } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";
import { addressLine, formatTime, hours, mapsUrl, site } from "@/lib/site";
import { WaveDivider } from "./Dividers";
import { OpenStatus } from "./OpenStatus";

const DAY_NAMES: Record<Locale, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
};

/** Week rows ordered Monday first, which is how people read a hours list. */
export function weekRows(locale: Locale) {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => ({
    day,
    name: DAY_NAMES[locale][day],
    open: formatTime(hours[day].open, locale),
    close: formatTime(hours[day].close, locale),
  }));
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const rows = weekRows(locale);

  return (
    <footer className="relative bg-ocean-800 text-ocean-100">
      <WaveDivider
        className="-mt-px h-16 rotate-180 sm:h-24"
        back="var(--color-ocean-600)"
        mid="var(--color-ocean-700)"
        front="var(--color-ocean-800)"
      />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3 lg:gap-14">
          <div>
            <Link href={path(locale, "home")} className="inline-flex items-center gap-3">
              <Image
                src="/logo.webp"
                alt=""
                width={206}
                height={206}
                className="h-16 w-16 rounded-full border-[3px] border-sand-50"
              />
              <span className="display text-3xl leading-none text-mango-300">
                Mango
                <br />
                Tropical
              </span>
            </Link>
            <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-ocean-100/90">
              {copy.footer.builtFor[locale]}
            </p>
            <div className="mt-5">
              <OpenStatus locale={locale} className="text-mango-300" />
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border-2 border-ocean-100/40 px-4 py-2 font-label text-sm font-extrabold uppercase not-italic transition-colors hover:border-mango-300 hover:text-mango-300"
              >
                Instagram
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border-2 border-ocean-100/40 px-4 py-2 font-label text-sm font-extrabold uppercase not-italic transition-colors hover:border-mango-300 hover:text-mango-300"
              >
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h2 className="display text-2xl text-mango-300">{copy.footer.find[locale]}</h2>
            <address className="mt-4 not-italic">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="block font-body text-base leading-relaxed underline decoration-mango-300 decoration-2 underline-offset-4 hover:text-mango-300"
              >
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </a>
              <a
                href={site.phoneHref}
                className="mt-3 block font-label text-xl font-extrabold not-italic hover:text-mango-300"
              >
                {site.phone}
              </a>
            </address>

            <h2 className="display mt-8 text-2xl text-mango-300">{copy.footer.hours[locale]}</h2>
            <dl className="mt-3 space-y-1.5 font-body text-[15px]">
              {rows.map((row) => (
                <div key={row.day} className="flex justify-between gap-4 border-b border-ocean-100/15 pb-1.5">
                  <dt>{row.name}</dt>
                  <dd className="tabular-nums text-ocean-100/85">
                    {row.open} to {row.close}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="display text-2xl text-mango-300">{copy.footer.explore[locale]}</h2>
            <ul className="mt-4 space-y-2.5 font-body text-base">
              {[
                { href: path(locale, "menu"), label: copy.nav.menu[locale] },
                { href: path(locale, "build"), label: copy.nav.build[locale] },
                { href: path(locale, "about"), label: copy.nav.about[locale] },
                { href: path(locale, "visit"), label: copy.nav.visit[locale] },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-mango-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="display mt-8 text-2xl text-mango-300">{copy.menuSection.kicker[locale]}</h2>
            <ul className="mt-4 space-y-2.5 font-body text-base">
              {menu.map((category) => (
                <li key={category.slug}>
                  <Link href={path(locale, "menu", category.slug)} className="hover:text-mango-300">
                    {category.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ocean-100/20 pt-6 font-body text-sm text-ocean-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. {copy.footer.rights[locale]}
          </p>
          <p className="sr-only">{addressLine}</p>
          <p>{site.crossStreets}</p>
        </div>
      </div>
    </footer>
  );
}
