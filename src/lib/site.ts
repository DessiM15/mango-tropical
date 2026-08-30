/**
 * Single source of truth for the business's name, address and phone (NAP).
 * Local SEO depends on these matching the Google Business Profile character
 * for character, so nothing here should be reworded for style.
 */

/** Registered and waiting on the client. Used whenever the env var is unusable. */
const FALLBACK_URL = "https://mangotropicalhtx.com";

/**
 * Resolves the production origin.
 *
 * An environment variable that exists but is blank is the common case on a
 * hosting dashboard, and `??` does not catch it: an empty string is neither
 * null nor undefined, so it flows through and `new URL("")` throws during
 * prerender. Anything that is not a parseable absolute URL falls back.
 */
function resolveSiteUrl(): string {
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      // Not a usable URL, try the next candidate.
    }
  }

  return FALLBACK_URL;
}

export const site = {
  name: "Mango Tropical",
  legalName: "Mango Tropical",
  tagline: {
    en: "Authentic nieves de garrafa, mangonadas and raspas in Cypress, Texas.",
    es: "Auténticas nieves de garrafa, mangonadas y raspas en Cypress, Texas.",
  },
  // TODO: point NEXT_PUBLIC_SITE_URL at the real domain once it is registered.
  // mangotropicalhtx.com was confirmed available and matches their handle.
  url: resolveSiteUrl(),
  phone: "(346) 544-2451",
  phoneHref: "tel:+13465442451",
  address: {
    street: "20400 FM 529, Suite 100",
    city: "Cypress",
    region: "TX",
    regionName: "Texas",
    postalCode: "77433",
    country: "US",
  },
  crossStreets: "FM 529 at Fry Road",
  // Approximate, derived from the FM 529 and Fry Road intersection.
  // VERIFY against the Google Business Profile before launch.
  geo: { lat: 29.8836, lng: -95.706 },
  social: {
    instagram: "https://www.instagram.com/mangotropicalhtx/",
    facebook: "https://www.facebook.com/profile.php?id=61590548856676",
  },
  handle: "@mangotropicalhtx",
  priceRange: "$",
  servesCuisine: ["Mexican", "Ice Cream", "Dessert"],
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${addressLine}`,
)}`;

export const mapsEmbedQuery = encodeURIComponent(`${site.name}, ${addressLine}`);

/** Day indexes follow JavaScript's Date#getDay, so Sunday is 0. */
export type Hours = { open: string; close: string };

export const hours: Record<number, Hours> = {
  0: { open: "11:00", close: "22:30" }, // Sunday
  1: { open: "11:00", close: "21:30" },
  2: { open: "11:00", close: "21:30" },
  3: { open: "11:00", close: "21:30" },
  4: { open: "11:00", close: "21:30" },
  5: { open: "11:00", close: "22:30" }, // Friday
  6: { open: "11:00", close: "22:30" }, // Saturday
};

const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Groups consecutive days that share hours, the way Schema.org expects. */
export function openingHoursSpecification() {
  const groups: { days: string[]; open: string; close: string }[] = [];
  for (let day = 0; day < 7; day += 1) {
    const { open, close } = hours[day];
    const last = groups[groups.length - 1];
    if (last && last.open === open && last.close === close) {
      last.days.push(SCHEMA_DAYS[day]);
    } else {
      groups.push({ days: [SCHEMA_DAYS[day]], open, close });
    }
  }
  return groups.map((g) => ({
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: g.days,
    opens: g.open,
    closes: g.close,
  }));
}

export function formatTime(value: string, locale: "en" | "es") {
  const [h, m] = value.split(":").map(Number);
  if (locale === "es") return `${h}:${String(m).padStart(2, "0")}`;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}
