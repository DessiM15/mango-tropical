"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { ChamoyDrip } from "@/components/Dividers";
import { copy } from "@/lib/copy";
import { findCategory, type Text } from "@/lib/menu";
import type { Locale } from "@/lib/i18n";

type Group = { id: string; label: string; flavors: Text[]; tone: string };

function flavorsOf(categorySlug: string, sectionSlug: string): Text[] {
  const section = findCategory(categorySlug)?.sections.find((s) => s.slug === sectionSlug);
  return section?.flavors ?? [];
}

export function FlavorShowcase({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();

  const groups: Group[] = [
    {
      id: "nieves",
      label: copy.flavors.nieves[locale],
      flavors: flavorsOf("nieves-de-garrafa", "nieves"),
      tone: "bg-mango-400 text-ink",
    },
    {
      id: "raspas",
      label: copy.flavors.raspas[locale],
      flavors: flavorsOf("raspas", "raspas-snowballs"),
      tone: "bg-ocean-400 text-white",
    },
    {
      id: "naturales",
      label: copy.flavors.naturales[locale],
      flavors: flavorsOf("raspas", "raspas-naturales"),
      tone: "bg-chamoy-400 text-white",
    },
    {
      id: "aguas",
      label: copy.flavors.aguas[locale],
      flavors: flavorsOf("bebidas", "aguas-frescas"),
      tone: "bg-lime-400 text-ink",
    },
  ];

  const [active, setActive] = useState(groups[0].id);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <section className="relative bg-ocean-100 pb-20 pt-24 sm:pb-28 sm:pt-32" aria-labelledby="flavors-heading">
      <ChamoyDrip className="absolute inset-x-0 top-0 h-14 sm:h-20" fill="var(--color-magenta-400)" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={copy.flavors.kicker[locale]}
          title={copy.flavors.title[locale]}
          titleId="flavors-heading"
          body={copy.flavors.body[locale]}
        />

        <div className="mt-12 flex flex-wrap justify-center gap-3" role="tablist" aria-label={copy.flavors.title[locale]}>
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
                className={`rounded-full border-[3px] border-ink px-5 py-2.5 font-label text-base font-extrabold not-italic uppercase tracking-wide transition-all duration-200 sm:text-lg ${
                  selected
                    ? `${group.tone} shadow-[4px_5px_0_0_var(--color-ink)] -translate-y-0.5`
                    : "bg-sand-50 text-ink shadow-[2px_3px_0_0_var(--color-ink)] hover:-translate-y-0.5"
                }`}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`flavor-panel-${current.id}`}
          aria-labelledby={`flavor-tab-${current.id}`}
          className="mt-10"
        >
          <AnimatePresence mode="wait">
            <motion.ul
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3"
            >
              {current.flavors.map((flavor, index) => (
                <motion.li
                  key={flavor.en}
                  initial={reduced ? false : { opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduced ? 0 : index * 0.028, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className={`rounded-full border-[3px] border-ink px-5 py-2.5 font-label text-base shadow-[4px_5px_0_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-2deg] sm:text-lg ${current.tone}`}
                >
                  {flavor[locale]}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
