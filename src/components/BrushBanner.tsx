import type { ReactNode } from "react";

/**
 * The painted swash the printed menu sets its lists on.
 *
 * Every list on the menu - the twelve nieve flavours, the eighteen raspa
 * flavours, the toppings, the bebidas - is white or yellow type dropped onto a
 * rough block of paint: red on page four, yellow and orange on page six. It is
 * never a box and never a card.
 *
 * Drawn rather than sliced. The menu's own swashes each fit one list at one
 * size; this one stretches to any list at any width.
 */

/**
 * One closed path: a torn top edge, down the right, a torn bottom edge back.
 *
 * Straight segments at a short interval, not curves at a long one. A curve
 * long enough to see is a wave, and the block starts reading as a blob; paint
 * thrown onto paper tears in short angular steps, so that is what these are.
 * Drawing a rectangle and laying a fringe over it does not work either - the
 * rectangle covers the fringe, and what is left is a rectangle.
 */
const BLOCK = [
  "M0 13.3L24 22.7L48 12.3L72 20.6L96 17.6L120 12.1L144 11.7L168 18.8L192 12.3L216 12.6",
  "L240 21.9L264 13.2L288 15.0L312 22.3L336 28.1L360 20.4L384 28.6L408 11.8L432 26.5L456 16.2",
  "L480 9.8L504 16.6L528 25.7L552 14.3L576 21.5L600 21.2L624 20.9L648 12.1L672 12.1L696 14.7",
  "L720 22.5L744 16.7L768 21.5L792 19.2L816 16.4L840 27.3L864 15.4L888 21.3L912 20.5L936 26.8",
  "L960 22.0L984 28.6L1008 13.1L1032 18.5L1056 24.6L1080 13.6L1104 11.7L1128 23.0L1152 24.8",
  "L1176 21.3L1200 24.9L1200 184.5L1176 181.4L1152 179.2L1128 186.1L1104 187.7L1080 183.0",
  "L1056 172.1L1032 183.6L1008 187.6L984 185.8L960 176.1L936 177.9L912 178.3L888 179.3",
  "L864 174.0L840 173.1L816 174.7L792 173.3L768 175.5L744 178.0L720 182.5L696 179.1L672 180.9",
  "L648 186.9L624 189.4L600 176.0L576 178.5L552 177.5L528 191.5L504 173.7L480 174.2L456 175.2",
  "L432 175.0L408 181.6L384 175.7L360 171.1L336 177.2L312 181.2L288 188.2L264 183.4L240 181.5",
  "L216 183.2L192 172.0L168 187.2L144 188.8L120 185.4L96 178.1L72 178.2L48 174.2L24 172.1",
  "L0 172.2Z",
].join("");

/** Thrown paint, off the edges the block does not reach. */
const SPATTER = [
  { x: 52, y: 9, r: 5 },
  { x: 1146, y: 192, r: 5.5 },
  { x: 1058, y: 195, r: 3.5 },
  { x: 664, y: 7, r: 4 },
];

export function BrushBanner({
  children,
  color = "var(--color-chamoy-500)",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    /* `isolate` matters. The paint was a negative z-index layer, which paints
       behind the nearest ancestor stacking context - and whether one existed
       depended on whether a parent happened to be mid-animation, so the block
       rendered in some places and vanished in others. Its own context, with
       the paint first and the list after it in document order, cannot. */
    <div className={`relative isolate ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <g fill={color}>
          <path d={BLOCK} />
          {SPATTER.map((drop) => (
            <circle key={`${drop.x}-${drop.y}`} cx={drop.x} cy={drop.y} r={drop.r} />
          ))}
        </g>
      </svg>

      <div className="relative px-7 py-9 sm:px-12 sm:py-11">{children}</div>
    </div>
  );
}
