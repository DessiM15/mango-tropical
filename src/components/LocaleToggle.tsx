"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateHref, locales, type Locale } from "@/lib/i18n";

/**
 * A real two-state control rather than a text link reading "Español".
 *
 * Clicking writes the choice to a cookie, which stops the Accept-Language
 * detection in the proxy from overriding a visitor who has already told us
 * which language they want.
 */
export function LocaleToggle({
  locale,
  className = "",
  tone = "onDark",
}: {
  locale: Locale;
  className?: string;
  tone?: "onDark" | "onLight";
}) {
  const pathname = usePathname();
  const other = alternateHref(pathname, locale);

  const shell =
    tone === "onDark"
      ? "bg-ink/35 ring-white/30 backdrop-blur-sm"
      : "bg-ink/10 ring-ink/15";
  const idle = tone === "onDark" ? "text-white/80 hover:text-white" : "text-ink/60 hover:text-ink";

  return (
    <div
      className={`inline-flex items-center rounded-full p-0.5 ring-1 ${shell} ${className}`}
      role="group"
      aria-label={locale === "en" ? "Language" : "Idioma"}
    >
      {locales.map((code) => {
        const active = code === locale;
        const label = code.toUpperCase();

        if (active) {
          return (
            <span
              key={code}
              aria-current="true"
              className="rounded-full bg-mango-400 px-3 py-1 font-body text-[13px] font-black tracking-wider text-ink shadow-soft sm:text-sm"
            >
              {label}
              <span className="sr-only">
                {code === "en" ? " (current language)" : " (idioma actual)"}
              </span>
            </span>
          );
        }

        return (
          <Link
            key={code}
            href={other}
            hrefLang={code}
            prefetch={false}
            onClick={() => {
              document.cookie = `mt_locale=${code}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={`rounded-full px-3 py-1 font-body text-[13px] font-black tracking-wider transition-colors sm:text-sm ${idle}`}
          >
            {label}
            <span className="sr-only">{code === "en" ? " English" : " Español"}</span>
          </Link>
        );
      })}
    </div>
  );
}
