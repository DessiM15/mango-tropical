export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Page keys map to one internal Next.js route and to a public URL segment per
 * language. Spanish gets its own slugs because a Spanish page sitting on an
 * English URL competes for nothing.
 */
export const routes = {
  home: { route: "", en: "", es: "" },
  menu: { route: "menu", en: "menu", es: "menu" },
  about: { route: "about", en: "our-story", es: "nosotros" },
  visit: { route: "visit", en: "visit", es: "visita" },
} as const;

export type RouteKey = keyof typeof routes;

/** Public URL for a page, including the /es prefix for Spanish. */
export function path(locale: Locale, key: RouteKey, sub?: string): string {
  const segment = routes[key][locale];
  const parts = [locale === "en" ? "" : "es", segment, sub].filter(Boolean);
  return `/${parts.join("/")}` .replace(/\/{2,}/g, "/");
}

/** Maps a public URL segment back to the internal route segment. */
export function internalSegment(locale: Locale, segment: string): string | null {
  for (const key of Object.keys(routes) as RouteKey[]) {
    if (routes[key][locale] === segment) return routes[key].route;
  }
  return null;
}

/** The equivalent URL in the other language, for the language switcher. */
export function alternatePath(locale: Locale, key: RouteKey, sub?: string) {
  const other: Locale = locale === "en" ? "es" : "en";
  return path(other, key, sub);
}

export const localeLabel: Record<Locale, string> = { en: "English", es: "Español" };
export const htmlLang: Record<Locale, string> = { en: "en-US", es: "es-US" };

/**
 * Same page in the other language, worked out from the public URL. Used by the
 * language switch and by the hreflang tags.
 */
export function alternateHref(pathname: string, locale: Locale): string {
  const other: Locale = locale === "en" ? "es" : "en";
  const rest = locale === "es" ? pathname.replace(/^\/es(?=\/|$)/, "") : pathname;
  const segments = rest.split("/").filter(Boolean);

  if (segments.length === 0) return path(other, "home");

  const [first, ...tail] = segments;
  const key = (Object.keys(routes) as RouteKey[]).find((k) => routes[k][locale] === first);
  if (!key) return path(other, "home");

  return path(other, key, tail.join("/") || undefined);
}
