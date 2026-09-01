"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { Splash } from "@/components/Splash";
import { BrushBanner } from "@/components/BrushBanner";
import { TornEdge } from "@/components/Dividers";
import { PropScatter } from "@/components/Confetti";
import { copy } from "@/lib/copy";
import { findCategory, type Text } from "@/lib/menu";
import type { Locale } from "@/lib/i18n";

type Group = {
  id: string;
  label: string;
  flavors: Text[];
  /** What that group is served in, shown beside the list. */
  art: string;
  paint: string;
};

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
    {
      id: "nieves",
      label: copy.flavors.nieves[locale],
      flavors: flavorsOf("nieves-de-garrafa", "nieves"),
      art: "/menu/nieve-mango.webp",
      paint: "var(--color-magenta-500)",
    },
    {
      id: "raspas",
      label: copy.flavors.raspas[locale],
      flavors: flavorsOf("raspas", "raspas-snowballs"),
      art: "/menu/snowball-blue.webp",
      paint: "var(--color-ocean-600)",
    },
    {
      id: "naturales",
      label: copy.flavors.naturales[locale],
      flavors: flavorsOf("raspas", "raspas-naturales"),
      art: "/menu/raspa-tropical.webp",
      paint: "var(--color-lime-600)",
    },
    {
      id: "aguas",
      label: copy.flavors.aguas[locale],
      flavors: flavorsOf("bebidas", "aguas-frescas"),
      art: "/menu/float-fanta.webp",
      paint: "var(--color-chamoy-500)",
    },
  ];

  const [active, setActive] = useState(groups[0].id);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    /* The page's rest stop: after four full-bleed colour panels, a quiet
       ground with the flavour lists on it. Quiet is not the same as flat, so
       it is torn off the panels above rather than butted against them, and it
       carries a few ingredients out in the margins where the list is not. */
    <section
      className="paper relative overflow-hidden bg-sand-100 pb-24 pt-28 sm:pb-28 sm:pt-32"
      aria-labelledby="flavors-heading"
    >
      <TornEdge className="absolute inset-x-0 top-0 h-10 sm:h-14" fill="var(--color-sand-100)" flip />
      <PropScatter
        items={[
          { name: "lime", x: 4, y: 14, size: 4, rotate: -12, motion: "drift", opacity: 0.5 },
          { name: "tamarindo", x: 92, y: 10, size: 3.6, rotate: 16, motion: "bob", opacity: 0.45 },
          { name: "mango", x: 90, y: 62, size: 4.4, rotate: -8, motion: "drift", opacity: 0.45 },
          { name: "chile", x: 3, y: 68, size: 3.4, rotate: 22, motion: "bob", opacity: 0.5 },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          es={copy.headings.flavors.es}
          en={copy.headings.flavors.en}
          titleId="flavors-heading"
          tone="float"
          body={copy.flavors.body[locale]}
        />

        {/* One row that scrolls sideways on a phone rather than four tabs that
            wrap onto two lines. The underline used to hang below the button on
            a negative offset, which on the wrapped layout landed it straight
            through the words on the row underneath; it now sits inside the
            button's own box, where it cannot reach anything else. */}
        <div
          className="-mx-4 mt-12 flex gap-7 overflow-x-auto border-b border-ink/15 px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:justify-center sm:gap-9 sm:px-0 [&::-webkit-scrollbar]:hidden"
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
                className={`relative shrink-0 whitespace-nowrap pb-2.5 font-body text-sm font-extrabold uppercase tracking-[0.14em] transition-colors sm:text-base ${
                  selected ? "text-ink" : "text-ink-soft/55 hover:text-ink-soft"
                }`}
              >
                {group.label}
                {selected ? (
                  <motion.span
                    layoutId="flavor-underline"
                    className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-chamoy-500"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`flavor-panel-${current.id}`}
          aria-labelledby={`flavor-tab-${current.id}`}
          className="grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:items-start"
        >
          {/* What the list is served in, swapping with the tab. Twelve names
              in a column is a document; the same twelve with the cup beside
              them is a menu. Held back to the widest layout, where the column
              it sits in is not stolen from the list. */}
          <div className="relative mt-10 hidden aspect-square lg:block">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`paint-${current.id}`}
                initial={reduced ? false : { opacity: 0, scale: 0.85, rotate: -10 }}
                animate={{ opacity: 0.95, scale: 1, rotate: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 1.08, rotate: 8 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Splash
                  color={current.paint}
                  variant={groups.findIndex((group) => group.id === current.id)}
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`art-${current.id}`}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-[10%]"
              >
                <Image
                  src={current.art}
                  alt=""
                  fill
                  sizes="15rem"
                  className="object-contain drop-shadow-[0_16px_18px_rgb(42_18_6/0.3)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The list, on paint. The printed menu never sets a flavour list as
              a numbered table with rules; it throws a block of colour down and
              drops the names onto it in white. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <BrushBanner color={current.paint}>
                <ul className="grid gap-x-8 text-center sm:grid-cols-2">
                  {current.flavors.map((flavor) => (
                    <li
                      key={flavor.en}
                      className="display py-1.5 text-[clamp(1.05rem,2.2vw,1.5rem)] text-white [text-shadow:0_2px_0_rgb(42_18_6/0.22)]"
                    >
                      {flavor[locale]}
                    </li>
                  ))}
                </ul>
              </BrushBanner>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
