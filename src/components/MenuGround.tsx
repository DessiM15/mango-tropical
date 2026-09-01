import Image from "next/image";
import type { ReactNode } from "react";

/**
 * A page of the printed menu, as a section.
 *
 * The menu is not a stack of coloured bands. It is one sheet of warm orange
 * paper, printed with a palm silhouette, with tropical foliage pushed hard
 * into the corners and a painted ocean washing across the foot of the page.
 * Products sit straight on that sheet at whatever size suits them, named on
 * little wooden plaques. There is not a card anywhere in it.
 *
 * This is that sheet. The paper and the falloff are CSS (see `.menu-paper`),
 * the foliage and the water are the menu's own artwork, cut out of the PDF by
 * scripts/extract_menu_world.py.
 */

/** Which corners get foliage. The print puts it in all four. */
export type Corner = "tl" | "tr" | "bl" | "br";

const CORNER_ART: Record<Corner, { src: string; w: number; h: number; className: string }> = {
  // Two pieces of artwork, flipped into four corners, which is what the
  // printed page does with them too.
  tl: {
    src: "/menu-world/leaves-corner.webp",
    w: 418,
    h: 220,
    className: "left-0 top-0 w-40 origin-top-left sm:w-64 lg:w-80",
  },
  tr: {
    src: "/menu-world/flowers-corner.webp",
    w: 576,
    h: 478,
    className: "right-0 top-0 w-32 -scale-x-100 sm:w-48 lg:w-60",
  },
  bl: {
    src: "/menu-world/flowers-corner.webp",
    w: 576,
    h: 478,
    className: "bottom-0 left-0 w-28 -scale-y-100 sm:w-40 lg:w-52",
  },
  br: {
    src: "/menu-world/leaves-corner.webp",
    w: 418,
    h: 220,
    className: "bottom-0 right-0 w-40 -scale-100 sm:w-64 lg:w-80",
  },
};

function Foliage({ corner }: { corner: Corner }) {
  const art = CORNER_ART[corner];
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute z-0 select-none ${art.className}`}>
      <Image
        src={art.src}
        alt=""
        width={art.w}
        height={art.h}
        sizes="(max-width: 640px) 40vw, 22vw"
        className="h-auto w-full drop-shadow-[0_10px_16px_rgb(42_18_6_/_0.22)]"
      />
    </div>
  );
}

/**
 * The painted ocean at the foot of a page.
 *
 * The wave is a drawn shape filled with a patch of the menu's own watercolour,
 * rather than a slice of the page. A slice is one width and one height; this
 * takes any, and the paint inside it is still the paint off the page.
 */
export function SurfEdge({
  className = "",
  id = "surf",
  flip = false,
}: {
  className?: string;
  id?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={`pointer-events-none block w-full ${flip ? "rotate-180" : ""} ${className}`}
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={`${id}-paint`}
          patternUnits="userSpaceOnUse"
          width="300"
          height="300"
          patternTransform="rotate(4)"
        >
          <image href="/menu-world/menu-water.webp" width="300" height="300" preserveAspectRatio="xMidYMid slice" />
        </pattern>
      </defs>

      {/* The body of the water, brought up in two swells. */}
      <path
        fill={`url(#${id}-paint)`}
        d="M0 96c86-30 168-42 262-28s170 52 268 50 176-46 272-52 218 22 288 44 110 30 110 30V200H0Z"
      />
      {/* Foam where it breaks, and the spray it throws off. */}
      <path
        fill="#fff"
        opacity="0.92"
        d="M0 100c86-30 168-42 262-28s170 52 268 50 176-46 272-52 218 22 288 44 110 30 110 30v14s-52-24-118-42-186-42-274-36-180 48-278 50-182-34-272-48S86 66 0 96Z"
      />
      <g fill="#fff" opacity="0.8">
        <circle cx="196" cy="84" r="6" />
        <circle cx="238" cy="72" r="4" />
        <circle cx="548" cy="128" r="5" />
        <circle cx="806" cy="66" r="6.5" />
        <circle cx="858" cy="80" r="4" />
        <circle cx="1044" cy="112" r="5" />
      </g>
    </svg>
  );
}

export function MenuGround({
  children,
  corners = ["tl", "tr"],
  /** The sandy foot of a page rather than its hot top. */
  sand = false,
  surf = false,
  className = "",
  id,
  labelledBy,
}: {
  children: ReactNode;
  corners?: Corner[];
  sand?: boolean;
  /** Ends the section with the menu's painted ocean. */
  surf?: boolean;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`menu-paper paper relative isolate overflow-hidden ${sand ? "menu-paper-sand" : ""} ${className}`}
    >
      {corners.map((corner) => (
        <Foliage key={corner} corner={corner} />
      ))}

      <div className="relative z-10">{children}</div>

      {surf ? <SurfEdge className="absolute inset-x-0 bottom-0 z-0 h-24 sm:h-32 lg:h-40" /> : null}
    </section>
  );
}
