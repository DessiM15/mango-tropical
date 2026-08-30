import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { money, type MenuCategory, type MenuItem } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

const ACCENTS: Record<MenuCategory["accent"], string> = {
  orange: "bg-sunset-400",
  magenta: "bg-magenta-400 text-white",
  blue: "bg-ocean-400 text-white",
  lime: "bg-lime-400",
  yellow: "bg-mango-400",
};

/** Big category tile used on the home page and the menu index. */
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
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border-[4px] border-ink bg-sand-50 shadow-[8px_10px_0_0_var(--color-ink)] transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-2 hover:rotate-[-1deg] focus-visible:-translate-y-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-[4px] border-ink">
        <Image
          src={category.image}
          alt={category.name[locale]}
          fill
          priority={priority}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
        />
        <span
          className={`label-type absolute left-4 top-4 rounded-full border-[3px] border-ink px-3.5 py-1 text-sm shadow-[3px_3px_0_0_var(--color-ink)] ${ACCENTS[category.accent]}`}
        >
          {category.kicker[locale]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="display text-3xl leading-none text-ink sm:text-4xl">{category.name[locale]}</h3>
        <p className="mt-3 line-clamp-3 font-body text-base leading-relaxed text-ink-soft">
          {category.intro[locale]}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t-2 border-dashed border-ink/25 pt-4">
          <span className="font-body text-sm font-bold uppercase tracking-wide text-ink-soft">
            {copy.menuSection.from[locale]} {money(cheapest)}
          </span>
          <span className="label-type rounded-full bg-ink px-4 py-1.5 text-sm text-mango-300 transition-colors group-hover:bg-chamoy-400 group-hover:text-white">
            {copy.menuSection.viewCategory[locale]}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** A single priced item. Used on the menu page and every category page. */
export function ItemCard({ item, locale }: { item: MenuItem; locale: Locale }) {
  return (
    <article className="group relative flex gap-4 rounded-3xl border-[3px] border-ink bg-sand-50 p-4 shadow-[5px_6px_0_0_var(--color-ink)] transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1.5 hover:rotate-[-0.6deg] sm:gap-5 sm:p-5">
      {item.image ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-[3px] border-ink sm:h-32 sm:w-32">
          <Image
            src={item.image}
            alt={item.name[locale]}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="label-type text-xl text-ink sm:text-2xl">{item.name[locale]}</h3>
          {item.seasonal ? (
            <span className="rounded-full border-2 border-ink bg-mango-300 px-2.5 py-0.5 font-body text-xs font-extrabold uppercase tracking-wide text-ink">
              {copy.menuSection.seasonal[locale]}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 font-body text-[15px] leading-relaxed text-ink-soft">
          {item.description[locale]}
        </p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {item.prices.map((price) => (
            <li
              key={price.label[locale]}
              className="flex items-baseline gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1"
            >
              <span className="font-body text-xs font-bold uppercase tracking-wide text-ink-soft">
                {price.label[locale]}
              </span>
              <span className="font-label text-base font-extrabold not-italic text-chamoy-500">
                {money(price.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
