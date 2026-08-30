/**
 * Four design directions, built as one site rather than four.
 *
 * Every concept shares the routes, the menu data and the copy. What differs is
 * the hero, the order the sections run in, and a handful of design tokens. That
 * keeps four complete, clickable sites maintainable, and makes the comparison
 * honest: the only variable is the design.
 */

export const CONCEPT_IDS = ["storefront", "beach", "menu-first", "macro"] as const;
export type ConceptId = (typeof CONCEPT_IDS)[number];

export const DEFAULT_CONCEPT: ConceptId = "beach";

/** Sections a home page can be built from, in any order. */
export type SectionId =
  | "categories"
  | "favorites"
  | "menu"
  | "flavors"
  | "reviews"
  | "story"
  | "faq"
  | "visit";

export type Concept = {
  id: ConceptId;
  letter: string;
  name: string;
  /** The one-line argument for this direction. */
  premise: string;
  /** What a visitor sees before they scroll. */
  opens: string;
  sections: SectionId[];
};

export const concepts: Record<ConceptId, Concept> = {
  storefront: {
    id: "storefront",
    letter: "A",
    name: "Storefront",
    premise: "This is a real place. Come here.",
    opens: "A full-bleed photograph of the shop",
    sections: ["categories", "favorites", "story", "flavors", "reviews", "faq", "visit"],
  },
  beach: {
    id: "beach",
    letter: "B",
    name: "Beach Scene",
    premise: "This is what the brand feels like.",
    opens: "A tropical scene with the product on the shoreline",
    sections: ["categories", "favorites", "flavors", "reviews", "story", "faq", "visit"],
  },
  "menu-first": {
    id: "menu-first",
    letter: "C",
    name: "Menu First",
    premise: "Here is the food and here is what it costs.",
    opens: "A compact banner, then the menu itself",
    sections: ["menu", "categories", "reviews", "story", "faq", "visit"],
  },
  macro: {
    id: "macro",
    letter: "D",
    name: "Product Macro",
    premise: "Look how good this looks.",
    opens: "One product filling the whole frame",
    sections: ["favorites", "categories", "flavors", "reviews", "story", "faq", "visit"],
  },
};

export function isConcept(value: string): value is ConceptId {
  return (CONCEPT_IDS as readonly string[]).includes(value);
}

export const conceptList = CONCEPT_IDS.map((id) => concepts[id]);
