type DripSpec = { x: number; r: number; len: number };

/** Hand placed so the drips read as poured rather than evenly spaced. */
const DRIPS: DripSpec[] = [
  { x: 40, r: 13, len: 26 },
  { x: 96, r: 9, len: 52 },
  { x: 168, r: 17, len: 14 },
  { x: 246, r: 11, len: 68 },
  { x: 320, r: 8, len: 30 },
  { x: 392, r: 15, len: 46 },
  { x: 470, r: 10, len: 18 },
  { x: 540, r: 13, len: 74 },
  { x: 616, r: 9, len: 34 },
  { x: 690, r: 16, len: 22 },
  { x: 764, r: 11, len: 58 },
  { x: 838, r: 8, len: 40 },
  { x: 906, r: 14, len: 16 },
  { x: 980, r: 10, len: 66 },
  { x: 1052, r: 12, len: 30 },
  { x: 1124, r: 9, len: 48 },
  { x: 1186, r: 14, len: 24 },
];

const DROPLETS = [
  { x: 128, y: 118, r: 5 },
  { x: 276, y: 132, r: 6.5 },
  { x: 512, y: 124, r: 4.5 },
  { x: 578, y: 142, r: 7 },
  { x: 812, y: 120, r: 5.5 },
  { x: 1008, y: 138, r: 6 },
];

/**
 * Chamoy pouring from the top edge of a section into the one below it. Sits at
 * the very top of the incoming section and takes that section's own color, so
 * the two grounds read as one continuous pour.
 */
export function ChamoyDrip({
  className = "",
  fill = "var(--color-chamoy-400)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={`pointer-events-none block w-full ${flip ? "rotate-180" : ""} ${className}`}
      viewBox="0 0 1200 150"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill={fill}>
        <rect x="0" y="0" width="1200" height="44" />
        {DRIPS.map((d) => (
          <g key={d.x}>
            <rect
              x={d.x - d.r * 0.55}
              y={36}
              width={d.r * 1.1}
              height={d.len}
              rx={d.r * 0.55}
            />
            <circle cx={d.x} cy={36 + d.len} r={d.r} />
          </g>
        ))}
        {DROPLETS.map((d) => (
          <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r} />
        ))}
      </g>
    </svg>
  );
}

/** Layered ocean used where the page descends toward the footer. */
export function WaveDivider({
  className = "",
  back = "var(--color-ocean-300)",
  mid = "var(--color-ocean-400)",
  front = "var(--color-ocean-600)",
}: {
  className?: string;
  back?: string;
  mid?: string;
  front?: string;
}) {
  return (
    <svg
      className={`pointer-events-none block w-full ${className}`}
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill={back}
        d="M0 62c92-34 184-34 276 0s184 34 276 0 184-34 276 0 184 34 276 0 96-24 96-24V160H0Z"
      />
      <path
        fill={mid}
        opacity="0.92"
        d="M0 92c110-30 220-30 330 0s220 30 330 0 220-30 330 0 210 26 210 26V160H0Z"
      />
      <path
        fill={front}
        d="M0 120c140-24 280-24 420 0s280 24 420 0 240-18 360-6V160H0Z"
      />
    </svg>
  );
}

/** Torn paper edge, echoing the ripped watercolor bands on the printed menu. */
export function TornEdge({
  className = "",
  fill = "var(--color-sand-50)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={`pointer-events-none block w-full ${flip ? "rotate-180" : ""} ${className}`}
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill={fill}
        d="M0 0h1200v26c-38 10-64-4-102 2s-58 16-96 10-56-18-94-14-62 18-100 16-56-16-94-14-64 18-102 14-56-18-94-16-62 16-100 12-58-16-96-12-62 14-100 8-58-16-96-12-40 8-40 8Z"
      />
    </svg>
  );
}
