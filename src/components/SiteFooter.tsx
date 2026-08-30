import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { menu } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";
import { addressLine, formatTime, hours, mapsUrl, site } from "@/lib/site";
import { WaveDivider } from "./Dividers";
import { Flora } from "./Flora";
import { OpenStatus } from "./OpenStatus";

const DAY_NAMES: Record<Locale, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
};

/** Week rows ordered Monday first, which is how people read an hours list. */
export function weekRows(locale: Locale) {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => ({
    day,
    name: DAY_NAMES[locale][day],
    open: formatTime(hours[day].open, locale),
    close: formatTime(hours[day].close, locale),
  }));
}

const SOCIALS = [
  {
    label: "Instagram",
    href: site.social.instagram,
    path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2Z",
  },
  {
    label: "Facebook",
    href: site.social.facebook,
    path: "M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1A22 22 0 0 0 14.3 4c-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V22Z",
  },
];

export function SiteFooter({
  locale,
}: {
  locale: Locale;
}) {
  const rows = weekRows(locale);

  return (
    <footer className="relative overflow-hidden bg-sand-100 text-ink">
      <WaveDivider
        className="h-14 sm:h-20"
        back="var(--color-ocean-400)"
        mid="var(--color-ocean-300)"
        front="var(--color-sand-100)"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-60"
        style={{ backgroundImage: "url(/scene/wet-sand-tile.webp)", backgroundSize: "cover" }}
      />
      <Flora name="palms" className="right-[-5%] top-[6%] w-36 opacity-60 sm:w-52" flip />
      <Flora name="flowers" className="bottom-[12%] left-[-6%] w-32 opacity-60 sm:w-44" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4 lg:gap-12">
          <div className="md:col-span-1">
            <Link href={(path(locale, "home"))} className="inline-flex items-center gap-3">
              <Image
                src="/logo.webp"
                alt=""
                width={206}
                height={206}
                className="h-16 w-16 rounded-full shadow-card"
              />
              <span className="display text-2xl leading-none text-ink">
                Mango
                <br />
                Tropical
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-body text-[15px] leading-relaxed text-ink-soft">
              {copy.footer.builtFor[locale]}
            </p>
            <div className="mt-4">
              <OpenStatus locale={locale} className="text-ink" />
            </div>
          </div>

          <div>
            <h2 className="display text-xl text-chamoy-500">{copy.footer.explore[locale]}</h2>
            <ul className="mt-4 space-y-2 font-body text-[15px]">
              {[
                { href: (path(locale, "menu")), label: copy.nav.menu[locale] },
                { href: (path(locale, "about")), label: copy.nav.about[locale] },
                { href: (path(locale, "visit")), label: copy.nav.visit[locale] },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-chamoy-500 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="display mt-7 text-xl text-chamoy-500">{copy.footer.follow[locale]}</h2>
            <div className="mt-3 flex gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-sand-50 shadow-card transition-transform hover:-translate-y-0.5 hover:bg-mango-300"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-ink" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="display text-xl text-chamoy-500">{copy.menuSection.kicker[locale]}</h2>
            <ul className="mt-4 space-y-2 font-body text-[15px]">
              {menu.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={(path(locale, "menu", category.slug))}
                    className="hover:text-chamoy-500 hover:underline"
                  >
                    {category.shortName[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="display text-xl text-chamoy-500">{copy.footer.find[locale]}</h2>
            <address className="mt-4 not-italic">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="block font-body text-[15px] leading-relaxed hover:text-chamoy-500 hover:underline"
              >
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </a>
              <a
                href={site.phoneHref}
                className="mt-3 block font-label text-xl font-extrabold not-italic text-chamoy-500 hover:underline"
              >
                {site.phone}
              </a>
            </address>

            <h2 className="display mt-7 text-xl text-chamoy-500">{copy.footer.hours[locale]}</h2>
            <dl className="mt-3 space-y-1 font-body text-[13.5px] text-ink-soft">
              {rows.map((row) => (
                <div key={row.day} className="flex justify-between gap-3">
                  <dt>{row.name}</dt>
                  <dd className="tabular-nums">
                    {row.open} to {row.close}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="relative bg-magenta-400 py-3.5">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 text-center font-body text-[13px] text-white sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. {copy.footer.rights[locale]}
          </p>
          <p>{site.crossStreets}</p>
          <p className="sr-only">{addressLine}</p>
        </div>
      </div>
    </footer>
  );
}
