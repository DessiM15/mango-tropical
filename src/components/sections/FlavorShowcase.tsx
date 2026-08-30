"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { ChamoyDrip } from "@/components/Dividers";
import { copy } from "@/lib/copy";
import { findCategory, type Text } from "@/lib/menu";
import type { Locale } from "@/lib/i18n";

type Group = { id: string; label: string; flavors: Text[] };

function flavorsOf(categorySlug: string, sectionSlug: string): Text[] {
  const section = findCategory(categorySlug)?.sections.find((s) => s.slug === sectionSlug);
  return section?.flavors ?? [];
}

/**
 * The flavour lists, set as a list rather than as a cloud of pills. A menu sets
 * its flavours in columns with rules between them; a tag cloud is what a filter
 * interface looks like, and it was the single thing making this page read as a
 * template.
 */
export function FlavorShowcase({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();

  const groups: Group[] = [
    { id: "nieves", label: copy.flavors.nieves[locale], flavors: flavorsOf("nieves-de-garrafa", "nieves") },
    { id: "raspas", label: copy.flavors.raspas[locale], flavors: flavorsOf("raspas", "raspas-snowballs") },
    { id: "naturales", label: copy.flavors.naturales[locale], flavors: flavorsOf("raspas", "raspas-naturales") },
    { id: "aguas", label: copy.flavors.aguas[locale], flavors: flavorsOf("bebidas", "aguas-frescas") },
  ];

  const [active, setActive] = useState(groups[0].id);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <section className="relative overflow-hidden bg-ocean-100 pb-20 pt-20 sm:pb-28 sm:pt-24" aria-labelledby="flavors-heading">
      <ChamoyDrip className="absolute inset-x-0 top-0 h-14 sm:h-20" fill="var(--color-ink)" />

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.flavors.es}
          en={copy.headings.flavors.en}
          titleId="flavors-heading"
          tone="float"
          body={copy.flavors.body[locale]}
        />

        <div
          className="mt-12 flex flex-wrap justify-center gap-x-9 gap-y-3 border-b border-ink/15 pb-4"
          role="tablist"
          aria-label={copy.flavors.title[locale]}
        >
          {groups.map((group) => {
            const selected = group.id === active;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                id={`flavor-tab-${group.id}`}
                aria-selected={selected}
                aria-controls={`flavor-panel-${group.id}`}
                onClick={() => setActive(group.id)}
                className={`relative pb-2 font-body text-sm font-extrabold uppercase tracking-[0.14em] transition-colors sm:text-base ${
                  selected ? "text-ink" : "text-ink-soft/55 hover:text-ink-soft"
                }`}
              >
                {group.label}
                {selected ? (
                  <motion.span
                    layoutId="flavor-underline"
                    className="absolute inset-x-0 -bottom-[17px] h-[3px] rounded-full bg-chamoy-500"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id={`flavor-panel-${current.id}`} aria-labelledby={`flavor-tab-${current.id}`}>
          <AnimatePresence mode="wait">
            <motion.ul
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {current.flavors.map((flavor, index) => (
                <motion.li
                  key={flavor.en}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : index * 0.035, duration: 0.5 }}
                  className="group flex items-baseline gap-4 border-b border-ink/12 py-3.5"
                >
                  <span className="font-body text-[13px] font-bold tabular-nums text-ink-soft/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="label-type text-xl text-ink transition-colors group-hover:text-chamoy-500 sm:text-2xl">
                    {flavor[locale]}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
