import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { money, type MenuCategory, type MenuItem } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

const ACCENTS: Record<MenuCategory["accent"], string> = {
  orange: "bg-sunset-400 text-ink",
  magenta: "bg-magenta-400 text-white",
  blue: "bg-ocean-400 text-white",
  lime: "bg-lime-400 text-ink",
  yellow: "bg-mango-400 text-ink",
};

/** Big category tile used on the menu index. */
export function CategoryCard({
  category,
  locale,
  priority = false,
}: {
  category: MenuCategory;
  locale: Locale;
  priority?: boolean;
}) {
  const cheapest = Math.min(
    ...category.sections.flatMap((s) => s.items.flatMap((i) => i.prices.map((p) => p.amount))),
  );

  return (
    <Link
      href={path(locale, "menu", category.slug)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.image}
          alt={category.name[locale]}
          fill
          priority={priority}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
        />
        <span
          className={`label-type absolute left-4 top-4 rounded-full px-3.5 py-1 text-sm shadow-soft ${ACCENTS[category.accent]}`}
        >
          {category.kicker[locale]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-3xl leading-none text-ink">{category.name[locale]}</h3>
        <p className="mt-3 line-clamp-3 font-body text-[15px] leading-relaxed text-ink-soft">
          {category.intro[locale]}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/12 pt-4">
          <span className="font-body text-[13px] font-bold uppercase tracking-widest text-ink-soft/70">
            {copy.menuSection.from[locale]} {money(cheapest)}
          </span>
          <span className="font-body text-[13px] font-bold uppercase tracking-widest text-chamoy-500 transition-transform duration-500 group-hover:translate-x-1">
            {copy.menuSection.viewCategory[locale]} &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * One priced item, set the way a printed menu sets one: the name and the price
 * on the same line with a leader between them, and the description underneath.
 * Prices were previously bordered pills, which read as interface rather than
 * as a menu.
 */
export function ItemCard({ item, locale }: { item: MenuItem; locale: Locale }) {
  return (
    <article className="group flex gap-5 py-6">
      {item.image ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand-100 sm:h-28 sm:w-28">
          <Image
            src={item.image}
            alt={item.name[locale]}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-contain object-top p-1 transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="label-type text-xl text-ink sm:text-[1.35rem]">{item.name[locale]}</h3>
          {item.seasonal ? (
            <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.16em] text-chamoy-500">
              {copy.menuSection.seasonal[locale]}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 font-body text-[15px] leading-relaxed text-ink-soft">
          {item.description[locale]}
        </p>

        <dl className="mt-3.5 space-y-1.5">
          {item.prices.map((price) => (
            <div key={price.label[locale]} className="flex items-baseline gap-3">
              <dt className="font-body text-[13px] font-bold uppercase tracking-widest text-ink-soft/70">
                {price.label[locale]}
              </dt>
              <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-ink/25" />
              <dd className="label-type text-lg text-chamoy-500 tabular-nums">
                {money(price.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
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

/**
 * The three signature items, set at a completely different scale from
 * everything else on the page.
 *
 * Forty rows of name, description and price meant Solo Fries carried the same
 * weight as the Elote Chorreado. These three are what people come in for, so
 * they get a band of their own, a poster-scale cutout and room to breathe, and
 * the rest of the menu can be a tight list underneath.
 */
export function FeatureItem({
  item,
  locale,
  field,
  flip = false,
}: {
  item: MenuItem;
  locale: Locale;
  /** Solid colour field, taken from the printed menu's palette. */
  field: string;
  /** Puts the product on the right, so consecutive features do not repeat. */
  flip?: boolean;
}) {
  return (
    <article
      className={`relative grid items-center gap-6 overflow-hidden rounded-[2rem] p-7 sm:gap-10 sm:p-10 lg:grid-cols-2 ${field}`}
    >
      {item.image ? (
        <div className={`relative mx-auto w-full max-w-sm ${flip ? "lg:order-2" : ""}`}>
          <span
            aria-hidden="true"
            className="absolute inset-x-[20%] bottom-[3%] h-6 rounded-[50%] bg-ink/25 blur-xl"
          />
          <Image
            src={item.image}
            alt={item.name[locale]}
            width={900}
            height={900}
            sizes="(max-width: 1024px) 88vw, 30rem"
            className="relative h-auto w-full object-contain drop-shadow-[0_20px_26px_rgb(42_18_6/0.38)]"
          />
        </div>
      ) : null}

      <div className={flip ? "lg:order-1" : ""}>
        <h3 className="display text-[clamp(2rem,4.4vw,3.25rem)] leading-[0.95] text-white [text-shadow:3px_3px_0_rgb(42_18_6/0.35)]">
          {item.name[locale]}
        </h3>
        <p className="mt-4 max-w-md font-body text-lg leading-relaxed text-white/90">
          {item.description[locale]}
        </p>
        <dl className="mt-6 max-w-sm space-y-2">
          {item.prices.map((price) => (
            <div key={price.label[locale]} className="flex items-baseline gap-3">
              <dt className="font-body text-[13px] font-bold uppercase tracking-widest text-white/75">
                {price.label[locale]}
              </dt>
              <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-white/40" />
              <dd className="label-type text-2xl tabular-nums text-mango-300">
                {money(price.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
