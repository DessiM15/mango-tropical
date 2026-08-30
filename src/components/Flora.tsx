import Image, { type StaticImageData } from "next/image";
import flowers from "../../public/scene/flowers-cluster.webp";
import palms from "../../public/scene/palm-fronds.webp";
import hibiscus from "../../public/scene/hibiscus-pair.webp";

/**
 * Imported rather than referenced by path so Next reads each file's real
 * dimensions at build time. These have different aspect ratios, and declaring
 * one shared size distorts them and shifts the layout as they load.
 */
const ART: Record<string, StaticImageData> = {
  flowers,
  palms,
  hibiscus,
};

export type FloraName = keyof typeof ART;

type Props = {
  name: FloraName;
  /** Tailwind classes placing and sizing it. */
  className: string;
  flip?: boolean;
  rotate?: number;
  /** Adds a slow idle drift, matching the rest of the page's motion. */
  drift?: boolean;
  priority?: boolean;
  opacity?: number;
};

/**
 * A photographed flower or frond cluster, keyed off its green backdrop.
 * Decorative only, so it stays out of the accessibility tree.
 *
 * Two of these were generated as corner arrangements, so they carry a straight
 * cut along two edges. Those cuts have to point off-screen or they show as a
 * ruled line through the middle of the page:
 *
 *   flowers   cut along bottom and left  -> bottom corners, flip on the right
 *   palms     cut along top and left     -> top corners, flip on the right
 *   hibiscus  no cut edges               -> anywhere
 */
export function Flora({
  name,
  className,
  flip = false,
  rotate = 0,
  drift = false,
  priority = false,
  opacity = 1,
}: Props) {
  const source = ART[name];
  const transform = [flip ? "scaleX(-1)" : "", rotate ? `rotate(${rotate}deg)` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ transform: transform || undefined, opacity }}
    >
      <div className={drift ? "drift-slow" : ""}>
        <Image
          src={source}
          alt=""
          priority={priority}
          sizes="(max-width: 640px) 38vw, 22vw"
          className="h-auto w-full drop-shadow-[0_14px_22px_rgb(42_18_6_/_0.3)]"
        />
      </div>
    </div>
  );
}
