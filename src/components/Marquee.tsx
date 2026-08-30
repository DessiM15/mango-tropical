type Props = {
  text: string;
  className?: string;
  seconds?: number;
  reverse?: boolean;
};

/**
 * Infinite ticker. The text is duplicated once and the track translates
 * exactly -50%, so the seam never shows.
 */
export function Marquee({ text, className = "", seconds = 34, reverse = false }: Props) {
  return (
    <div className={`relative flex overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="marquee-track flex shrink-0 items-center whitespace-nowrap"
        style={{
          ["--marquee-duration" as string]: `${seconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <span className="display px-4 text-[clamp(1.75rem,5vw,3.25rem)]">{text}</span>
        <span className="display px-4 text-[clamp(1.75rem,5vw,3.25rem)]">{text}</span>
      </div>
    </div>
  );
}
