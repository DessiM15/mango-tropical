/**
 * Watercolour paint blobs, the shapes the printed menu drops behind its price
 * lists and product shots. Drawn rather than sliced, because every splash on
 * the menu has text printed over it.
 */
const SHAPES = [
  "M104 8c26-3 41 20 59 34s33 23 31 49-22 38-32 58-25 41-51 41-44-21-62-35S6 128 8 100s17-41 29-59S78 11 104 8Z",
  "M96 6c30-4 52 16 68 36s28 30 26 56-24 34-40 52-30 44-56 40-38-28-56-44S8 118 12 92s22-36 34-54S66 10 96 6Z",
  "M100 10c24 0 48 10 62 30s30 32 28 60-24 40-44 54-36 36-60 30-32-32-50-48S6 122 10 96s14-40 28-56S76 10 100 10Z",
  "M108 8c28 2 38 24 56 38s34 20 32 48-26 36-36 56-28 42-54 38-40-26-58-42S8 122 10 94s20-38 32-56S80 6 108 8Z",
];

/** A few satellite droplets, so the blob reads as thrown paint. */
const DROPS = [
  [{ x: 14, y: 44, r: 5 }, { x: 186, y: 74, r: 7 }, { x: 62, y: 192, r: 4 }],
  [{ x: 190, y: 52, r: 6 }, { x: 8, y: 120, r: 5 }, { x: 150, y: 196, r: 6 }],
  [{ x: 20, y: 168, r: 6 }, { x: 178, y: 24, r: 5 }, { x: 196, y: 140, r: 4 }],
  [{ x: 6, y: 88, r: 5 }, { x: 168, y: 190, r: 6 }, { x: 96, y: 4, r: 4 }],
];

export function Splash({
  color,
  variant = 0,
  className = "",
  withDrops = true,
}: {
  color: string;
  variant?: number;
  className?: string;
  withDrops?: boolean;
}) {
  const index = ((variant % SHAPES.length) + SHAPES.length) % SHAPES.length;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill={color}>
        <path d={SHAPES[index]} />
        {withDrops
          ? DROPS[index].map((drop) => (
              <circle key={`${drop.x}-${drop.y}`} cx={drop.x} cy={drop.y} r={drop.r} />
            ))
          : null}
      </g>
    </svg>
  );
}
