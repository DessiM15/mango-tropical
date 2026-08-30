"use client";

import { motion, type MotionValue } from "motion/react";

/**
 * The water the board is actually in.
 *
 * Every coordinate here is in the surfer art's own pixel space (971 x 809), read
 * off the board layer's silhouette, so the foam breaks over the rail instead of
 * floating somewhere near it. The viewBox is grown past that on the left and
 * bottom to leave room for the wake and the thrown spray; `SurfWash` is
 * positioned with the matching percentages so the two stay registered at any
 * size.
 *
 * Foam is drawn as lumpy outlines rather than as a run of circles. A row of
 * circles at an even pitch reads as a string of beads no matter how many of them
 * there are, which is exactly what the first pass of this looked like.
 */
const VIEW = { x: -200, y: -60, w: 1400, h: 940 };

/** Broken water piled against the underside of the board, tail to nose. Both
 *  edges are wobbled off the board's measured silhouette, so the mass hugs the
 *  rail without either edge reading as a drawn arc. */
const FOAM =
  "M28 731C38 727 70 752 91 758C112 764 132 767 153 768C174 769 195 764 216 765C237 766 258 768 279 772C299 775 320 788 341 788C362 788 383 770 404 770C425 770 446 785 466 787C487 789 508 786 529 784C550 781 571 774 592 770C613 766 634 762 654 759C675 755 696 753 717 749C738 746 759 742 780 738C801 734 821 730 842 725C863 719 895 700 905 705C915 710 915 742 905 754C895 767 863 770 842 778C821 786 801 798 780 802C759 806 738 800 717 802C696 804 675 811 654 812C634 813 613 808 592 809C571 809 550 811 529 815C508 819 487 831 466 832C446 833 425 823 404 822C383 820 362 820 341 822C320 825 299 837 279 837C258 837 237 826 216 823C195 820 174 820 153 818C132 816 112 817 91 810C70 803 38 791 28 778C18 765 18 734 28 731Z";

/** The trail he leaves behind. Broken into three puffs that fall away rather
 *  than one continuous shape, which at this size read as a spike, not water. */
const WAKE = [
  "M35 740C34 743 28 746 23 748C18 751 12 754 3 755C-5 756 -16 753 -26 753C-36 753 -45 755 -55 755C-64 754 -79 752 -83 750C-87 747 -81 743 -78 740C-75 737 -68 736 -65 733C-62 731 -65 725 -58 723C-52 722 -35 722 -26 723C-17 724 -11 727 -3 728C6 729 18 729 24 731C31 733 35 737 35 740Z",
  "M-77 731C-76 733 -90 734 -95 736C-99 738 -97 742 -101 743C-106 744 -117 745 -124 744C-131 744 -136 741 -141 740C-146 739 -148 738 -153 736C-158 735 -170 733 -171 731C-171 729 -160 727 -155 725C-151 724 -148 722 -143 721C-138 720 -130 718 -124 718C-118 718 -109 720 -105 721C-101 722 -102 725 -98 726C-93 728 -77 729 -77 731Z",
  "M-174 724C-173 725 -173 727 -175 728C-176 729 -178 731 -182 732C-186 732 -192 733 -196 732C-200 732 -205 732 -208 731C-211 730 -212 729 -215 727C-217 726 -224 725 -224 724C-224 723 -217 722 -215 721C-212 719 -213 717 -210 716C-207 716 -200 716 -196 716C-192 716 -187 716 -183 717C-180 718 -177 719 -175 720C-174 721 -174 723 -174 724Z",
];

/** How solid each puff stays as it falls behind him. */
const WAKE_FADE = [0.8, 0.55, 0.35];

/** Thrown off the tail, and a much smaller lick off the nose. Rotated so each
 *  streak lies along the arc rather than sitting on it as a dot. */
const SPRAY = [
  { x: -4, y: 694, rx: 34, ry: 16, rot: -38 },
  { x: 24, y: 662, rx: 22, ry: 10, rot: -30 },
  { x: -30, y: 668, rx: 24, ry: 11, rot: -42 },
  { x: -48, y: 640, rx: 29, ry: 13, rot: -46 },
  { x: -18, y: 616, rx: 18, ry: 8, rot: -44 },
  { x: -74, y: 620, rx: 20, ry: 9, rot: -50 },
  { x: -88, y: 592, rx: 25, ry: 11, rot: -52 },
  { x: -56, y: 566, rx: 15, ry: 7, rot: -50 },
  { x: -110, y: 562, rx: 20, ry: 9, rot: -56 },
  { x: -138, y: 522, rx: 15, ry: 7, rot: -60 },
  { x: -160, y: 486, rx: 10, ry: 5, rot: -62 },
];

/** Torn loose from the top of the plume. */
const DROPS = [
  { x: -174, y: 470, r: 6 },
  { x: -142, y: 450, r: 4.5 },
  { x: -198, y: 506, r: 4 },
  { x: -120, y: 486, r: 3.5 },
];

export function SurfWash({
  spray,
  lift,
  still,
}: {
  /** Fades and swells the thrown water as he picks up speed. */
  spray?: MotionValue<number>;
  lift?: MotionValue<number>;
  still: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      className="pointer-events-none absolute"
      style={{ left: "-20.6%", top: "-7.4%", width: "144.2%", height: "116.2%" }}
    >
      {/* The shadowed shoulder under the break, so the foam sits in the water
          rather than on top of it. */}
      <g fill="#bfe2ee" opacity="0.42">
        <path d={FOAM} transform="translate(0 13)" />
        {WAKE.map((d) => (
          <path key={d.slice(0, 12)} d={d} transform="translate(0 8)" />
        ))}
      </g>

      <path d={FOAM} fill="#ffffff" opacity="0.82" />

      {/* Group opacity carries the fade, the path's own carries the ride, and
          the two multiply — setting both on one element would not. */}
      {WAKE.map((d, i) => (
        <g key={d.slice(0, 12)} opacity={WAKE_FADE[i]}>
          <motion.path
            d={d}
            fill="#ffffff"
            style={still || !spray ? { opacity: 1 } : { opacity: spray }}
          />
        </g>
      ))}

      <motion.g
        fill="#ffffff"
        style={
          still || !spray
            ? { opacity: 0.55 }
            : {
                opacity: spray,
                scale: lift,
                transformBox: "fill-box",
                transformOrigin: "70% 100%",
              }
        }
      >
        {SPRAY.map((s) => (
          <ellipse
            key={`${s.x}-${s.y}`}
            cx={s.x}
            cy={s.y}
            rx={s.rx}
            ry={s.ry}
            transform={`rotate(${s.rot} ${s.x} ${s.y})`}
          />
        ))}
        {DROPS.map((d) => (
          <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r} />
        ))}
      </motion.g>
    </svg>
  );
}
