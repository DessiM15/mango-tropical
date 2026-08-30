"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { path, type Locale } from "@/lib/i18n";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";
import { OpenStatus } from "./OpenStatus";
import { LocaleToggle } from "./LocaleToggle";

export function SiteHeader({
  locale,
}: {
  locale: Locale;
}) {
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
    { href: (path(locale, "menu")), label: copy.nav.menu[locale] },
    { href: (path(locale, "about")), label: copy.nav.about[locale] },
    { href: (path(locale, "visit")), label: copy.nav.visit[locale] },
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
            href={(path(locale, "home"))}
            className="flex shrink-0 items-center"
            aria-label={site.name}
          >
            {/* The badge already says Mango Tropical, so setting the name
                beside it in type was saying it twice. */}
            <Image
              src="/brand/logo-lockup.webp"
              alt=""
              width={1720}
              height={1472}
              priority
              className={`w-auto drop-shadow-[0_2px_3px_rgb(42_18_6_/_0.55)] drop-shadow-[0_6px_16px_rgb(42_18_6_/_0.4)] transition-[height] duration-300 ease-[var(--ease-out-soft)] ${
                scrolled ? "h-14 sm:h-16" : "h-16 sm:h-[5.75rem]"
              }`}
            />
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
            <LocaleToggle locale={locale} />

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
