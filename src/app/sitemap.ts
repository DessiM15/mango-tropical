import type { MetadataRoute } from "next";
import { locales, path, routes, type RouteKey } from "@/lib/i18n";
import { menu } from "@/lib/menu";
import { site } from "@/lib/site";

/**
 * Every page in both languages, each entry declaring its counterpart so search
 * engines pair the two language trees instead of treating them as duplicates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pageKeys = Object.keys(routes) as RouteKey[];
  const entries: MetadataRoute.Sitemap = [];

  const withAlternates = (key: RouteKey, sub: string | undefined, priority: number) => {
    for (const locale of locales) {
      entries.push({
        url: site.url + path(locale, key, sub),
        lastModified: new Date(),
        changeFrequency: key === "home" ? "weekly" : "monthly",
        priority,
        alternates: {
          languages: {
            "en-US": site.url + path("en", key, sub),
            "es-US": site.url + path("es", key, sub),
          },
        },
      });
    }
  };

  for (const key of pageKeys) {
    withAlternates(key, undefined, key === "home" ? 1 : key === "menu" ? 0.9 : 0.7);
  }

  for (const category of menu) {
    withAlternates("menu", category.slug, 0.8);
  }

  return entries;
}
