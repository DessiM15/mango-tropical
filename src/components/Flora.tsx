import Image, { type StaticImageData } from "next/image";
import bananaLeaves from "../../public/flora/banana-leaves.webp";
import hibiscusPair from "../../public/flora/hibiscus-pair.webp";
import hibiscusYellow from "../../public/flora/hibiscus-yellow.webp";
import leavesWide from "../../public/flora/leaves-wide.webp";
import plumeriaCluster from "../../public/flora/plumeria-cluster.webp";
import plumeriaSpray from "../../public/flora/plumeria-spray.webp";

/**
 * Imported rather than referenced by path so Next reads each file's real
 * dimensions at build time. These cutouts have six different aspect ratios, and
 * declaring one shared size distorts them and shifts the layout as they load.
 */
const ART: Record<string, StaticImageData> = {
  "banana-leaves": bananaLeaves,
  "hibiscus-pair": hibiscusPair,
  "hibiscus-yellow": hibiscusYellow,
  "leaves-wide": leavesWide,
  "plumeria-cluster": plumeriaCluster,
  "plumeria-spray": plumeriaSpray,
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
 * A flower or leaf cluster cut out of the printed menu. Every page of the menu
 * is framed with these, so the sections carry the same framing.
 * Decorative only, so it stays out of the accessibility tree.
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
          sizes="(max-width: 640px) 45vw, 28vw"
          className="h-auto w-full drop-shadow-[0_8px_14px_rgb(42_18_6_/_0.2)]"
        />
      </div>
    </div>
  );
}
