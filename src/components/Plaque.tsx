import type { ReactNode } from "react";
import { money, type MenuCategory, type Price } from "@/lib/menu";
import type { Locale } from "@/lib/i18n";

/**
 * How the printed menu names and prices a product.
 *
 * It does not use a card. The photograph sits on the paper, a small wooden
 * plaque carries the name in script, and the price sits under the plaque in
 * heavy condensed type with the size beside it. That is the entire pattern,
 * repeated thirty times across six pages, and it is the thing that makes the
 * menu look like the menu.
 */

/** The name colour each section of the printed menu uses. */
const TONE: Record<MenuCategory["accent"], string> = {
  orange: "var(--color-head-fruit)",
  magenta: "var(--color-head-nieve-alt)",
  blue: "var(--color-head-float)",
  lime: "var(--color-head-comida)",
  yellow: "var(--color-head-garrafa)",
};

export function Plaque({
  children,
  accent = "orange",
  tilt = 0,
  className = "",
}: {
  children: ReactNode;
  accent?: MenuCategory["accent"];
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      className={`wood-plaque ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <span
        className="label-type block whitespace-nowrap text-[clamp(0.9rem,1.6vw,1.15rem)] leading-tight"
        style={{
          color: TONE[accent],
          WebkitTextStroke: "1.5px #fff",
          paintOrder: "stroke fill",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * The price line. Sizes in ink, amounts in red, both in the poster face, which
 * is how every price on the printed menu is set. Several sizes stack, because
 * that is what the menu does with a raspa.
 */
export function PrintedPrice({
  prices,
  locale,
  className = "",
  align = "center",
}: {
  prices: Price[];
  locale: Locale;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <dl
      className={`flex flex-col gap-0.5 ${align === "center" ? "items-center" : "items-start"} ${className}`}
    >
      {prices.map((price) => (
        <div key={price.label[locale]} className="flex items-baseline gap-2">
          <dt className="display text-[0.95em] leading-none text-ink [text-shadow:0_1px_0_rgb(255_255_255/0.6)]">
            {price.label[locale]}
          </dt>
          <dd className="display text-[1.15em] leading-none text-chamoy-500 [text-shadow:0_1px_0_rgb(255_255_255/0.7)]">
            {money(price.amount)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
