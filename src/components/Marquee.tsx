type Props = {
  text: string;
  className?: string;
  /** Type size and colour of the running text. */
  itemClassName?: string;
  seconds?: number;
  reverse?: boolean;
};

/**
 * Infinite ticker. The text is duplicated once and the track translates
 * exactly -50%, so the seam never shows.
 */
export function Marquee({
  text,
  className = "",
  itemClassName = "display px-4 text-[clamp(1.75rem,5vw,3.25rem)]",
  seconds = 34,
  reverse = false,
}: Props) {
  return (
    <div className={`relative flex overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="marquee-track flex shrink-0 items-center whitespace-nowrap"
        style={{
          ["--marquee-duration" as string]: `${seconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <span className={itemClassName}>{text}</span>
        <span className={itemClassName}>{text}</span>
      </div>
    </div>
  );
}
