"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { alternateHref, path, type Locale } from "@/lib/i18n";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";
import { OpenStatus } from "./OpenStatus";

export function SiteHeader({
  locale,
  basePath = "",
}: {
  locale: Locale;
  /** Set inside a design preview so navigation stays within that concept. */
  basePath?: string;
}) {
  const to = (href: string) => (basePath ? `${basePath}${href === "/" ? "" : href}` || "/" : href);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: to(path(locale, "menu")), label: copy.nav.menu[locale] },
    { href: to(path(locale, "about")), label: copy.nav.about[locale] },
    { href: to(path(locale, "visit")), label: copy.nav.visit[locale] },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-bold focus:text-sand-50"
      >
        {copy.nav.skip[locale]}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-sunset-500/95 shadow-soft backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href={to(path(locale, "home"))}
            className="flex shrink-0 items-center gap-2.5"
            aria-label={site.name}
          >
            <Image
              src="/logo.webp"
              alt=""
              width={206}
              height={206}
              priority
              className="h-11 w-11 rounded-full sm:h-12 sm:w-12"
            />
            <span className="display hidden text-xl leading-none text-sand-50 [text-shadow:2px_2px_0_var(--color-ink)] sm:block sm:text-2xl">
              Mango
              <br />
              Tropical
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 font-label text-base font-extrabold uppercase not-italic tracking-wide transition-colors ${
                    active
                      ? "bg-ink text-mango-300"
                      : "text-sand-50 hover:bg-sand-50/20 [text-shadow:1px_1px_0_var(--color-ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            {/* Prefetch is off because this is the one link that crosses into
                the other language tree, and prefetching it makes the router ask
                for an RSC payload under the wrong tree. Clicking still works. */}
            <Link
              href={alternateHref(pathname, locale)}
              hrefLang={locale === "en" ? "es" : "en"}
              prefetch={false}
              className="rounded-full bg-mango-400 px-3 py-1.5 font-label text-sm font-extrabold uppercase not-italic text-ink shadow-card transition-transform hover:-translate-y-0.5 sm:px-4 sm:text-base"
            >
              {copy.nav.switchTo[locale]}
            </Link>

            <a
              href={site.phoneHref}
              className="hidden rounded-full bg-chamoy-400 px-4 py-1.5 font-label text-sm font-extrabold uppercase not-italic text-white shadow-card transition-transform hover:-translate-y-0.5 sm:inline-block sm:px-5 sm:text-base"
            >
              {copy.nav.call[locale]}
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-sand-50 shadow-card lg:hidden"
            >
              <span className="sr-only">{open ? copy.nav.close[locale] : copy.nav.open[locale]}</span>
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 block h-[3px] w-5 rounded bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-[3px] w-5 rounded bg-ink transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`absolute left-0 block h-[3px] w-5 rounded bg-ink transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* A `hidden` attribute loses to a `display:flex` utility, so the drawer
          is mounted only while it is open. */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 flex-col bg-sunset-500 pt-24 lg:hidden ${open ? "flex" : "hidden"}`}
      >
        <nav className="flex flex-col gap-2 px-6" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="display border-b-[3px] border-ink/25 py-4 text-4xl text-sand-50 [text-shadow:3px_3px_0_var(--color-ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-4 bg-ink/10 px-6 py-8">
          <OpenStatus locale={locale} className="text-sand-50" />
          <a
            href={site.phoneHref}
            className="block rounded-full bg-chamoy-400 py-4 text-center font-label text-xl font-extrabold uppercase not-italic text-white shadow-card"
          >
            {site.phone}
          </a>
        </div>
      </div>
    </>
  );
}
