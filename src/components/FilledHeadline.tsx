type Props = {
  lines: string[];
  /**
   * "art" clips an animated tropical plate inside the letters using real HTML
   * text, so the headline stays selectable, translatable and indexable.
   * "video" knocks the letters out of a solid plate laid over a <video>, for
   * when real in store footage is available.
   */
  fill?: "art" | "video";
  videoSrc?: string;
  posterSrc?: string;
  /** Must match the surrounding background for the video knockout to blend. */
  ground?: string;
  className?: string;
  id?: string;
};

const artStyle: React.CSSProperties = {
  backgroundImage: "url(/art/ocean-water.webp)",
  backgroundSize: "120% auto",
  backgroundPosition: "center 38%",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextStroke: "clamp(2px, 0.5vw, 5px) var(--color-ink)",
  paintOrder: "stroke fill",
  filter: "drop-shadow(6px 7px 0 rgb(42 18 6 / 0.28))",
};

/**
 * Sizes the headline from its longest line so it never wraps, which matters
 * because the Spanish headline contains spaces and the English one does not.
 * 0.52 is Anton's widest measured per-character advance at this letter-spacing
 * (MANGONADA measures 0.508em per character) plus a small safety margin.
 */
const ANTON_ADVANCE_EM = 0.52;

function fitFontSize(lines: string[]) {
  const longest = Math.max(...lines.map((line) => line.length), 1);
  const divisor = (longest * ANTON_ADVANCE_EM).toFixed(2);
  return `clamp(2.25rem, calc(min(68rem, 100vw - 2.5rem) / ${divisor}), 12.5rem)`;
}

export function FilledHeadline({
  lines,
  fill = "art",
  videoSrc,
  posterSrc,
  ground = "var(--color-sunset-500)",
  className = "",
  id,
}: Props) {
  if (fill === "video" && videoSrc) {
    return <VideoKnockout lines={lines} videoSrc={videoSrc} posterSrc={posterSrc} ground={ground} className={className} id={id} />;
  }

  return (
    <h1
      id={id}
      className={`display wave-shift text-center ${className}`}
      style={{ ...artStyle, fontSize: fitFontSize(lines) }}
    >
      {lines.map((line, index) => (
        <span key={line} className="block whitespace-nowrap">
          {line}
          {index < lines.length - 1 ? <span className="sr-only"> </span> : null}
        </span>
      ))}
    </h1>
  );
}

/**
 * Letters cut out of an opaque plate that covers the video. Everything outside
 * the letters is painted the section's own background colour, so the only place
 * the footage shows through is inside the type.
 */
function VideoKnockout({
  lines,
  videoSrc,
  posterSrc,
  ground,
  className,
  id,
}: Required<Pick<Props, "lines" | "videoSrc" | "ground">> & Pick<Props, "posterSrc" | "className" | "id">) {
  const lineHeight = 170;
  const height = lines.length * lineHeight + 40;
  const maskId = "headline-knockout";

  return (
    <div className={`relative isolate w-full ${className ?? ""}`}>
      <h1 id={id} className="sr-only">
        {lines.join(" ")}
      </h1>
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <svg
        className="block w-full"
        viewBox={`0 0 1200 ${height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <mask id={maskId}>
            <rect width="1200" height={height} fill="white" />
            {lines.map((line, index) => (
              <text
                key={line}
                x="600"
                y={index * lineHeight + lineHeight - 24}
                textAnchor="middle"
                fill="black"
                className="display"
                style={{ fontSize: 150, fontFamily: "var(--font-display)" }}
              >
                {line}
              </text>
            ))}
          </mask>
        </defs>
        <rect width="1200" height={height} fill={ground} mask={`url(#${maskId})`} />
      </svg>
    </div>
  );
}
