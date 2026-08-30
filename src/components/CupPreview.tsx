import { BASES, colorOf, FRUITS, TOPPING_OPTIONS, type Build } from "@/lib/builder";

/** Deterministic scatter so the illustration never reshuffles between renders. */
function scatter(seed: number, count: number) {
  const points: { x: number; y: number; r: number; rot: number }[] = [];
  let value = seed * 9301 + 49297;
  const next = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
  for (let i = 0; i < count; i += 1) {
    points.push({
      x: 44 + next() * 112,
      y: 52 + next() * 40,
      r: 7 + next() * 6,
      rot: next() * 90 - 45,
    });
  }
  return points;
}

const SIZE_SCALE: Record<string, number> = { "8": 0.8, "12": 0.9, "16": 1, "32": 1.18 };

/**
 * The cup assembling on screen: base nieve, fruit on top, chamoy poured over it
 * and toppings scattered across. Purely decorative, so it is hidden from
 * assistive technology and the written summary carries the real information.
 */
export function CupPreview({ build }: { build: Build }) {
  const baseColor = colorOf(BASES, build.base);
  const scale = SIZE_SCALE[build.size] ?? 1;
  const fruitPoints = scatter(build.fruits.length + 3, build.fruits.length * 4);
  const toppingPoints = scatter(build.toppings.length + 11, build.toppings.length * 5);
  const chamoyOpacity = build.chamoy === "extra" ? 0.95 : build.chamoy === "normal" ? 0.6 : 0;

  return (
    <svg
      viewBox="30 24 140 210"
      className="h-full w-full"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="cup-inside">
          <path d="M46 62h108l-13 150a14 14 0 0 1-14 12H73a14 14 0 0 1-14-12Z" />
        </clipPath>
        <linearGradient id="cup-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <g transform={`translate(100 250) scale(${scale}) translate(-100 -250)`}>
        {/* Nieve filling the cup */}
        <g clipPath="url(#cup-inside)">
          <rect x="40" y="70" width="120" height="170" fill={baseColor} />
          <rect x="40" y="70" width="120" height="170" fill="url(#cup-glass)" />
          {build.chamoy !== "none" ? (
            <path
              d="M52 96c16 26 30 8 44 30s26 6 40 26 14 18 14 18v-84H52Z"
              fill="var(--color-chamoy-500)"
              opacity={chamoyOpacity * 0.55}
            />
          ) : null}
        </g>

        {/* Cup outline */}
        <path
          d="M46 62h108l-13 150a14 14 0 0 1-14 12H73a14 14 0 0 1-14-12Z"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Mounded nieve above the rim */}
        <path
          d="M42 66c6-20 22-30 58-30s52 10 58 30Z"
          fill={baseColor}
          stroke="var(--color-ink)"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Fruit chunks */}
        {build.fruits.flatMap((fruitId, fruitIndex) =>
          fruitPoints
            .slice(fruitIndex * 4, fruitIndex * 4 + 4)
            .map((point, index) => (
              <rect
                key={`${fruitId}-${index}`}
                x={point.x}
                y={point.y - 24}
                width={point.r * 2}
                height={point.r * 1.7}
                rx={3}
                fill={colorOf(FRUITS, fruitId)}
                stroke="var(--color-ink)"
                strokeWidth="2.5"
                transform={`rotate(${point.rot} ${point.x + point.r} ${point.y - 24 + point.r})`}
              />
            )),
        )}

        {/* Chamoy poured over the top */}
        {build.chamoy !== "none" ? (
          <path
            d="M44 60c10-16 26-24 56-24s46 8 56 24c-8 10-18 4-24 12s-16 2-24 10-16 0-24-8-14 2-22-4-12 2-18-10Z"
            fill="var(--color-chamoy-500)"
            opacity={chamoyOpacity}
            stroke="var(--color-chamoy-600)"
            strokeWidth="2"
          />
        ) : null}

        {/* Toppings */}
        {build.toppings.flatMap((toppingId, toppingIndex) =>
          toppingPoints
            .slice(toppingIndex * 5, toppingIndex * 5 + 5)
            .map((point, index) => (
              <circle
                key={`${toppingId}-${index}`}
                cx={point.x + 8}
                cy={point.y - 26}
                r={Math.max(3.2, point.r * 0.42)}
                fill={colorOf(TOPPING_OPTIONS, toppingId)}
                stroke="var(--color-ink)"
                strokeWidth="2"
              />
            )),
        )}
      </g>
    </svg>
  );
}
