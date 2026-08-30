/**
 * The site's assistant, built entirely from the data already on the site.
 *
 * There is no model behind this and no network call. It matches what a visitor
 * types against a keyword index built from the menu, the hours, the address and
 * the FAQ, and returns the entry that scores highest. If nothing scores well
 * enough it says so and offers the phone number. It cannot invent a price,
 * because every price it can say is read straight out of menu.ts.
 */
import { copy } from "./copy";
import { menu, money, TOPPING_PRICE, toppings, type Locale } from "./menu";
import { formatTime, mapsUrl, site } from "./site";
import { getOpenState } from "./openState";

export type Answer = {
  text: string;
  /** Optional deep link offered alongside the answer. */
  link?: { href: string; label: string };
};

type EntryKind = "item" | "faq" | "flavors" | "toppings" | "info";

type Entry = {
  /** Words that should pull this entry up. Matched after normalisation. */
  keywords: string[];
  /** Extra weight for entries that answer a whole class of question. */
  weight?: number;
  kind: EntryKind;
  answer: (locale: Locale) => Answer;
};

/**
 * "How much is a mangonada" and "what is a mangonada" share almost every word
 * that survives normalisation, so without reading the intent the FAQ entry wins
 * both. These words are checked against the raw question, before the stop list
 * strips them.
 */
const PRICE_INTENT = /\b(how much|price|prices|cost|costs|cheap|dollar|cuanto|cuestan|cuesta|precio|precios|vale)\b/;

