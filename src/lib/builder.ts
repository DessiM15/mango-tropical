import type { Locale, Text } from "./menu";

/**
 * Options and pricing for the Build Your Own tool.
 *
 * Every number here is derived from the printed menu rather than invented:
 * cup sizes use the nieve de garrafa cup prices, fruit costs the difference
 * between a plain 16 oz nieve ($7.50) and a Mangonada Tropical ($8.50), and
 * chamoy and toppings use the menu's $0.75 topping charge. The tool still
 * presents the result as an estimate, since the counter is the source of truth.
 */

export type Option = {
  id: string;
  name: Text;
  price: number;
  /** Rendered into the cup illustration. */
  color?: string;
};

export const SIZES: Option[] = [
  { id: "8", name: { en: "8 oz", es: "8 oz" }, price: 5.5 },
  { id: "12", name: { en: "12 oz", es: "12 oz" }, price: 6.5 },
  { id: "16", name: { en: "16 oz", es: "16 oz" }, price: 7.5 },
  { id: "32", name: { en: "32 oz", es: "32 oz" }, price: 13.5 },
];

export const BASES: Option[] = [
  { id: "mango", name: { en: "Mango", es: "Mango" }, price: 0, color: "#ffc61e" },
  { id: "mangonada", name: { en: "Mangonada", es: "Mangonada" }, price: 0, color: "#f79429" },
  { id: "limon", name: { en: "Limón", es: "Limón" }, price: 0, color: "#b7e06a" },
  { id: "tamarindo", name: { en: "Tamarindo", es: "Tamarindo" }, price: 0, color: "#c9793a" },
  { id: "guayaba", name: { en: "Guayaba", es: "Guayaba" }, price: 0, color: "#f6a8a0" },
  { id: "coco", name: { en: "Coco", es: "Coco" }, price: 0, color: "#fbf3e0" },
  { id: "vainilla-mexicana", name: { en: "Mexican Vainilla", es: "Vainilla Mexicana" }, price: 0, color: "#f4e2b6" },
  { id: "vainilla-gringa", name: { en: "Gringa Vainilla", es: "Vainilla Gringa" }, price: 0, color: "#fdf6e6" },
  { id: "fresa", name: { en: "Fresa", es: "Fresa" }, price: 0, color: "#f58ba8" },
  { id: "chocolate", name: { en: "Chocolate", es: "Chocolate" }, price: 0, color: "#7b4a2b" },
  { id: "cookies", name: { en: "Cookies & Cream", es: "Cookies & Cream" }, price: 0, color: "#d6ccc0" },
  { id: "bubblegum", name: { en: "Bubble Gum", es: "Bubble Gum" }, price: 0, color: "#7fd8f0" },
];

/** One dollar, the gap between a plain 16 oz nieve and a Mangonada Tropical. */
export const FRUIT_PRICE = 1;

export const FRUITS: Option[] = [
  { id: "mango", name: { en: "Mango", es: "Mango" }, price: FRUIT_PRICE, color: "#ffc61e" },
  { id: "sandia", name: { en: "Watermelon", es: "Sandía" }, price: FRUIT_PRICE, color: "#f4566b" },
  { id: "pepino", name: { en: "Cucumber", es: "Pepino" }, price: FRUIT_PRICE, color: "#a8d96a" },
  { id: "fresa", name: { en: "Strawberry", es: "Fresa" }, price: FRUIT_PRICE, color: "#e8354e" },
  { id: "pina", name: { en: "Pineapple", es: "Piña" }, price: FRUIT_PRICE, color: "#ffd84d" },
  { id: "jicama", name: { en: "Jicama", es: "Jícama" }, price: FRUIT_PRICE, color: "#f6ecd8" },
];

export const CHAMOY: Option[] = [
  { id: "none", name: { en: "None", es: "Sin chamoy" }, price: 0 },
  { id: "normal", name: { en: "Normal", es: "Normal" }, price: 0.75 },
  { id: "extra", name: { en: "Extra", es: "Extra" }, price: 1.5 },
];

