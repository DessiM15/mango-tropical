import Image from "next/image";
import { Plaque, PrintedPrice } from "./Plaque";
import { copy } from "@/lib/copy";
import type { MenuCategory, MenuItem } from "@/lib/menu";
import type { Locale } from "@/lib/i18n";

/**
 * One item, set the way the printed menu sets one.
 *
 * The menu has no cards, no rules and no dotted leaders. The cutout stands on
 * the paper, a small wooden plaque underneath carries the name, and the price
 * sits below that in heavy condensed type. Thirty of those across six pages is
 * the whole design.
 *
 * What the print does not have is descriptions, and the site needs them: they
 * are what a search engine reads and what somebody who has never had a
 * pepinada needs. So they go in, quietly, under the price.
 *
 * The sizes and the drops are what keep it from becoming a grid again. They
 * are picked off the item's position rather than at random, so the server and
 * the browser lay the page out identically.
 */
const SIZES = [1, 0.84, 0.95, 1.06, 0.88, 1.02];
const DROPS = [0, 1.9, 0.7, 2.4, 1.2, 0.3];
const TILTS = [-1.5, 1.2, -0.8, 1.8, -1.9, 0.9];

export function ItemCard({
  item,
  locale,
  accent = "orange",
  index = 0,
  feature = false,
}: {
  item: MenuItem;
  locale: Locale;
  /** Which category this belongs to, which sets the plaque's name colour. */
  accent?: MenuCategory["accent"];
  /** Position in the section, which sets its size, drop and tilt. */
  index?: number;
  /**
   * One of the three the shop is known for. The printed menu gives those a
   * bigger photograph on the same page rather than a different treatment, so
   * that is all this does.
   */
  feature?: boolean;
}) {
  const scale = feature ? 1.75 : SIZES[index % SIZES.length];
  const drop = feature ? 0 : DROPS[index % DROPS.length];
  const tilt = feature ? -1.5 : TILTS[index % TILTS.length];

  return (
    <article
      className="group flex flex-col items-center px-2 text-center"
      style={{ marginTop: `${drop}rem` }}
    >
      {item.image ? (
        <div
          className="relative w-full"
          style={{ height: `${11 * scale}rem` }}
        >
          <Image
            src={item.image}
            alt={item.name[locale]}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 18rem"
            className="object-contain drop-shadow-[0_14px_16px_rgb(42_18_6/0.35)] transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
          />
        </div>
      ) : null}

      <Plaque accent={accent} tilt={tilt} className={feature ? "-mt-4 sm:scale-125" : "-mt-3"}>
        {item.name[locale]}
      </Plaque>

      <PrintedPrice
        prices={item.prices}
        locale={locale}
        className={
          feature
            ? "mt-5 text-[clamp(1.15rem,2.2vw,1.65rem)]"
            : "mt-2.5 text-[clamp(0.95rem,1.5vw,1.2rem)]"
        }
      />

      {item.seasonal ? (
        <span className="display mt-1.5 text-sm text-magenta-500 [text-shadow:0_1px_0_rgb(255_255_255/0.6)]">
          {copy.menuSection.seasonal[locale]}
        </span>
      ) : null}

      <p
        className={`mt-2 font-body font-semibold leading-snug text-ink/85 [text-shadow:0_1px_0_rgb(255_255_255/0.45)] ${
          feature ? "max-w-[34rem] text-[16px]" : "max-w-[24rem] text-[14px]"
        }`}
      >
        {item.description[locale]}
      </p>
    </article>
  );
}

/**
 * A flavour or topping list. Set as columns of names, not as a cloud of pills
 * inside a dashed box, which is what a placeholder looks like.
 */
export function NameList({
  title,
  names,
  note,
  columns = 3,
}: {
  title: string;
  names: string[];
  note?: string;
  columns?: 2 | 3;
}) {
  return (
    <section className="border-y border-ink/12 py-7">
      <h3 className="font-body text-[13px] font-extrabold uppercase tracking-[0.18em] text-ink-soft/70">
        {title}
      </h3>
      <ul
        className={`mt-4 grid gap-x-10 gap-y-0 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}
      >
        {names.map((name) => (
          <li
            key={name}
            className="label-type border-b border-ink/10 py-2.5 text-lg text-ink last:border-b-0 sm:text-xl"
          >
            {name}
          </li>
        ))}
      </ul>
      {note ? <p className="mt-4 font-body text-sm italic text-ink-soft">{note}</p> : null}
    </section>
  );
}
