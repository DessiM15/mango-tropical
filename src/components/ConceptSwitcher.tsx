"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { conceptList, type ConceptId } from "@/lib/concepts";

/**
 * Flips between the four directions without losing your place: the current path
 * is carried across, so comparing the menu page in concept A against concept D
 * is one click rather than a re-navigation.
 */
export function ConceptSwitcher({ current }: { current: ConceptId }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const rest = pathname.replace(/^\/preview\/[^/]+/, "");
  const active = conceptList.find((concept) => concept.id === current);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3 print:hidden">
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#171009]/95 p-2 text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 font-body text-[11px] font-bold uppercase tracking-widest text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden="true" className={`transition-transform ${open ? "" : "rotate-180"}`}>
              ▾
            </span>
            Concepts
          </button>

          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
            {conceptList.map((concept) => {
              const selected = concept.id === current;
              return (
                <Link
                  key={concept.id}
                  href={`/preview/${concept.id}${rest}`}
                  aria-current={selected ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-body text-sm font-bold transition-colors ${
                    selected ? "bg-mango-400 text-ink" : "bg-white/8 text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-black ${
                      selected ? "bg-ink/85 text-mango-300" : "bg-white/15 text-white"
                    }`}
                  >
                    {concept.letter}
                  </span>
                  {concept.name}
                </Link>
              );
            })}
          </div>

          <Link
            href="/"
            className="hidden shrink-0 rounded-lg px-3 py-2 font-body text-sm font-bold text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:block"
          >
            Exit
          </Link>
        </div>

        {open && active ? (
          <p className="px-2.5 pb-1 pt-2 font-body text-[13px] leading-snug text-white/65">
            <span className="text-white/90">{active.premise}</span> Opens on {active.opens.toLowerCase()}.
          </p>
        ) : null}
      </div>
    </div>
  );
}