export const TOPPING_OPTIONS: Option[] = [
  { id: "chile", name: { en: "Chile", es: "Chile" }, price: 0.75, color: "#d7392f" },
  { id: "lechera", name: { en: "Lechera", es: "Lechera" }, price: 0.75, color: "#fff6e2" },
  { id: "cacahuates", name: { en: "Peanuts", es: "Cacahuates" }, price: 0.75, color: "#c99a5b" },
  { id: "gomitas", name: { en: "Gummy Bears", es: "Gomitas de Oso" }, price: 0.75, color: "#5fc85f" },
  { id: "gusanos", name: { en: "Sour Worms", es: "Gusanos Ácidos" }, price: 0.75, color: "#f36ab5" },
  { id: "chispas", name: { en: "Sprinkles", es: "Chispas" }, price: 0.75, color: "#3fa9f5" },
  { id: "chocolate", name: { en: "Chocolate", es: "Chocolate" }, price: 0.75, color: "#5b3a22" },
  { id: "fresa-jarabe", name: { en: "Strawberry Syrup", es: "Jarabe de Fresa" }, price: 0.75, color: "#e33d5c" },
  { id: "caramelo", name: { en: "Caramel Syrup", es: "Jarabe de Caramelo" }, price: 0.75, color: "#c98a3c" },
  { id: "crema", name: { en: "Whipped Cream", es: "Crema Batida" }, price: 0.75, color: "#fffdf7" },
];

export type Build = {
  size: string;
  base: string;
  fruits: string[];
  chamoy: string;
  toppings: string[];
};

export const DEFAULT_BUILD: Build = {
  size: "16",
  base: "mango",
  fruits: ["mango"],
  chamoy: "normal",
  toppings: ["chile"],
};

function find(list: Option[], id: string) {
  return list.find((o) => o.id === id);
}

export function priceOf(build: Build): number {
  const size = find(SIZES, build.size)?.price ?? 0;
  const fruit = build.fruits.length > 0 ? FRUIT_PRICE : 0;
  const chamoy = find(CHAMOY, build.chamoy)?.price ?? 0;
  const toppings = build.toppings.reduce(
    (total, id) => total + (find(TOPPING_OPTIONS, id)?.price ?? 0),
    0,
  );
  return size + fruit + chamoy + toppings;
}

export function describe(build: Build, locale: Locale): string[] {
  const parts: string[] = [];
  const size = find(SIZES, build.size);
  const base = find(BASES, build.base);
  if (size && base) parts.push(`${size.name[locale]} ${base.name[locale]}`);

  const fruits = build.fruits.map((id) => find(FRUITS, id)?.name[locale]).filter(Boolean);
  if (fruits.length > 0) parts.push(fruits.join(", "));

  const chamoy = find(CHAMOY, build.chamoy);
  if (chamoy && chamoy.id !== "none") {
    parts.push(locale === "en" ? `${chamoy.name.en} chamoy` : `Chamoy ${chamoy.name.es.toLowerCase()}`);
  }

  const toppings = build.toppings.map((id) => find(TOPPING_OPTIONS, id)?.name[locale]).filter(Boolean);
  if (toppings.length > 0) parts.push(toppings.join(", "));

  return parts as string[];
}

/** Compact query string so a link reopens the exact build. */
export function encodeBuild(build: Build): string {
  const params = new URLSearchParams({
    s: build.size,
    b: build.base,
    c: build.chamoy,
  });
  if (build.fruits.length > 0) params.set("f", build.fruits.join("."));
  if (build.toppings.length > 0) params.set("t", build.toppings.join("."));
  return params.toString();
}

export function decodeBuild(search: string): Build {
  const params = new URLSearchParams(search);
  const list = (value: string | null, options: Option[]) =>
    (value ?? "")
      .split(".")
      .filter((id) => options.some((o) => o.id === id));

  const size = params.get("s");
  const base = params.get("b");
  const chamoy = params.get("c");

  return {
    size: SIZES.some((o) => o.id === size) ? size! : DEFAULT_BUILD.size,
    base: BASES.some((o) => o.id === base) ? base! : DEFAULT_BUILD.base,
    fruits: params.has("f") ? list(params.get("f"), FRUITS) : DEFAULT_BUILD.fruits,
    chamoy: CHAMOY.some((o) => o.id === chamoy) ? chamoy! : DEFAULT_BUILD.chamoy,
    toppings: params.has("t") ? list(params.get("t"), TOPPING_OPTIONS) : DEFAULT_BUILD.toppings,
  };
}

export function colorOf(list: Option[], id: string): string {
  return find(list, id)?.color ?? "#ffc61e";
}
