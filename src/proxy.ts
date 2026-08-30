import { NextResponse, type NextRequest } from "next/server";
import { internalSegment, routes, type Locale } from "@/lib/i18n";

/**
 * English lives at the root and Spanish under /es, and each language uses its
 * own URL words (/our-story vs /es/nosotros). Next.js resolves one internal
 * route tree under /[locale], so this rewrites the public slug to the internal
 * one without ever changing the address bar.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Design previews sit outside the locale tree and have their own root layout.
  if (pathname === "/preview" || pathname.startsWith("/preview/")) {
    return NextResponse.next();
  }

  // First visit to the English root from a Spanish-preferring browser goes to
  // the Spanish tree. The cookie is written by the ES/EN toggle, so a visitor
  // who has picked a language is never sent somewhere else again.
  if (pathname === "/" && !request.cookies.has("mt_locale")) {
    const preferred = (request.headers.get("accept-language") ?? "")
      .split(",")[0]
      .trim()
      .toLowerCase();
    if (preferred.startsWith("es")) {
      const response = NextResponse.redirect(new URL(`/es${search}`, request.url));
      response.cookies.set("mt_locale", "es", { path: "/", maxAge: 31536000, sameSite: "lax" });
      return response;
    }
  }

  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const locale: Locale = isSpanish ? "es" : "en";
  const rest = isSpanish ? pathname.slice(3) : pathname;
  const segments = rest.split("/").filter(Boolean);

  // Home page for either language.
  if (segments.length === 0) {
    return NextResponse.rewrite(new URL(`/${locale}${search}`, request.url));
  }

  const [first, ...tail] = segments;
  const internal = internalSegment(locale, first);

  // Unknown first segment: let it fall through so the not-found page renders.
  if (internal === null) {
    return NextResponse.rewrite(new URL(`/${locale}/${segments.join("/")}${search}`, request.url));
  }

  // A localized slug used against the wrong language is not a real URL.
  const wrongLanguage =
    internal !== first &&
    (Object.keys(routes) as (keyof typeof routes)[]).some(
      (key) => routes[key][locale === "en" ? "es" : "en"] === first,
    );
  if (wrongLanguage) {
    return NextResponse.rewrite(new URL(`/${locale}/__not-found${search}`, request.url));
  }

  const target = [locale, internal, ...tail].filter(Boolean).join("/");
  return NextResponse.rewrite(new URL(`/${target}${search}`, request.url));
}

export const config = {
  // Everything except Next internals, API routes and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
