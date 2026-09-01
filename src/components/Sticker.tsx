import type { ReactNode } from "react";

/**
 * The starburst a shop window puts a price in. Points are generated rather
 * than drawn so the shape can be given any number of them; twenty-two reads as
 * a sunburst, ten reads as a sheriff's badge.
 */
function burstPath(points: number, outer: number, inner: number) {
  const step = Math.PI / points;
  const parts: string[] = [];
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${parts.join("")}Z`;
}

export function Starburst({
  className = "",
  fill = "var(--color-chamoy-400)",
  points = 22,
  ring,
}: {
  className?: string;
  fill?: string;
  points?: number;
  /** A second burst behind the first, turned slightly, in this colour. */
  ring?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      {ring ? (
        <path d={burstPath(points, 50, 39)} fill={ring} transform="rotate(8 50 50)" />
      ) : null}
      <path d={burstPath(points, ring ? 46 : 50, ring ? 36 : 39)} fill={fill} />
    </svg>
  );
}

/**
 * A price or a flash pinned to the corner of something, on the angle a sticker
 * gets pressed on at. Not a button and not a link: it is the shop shouting.
 */
export function Sticker({
  children,
  tone = "chamoy",
  tilt = -8,
  className = "",
}: {
  children: ReactNode;
  tone?: "chamoy" | "mango" | "lime" | "magenta" | "ocean";
  tilt?: number;
  className?: string;
}) {
  const tones: Record<string, string> = {
    chamoy: "bg-chamoy-500 text-white",
    mango: "bg-mango-400 text-ink",
    lime: "bg-lime-400 text-ink",
    magenta: "bg-magenta-400 text-white",
    ocean: "bg-ocean-400 text-white",
  };

  return (
    <span
      className={`label-type inline-block rounded-full px-3.5 py-1 text-sm shadow-soft ring-2 ring-ink/85 ${tones[tone]} ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}

/**
 * Text in a starburst, for the one thing on a page that should read as a
 * window flash. Sized by the caller; the type scales with the burst.
 */
export function BurstBadge({
  lines,
  className = "",
  fill = "var(--color-chamoy-400)",
  ring = "var(--color-mango-400)",
  tilt = -10,
}: {
  lines: string[];
  /**
   * Placement, size, and the type size. The badge sets no position of its own:
   * a `relative` here outranks a caller's `absolute` in Tailwind's cascade no
   * matter which order the two are written in.
   */
  className?: string;
  fill?: string;
  ring?: string;
  tilt?: number;
}) {
  return (
    <span
      className={`inline-grid place-items-center ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-hidden="true"
    >
      <Starburst className="col-start-1 row-start-1 h-full w-full" fill={fill} ring={ring} />
      <span className="col-start-1 row-start-1 flex flex-col items-center leading-[0.95]">
        {lines.map((line) => (
          <span
            key={line}
            className="display text-[1em] text-white [text-shadow:0_2px_0_rgb(42_18_6_/_0.35)]"
          >
            {line}
          </span>
        ))}
      </span>
    </span>
  );
}
