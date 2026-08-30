import type { ReactNode } from "react";

export type HeadingTone = "fruit" | "nieve" | "comida" | "garrafa" | "float";

/** The colour pair the printed menu uses for each section's two headings. */
const TONES: Record<HeadingTone, { top: string; bottom: string }> = {
  fruit: { top: "var(--color-head-fruit)", bottom: "var(--color-head-fruit-alt)" },
  nieve: { top: "var(--color-head-nieve)", bottom: "var(--color-head-nieve-alt)" },
  comida: { top: "var(--color-head-comida)", bottom: "var(--color-head-comida-alt)" },
  garrafa: { top: "var(--color-head-garrafa)", bottom: "var(--color-head-garrafa-alt)" },
  float: { top: "var(--color-head-float)", bottom: "var(--color-head-float-alt)" },
};

type Props = {
  /** Shown on the top line, in the tone's first colour. */
  primary: string;
  /** Shown underneath, in the tone's second colour. Omit for a single line. */
  secondary?: string;
  tone?: HeadingTone;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** A degree or two of tilt, the way the plaques sit on the printed pages. */
  tilt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  children?: ReactNode;
};

const SIZES = {
  sm: "text-[clamp(1.15rem,3vw,1.9rem)]",
  md: "text-[clamp(1.6rem,4.4vw,3rem)]",
  lg: "text-[clamp(2rem,6vw,4.25rem)]",
  /* Hero only. The gap between this and `md` is the point: flat, evenly sized
     headings were a large part of why the page read cheap. */
  xl: "text-[clamp(2.2rem,5.6vw,4.9rem)]",
};

/**
 * A heading on a wooden plaque, exactly how every section of the printed menu
 * is titled: the Spanish name on top, the English underneath, each outlined in
 * heavy black with a hard drop shadow.
 */
export function WoodSign({
  primary,
  secondary,
  tone = "fruit",
  as: Tag = "h2",
  id,
  className = "",
  tilt = 0,
  size = "md",
  children,
}: Props) {
  const colours = TONES[tone];

  return (
    <div
      className={`wood-sign inline-block ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <div className="px-5 py-3 text-center sm:px-8 sm:py-4">
        <Tag id={id} className={`display leading-[0.95] ${SIZES[size]}`}>
          <span className="text-outline block" style={{ color: colours.top }}>
            {primary}
          </span>
          {secondary ? (
            <span className="text-outline mt-1 block" style={{ color: colours.bottom }}>
              {secondary}
            </span>
          ) : null}
        </Tag>
        {children}
      </div>
    </div>
  );
}