/** Lowercases, strips accents and punctuation, collapses whitespace. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set(
  ("the a an of do you have is are what how much price cost does it that this and or for me i we my " +
    "el la los las un una de que cuanto cuesta cuestan tienen tiene es son y o para mi yo me").split(" "),
);

function tokens(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((word) => word.length > 1 && !STOP.has(word));
}

function priceLine(item: (typeof menu)[number]["sections"][number]["items"][number], locale: Locale) {
  return item.prices
    .map((price) => `${price.label[locale]} ${money(price.amount)}`)
    .join(" · ");
}

function buildEntries(): Entry[] {
  const entries: Entry[] = [];

  // Every menu item, with its own prices.
  for (const category of menu) {
    for (const section of category.sections) {
      for (const item of section.items) {
        entries.push({
          kind: "item",
          keywords: [
            ...tokens(item.name.en),
            ...tokens(item.name.es),
            ...tokens(item.description.en),
            ...tokens(category.shortName.en),
          ],
          answer: (locale) => ({
            text: `${item.name[locale]}: ${priceLine(item, locale)}. ${item.description[locale]}`,
            link: {
              href: locale === "en" ? `/menu/${category.slug}` : `/es/menu/${category.slug}`,
              label: category.shortName[locale],
            },
          }),
        });
      }

      // Flavour lists.
      if (section.flavors) {
        entries.push({
          kind: "flavors",
          keywords: [
            ...tokens(section.title.en),
            ...tokens(section.title.es),
            "flavor", "flavors", "flavour", "sabor", "sabores",
            ...section.flavors.flatMap((flavor) => tokens(flavor.en)),
          ],
          weight: 1.1,
          answer: (locale) => ({
            text: `${section.title[locale]}: ${section.flavors!.map((f) => f[locale]).join(", ")}.`,
            link: {
              href: locale === "en" ? `/menu/${category.slug}` : `/es/menu/${category.slug}`,
              label: category.shortName[locale],
            },
          }),
        });
      }
    }
  }

  // Toppings.
  entries.push({
    kind: "toppings",
    keywords: ["topping", "toppings", "extra", "extras", "add", "agregar", ...toppings.flatMap((t) => tokens(t.en))],
    answer: (locale) => ({
      text:
        locale === "en"
          ? `Toppings are ${money(TOPPING_PRICE)} each: ${toppings.map((t) => t.en).join(", ")}.`
          : `Los toppings cuestan ${money(TOPPING_PRICE)} cada uno: ${toppings.map((t) => t.es).join(", ")}.`,
    }),
  });

  // Hours, answered against the shop's clock rather than the visitor's.
  entries.push({
    kind: "info",
    keywords: ["hour", "hours", "open", "close", "closing", "opening", "today", "tonight", "now",
      "hora", "horario", "abierto", "abren", "cierran", "cierra", "hoy"],
    weight: 1.4,
    answer: (locale) => {
      const state = getOpenState();
      const time = formatTime(state.boundary, locale);
      const status = state.isOpen
        ? `${copy.status.openNow[locale]} ${copy.status.until[locale]} ${time}`
        : `${copy.status.closed[locale]} ${copy.status.opensAt[locale]} ${time}`;
      const week =
        locale === "en"
          ? `We open at 11 AM every day. Closing is 9:30 PM Monday through Thursday and 10:30 PM Friday through Sunday.`
          : `Abrimos a las 11 AM todos los días. Cerramos a las 9:30 PM de lunes a jueves y a las 10:30 PM de viernes a domingo.`;
      return { text: `${status}. ${week}` };
    },
  });

  // Address and directions.
  entries.push({
    kind: "info",
    keywords: ["where", "address", "located", "location", "directions", "map", "parking", "drive",
      "donde", "direccion", "ubicacion", "como", "llegar", "estacionamiento"],
    weight: 1.3,
    answer: (locale) => ({
      text:
        locale === "en"
          ? `We are at ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, in the centre at ${site.crossStreets}. There is parking right out front and a patio outside.`
          : `Estamos en ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, en el centro comercial de ${site.crossStreets}. Hay estacionamiento enfrente y patio afuera.`,
      link: { href: mapsUrl, label: locale === "en" ? "Open in Maps" : "Abrir en Maps" },
    }),
  });

  // Phone.
  entries.push({
    kind: "info",
    keywords: ["phone", "call", "number", "contact", "telefono", "llamar", "numero", "contacto"],
    weight: 1.3,
    answer: (locale) => ({
      text: locale === "en" ? `You can call us at ${site.phone}.` : `Puedes llamarnos al ${site.phone}.`,
      link: { href: site.phoneHref, label: site.phone },
    }),
  });

  // Every FAQ answer.
  for (const item of copy.faq.items) {
    entries.push({
      kind: "faq",
      keywords: [...tokens(item.q.en), ...tokens(item.q.es)],
      weight: 1.15,
      answer: (locale) => ({ text: item.a[locale] }),
    });
  }

  return entries;
}

let cached: Entry[] | null = null;
function entries(): Entry[] {
  if (!cached) cached = buildEntries();
  return cached;
}

/**
 * Scores every entry against the question and returns the best, or null when
 * nothing clears the bar. The threshold matters: answering confidently from a
 * single incidental word match is how this kind of bot starts lying.
 */
export function ask(question: string, locale: Locale): Answer | null {
  const asked = tokens(question);
  if (asked.length === 0) return null;

  // A question about price should land on something that has one.
  const wantsPrice = PRICE_INTENT.test(normalize(question));

  let best: { score: number; entry: Entry } | null = null;

  for (const entry of entries()) {
    const keywords = new Set(entry.keywords);
    let hits = 0;
    for (const word of asked) {
      if (keywords.has(word)) {
        hits += 1;
        continue;
      }
      // Catch plurals and near misses without matching on a shared prefix
      // short enough to be a coincidence.
      for (const keyword of keywords) {
        if (keyword.length >= 5 && (keyword.startsWith(word) || word.startsWith(keyword))) {
          hits += 0.6;
          break;
        }
      }
    }
    if (hits === 0) continue;
    let score = (hits / asked.length) * (entry.weight ?? 1);
    if (wantsPrice) {
      if (entry.kind === "item" || entry.kind === "toppings") score *= 1.9;
      if (entry.kind === "faq") score *= 0.45;
    }
    if (!best || score > best.score) best = { score, entry };
  }

  if (!best || best.score < 0.34) return null;
  return best.entry.answer(locale);
}
