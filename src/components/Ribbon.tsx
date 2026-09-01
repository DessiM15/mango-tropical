import { Marquee } from "./Marquee";

/**
 * A ticker on a tilted band, pinned across the seam between two sections.
 *
 * This is the one device that does the most against a page of stacked
 * rectangles: it is the only element that is not parallel to the sections
 * above and below it, and because it overhangs both, the seam it sits on stops
 * reading as a seam. The tilt is small on purpose - past about three degrees
 * the type starts to look like a mistake rather than a decision.
 */
export function Ribbon({
  text,
  tone = "magenta",
  tilt = -2,
  seconds = 38,
  reverse = false,
  className = "",
}: {
  text: string;
  tone?: "magenta" | "mango" | "chamoy" | "lime" | "ocean";
  tilt?: number;
  seconds?: number;
  reverse?: boolean;
  className?: string;
}) {
  const tones: Record<string, string> = {
    magenta: "bg-magenta-400 text-white",
    mango: "bg-mango-400 text-ink",
    chamoy: "bg-chamoy-500 text-white",
    lime: "bg-lime-400 text-ink",
    ocean: "bg-ocean-400 text-white",
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative z-20 select-none ${className}`}
    >
      <div
        className={`w-[108%] -translate-x-[4%] py-2.5 shadow-lift ring-2 ring-ink/70 sm:py-3 ${tones[tone]}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <Marquee
          text={text}
          seconds={seconds}
          reverse={reverse}
          itemClassName="display px-3 text-[clamp(1.1rem,2.4vw,1.6rem)]"
        />
      </div>
    </div>
  );
}
