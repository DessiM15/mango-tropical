"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CupPreview } from "./CupPreview";
import { copy } from "@/lib/copy";
import { money } from "@/lib/menu";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import {
  BASES,
  CHAMOY,
  DEFAULT_BUILD,
  decodeBuild,
  describe,
  encodeBuild,
  FRUITS,
  priceOf,
  SIZES,
  TOPPING_OPTIONS,
  type Build,
  type Option,
} from "@/lib/builder";

function Chip({
  option,
  locale,
  selected,
  onSelect,
  showPrice = false,
}: {
  option: Option;
  locale: Locale;
  selected: boolean;
  onSelect: () => void;
  showPrice?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex items-center gap-2 rounded-full  px-4 py-2.5 font-label text-base font-extrabold not-italic transition-all duration-200 ${
        selected
          ? "-translate-y-0.5 bg-ink text-mango-300 shadow-lift"
          : "bg-sand-50 text-ink shadow-card hover:-translate-y-0.5"
      }`}
    >
      {option.color ? (
        <span
          className="h-4 w-4 shrink-0 rounded-full"
          style={{ background: option.color }}
          aria-hidden="true"
        />
      ) : null}
      <span>{option.name[locale]}</span>
      {showPrice && option.price > 0 ? (
        <span className={selected ? "text-sand-50/80" : "text-chamoy-500"}>
          +{money(option.price)}
        </span>
      ) : null}
    </button>
  );
}

function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t-2 border-dashed border-ink/25 pt-6 first:border-t-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-body text-sm font-black text-mango-300"
          aria-hidden="true"
        >
          {index}
        </span>
        <h3 className="display text-2xl text-ink">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </fieldset>
  );
}

export function BuildTool({ locale }: { locale: Locale }) {
  // A shared link carries the whole build, so it seeds the initial state.
  const searchParams = useSearchParams();
  const [build, setBuild] = useState<Build>(() => {
    const query = searchParams.toString();
    return query ? decodeBuild(query) : DEFAULT_BUILD;
  });
  const [copied, setCopied] = useState(false);

  // Keep the address bar in step so the page can be shared at any moment.
  useEffect(() => {
    const query = encodeBuild(build);
    window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
  }, [build]);

  const total = useMemo(() => priceOf(build), [build]);
  const summary = useMemo(() => describe(build, locale), [build, locale]);

  const toggle = useCallback((key: "fruits" | "toppings", id: string) => {
    setBuild((current) => {
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(id) ? list.filter((value) => value !== id) : [...list, id],
      };
    });
  }, []);

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}?${encodeBuild(build)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked. The address bar already holds the same link.
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10">
      <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
        <Step index={1} title={copy.build.steps.size[locale]}>
          {SIZES.map((option) => (
            <Chip
              key={option.id}
              option={option}
              locale={locale}
              selected={build.size === option.id}
              onSelect={() => setBuild((c) => ({ ...c, size: option.id }))}
            />
          ))}
        </Step>

        <Step index={2} title={copy.build.steps.base[locale]}>
          {BASES.map((option) => (
            <Chip
              key={option.id}
              option={option}
              locale={locale}
              selected={build.base === option.id}
              onSelect={() => setBuild((c) => ({ ...c, base: option.id }))}
            />
          ))}
        </Step>

        <Step index={3} title={copy.build.steps.fruit[locale]}>
          {FRUITS.map((option) => (
            <Chip
              key={option.id}
              option={option}
              locale={locale}
              selected={build.fruits.includes(option.id)}
              onSelect={() => toggle("fruits", option.id)}
            />
          ))}
        </Step>

        <Step index={4} title={copy.build.steps.chamoy[locale]}>
          {CHAMOY.map((option) => (
            <Chip
              key={option.id}
              option={option}
              locale={locale}
              selected={build.chamoy === option.id}
              onSelect={() => setBuild((c) => ({ ...c, chamoy: option.id }))}
              showPrice
            />
          ))}
        </Step>

        <Step index={5} title={copy.build.steps.toppings[locale]}>
          {TOPPING_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              option={option}
              locale={locale}
              selected={build.toppings.includes(option.id)}
              onSelect={() => toggle("toppings", option.id)}
              showPrice
            />
          ))}
        </Step>
      </div>

      <div className="lg:sticky lg:top-28">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-card">
          <div className="relative bg-ocean-100 px-6 py-7">
            <div className="mx-auto h-64 w-48">
              <CupPreview build={build} />
            </div>
          </div>

          <div className="p-6">
            <h2 className="display text-2xl text-ink">{copy.build.yourCreation[locale]}</h2>

            <ul className="mt-3 space-y-1.5">
              {summary.length > 0 ? (
                summary.map((line) => (
                  <li key={line} className="font-body text-[15px] leading-snug text-ink-soft">
                    {line}
                  </li>
                ))
              ) : (
                <li className="font-body text-[15px] italic text-ink-soft">
                  {copy.build.empty[locale]}
                </li>
              )}
            </ul>

            <p
              className="mt-5 flex items-baseline justify-between border-t-2 border-dashed border-ink/25 pt-4"
              aria-live="polite"
            >
              <span className="display text-2xl text-ink">{copy.build.total[locale]}</span>
              <span className="display text-4xl text-chamoy-500">{money(total)}</span>
            </p>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={share}
                className="w-full rounded-full bg-chamoy-400 px-5 py-3 font-label text-base font-extrabold not-italic uppercase tracking-wide text-white shadow-card transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {copied ? copy.build.copied[locale] : copy.build.copyLink[locale]}
              </button>
              <a
                href={site.phoneHref}
                className="block w-full rounded-full bg-sand-50 px-5 py-3 text-center font-label text-base font-extrabold not-italic uppercase tracking-wide text-ink shadow-card transition-transform hover:-translate-y-0.5"
              >
                {copy.build.callToOrder[locale]}
              </a>
              <button
                type="button"
                onClick={() => setBuild(DEFAULT_BUILD)}
                className="w-full py-1 font-body text-sm font-bold text-ink-soft underline underline-offset-4 hover:text-chamoy-500"
              >
                {copy.build.startOver[locale]}
              </button>
            </div>

            <p className="mt-4 font-body text-xs leading-relaxed text-ink-soft">
              {copy.build.counterNote[locale]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
