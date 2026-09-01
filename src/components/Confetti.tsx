/**
 * The ingredients, drawn.
 *
 * Photographs of a mango chunk read as a photograph of a mango chunk; these
 * read as the printed menu, which draws its fruit rather than shooting it.
 * They are what fills the margins of a section, so a flat colour band has
 * something happening in it without another product competing with the one the
 * section is actually about.
 *
 * Every shape is drawn inside a 100x100 box, so one size prop places any of
 * them and the scatter below can treat them as interchangeable.
 */
export type PropName =
  | "mango"
  | "lime"
  | "chile"
  | "tamarindo"
  | "splat"
  | "star"
  | "ice"
  | "strawberry"
  | "corn";

const SHAPES: Record<PropName, React.ReactNode> = {
  // A cut cube of mango, two faces showing.
  mango: (
    <g>
      <path d="M18 34 52 14l32 18-34 22Z" fill="#ffd34d" />
      <path d="M16 36l34 20v30L16 66Z" fill="#f5a623" />
      <path d="M52 56l32-22v30L52 86Z" fill="#ffc61e" />
    </g>
  ),
  // Half a lime, flat edge down.
  lime: (
    <g>
      <path d="M6 62a44 44 0 0 1 88 0Z" fill="#8cc63f" />
      <path d="M14 62a36 36 0 0 1 72 0Z" fill="#d7ef9a" />
      <g stroke="#8cc63f" strokeWidth="3" strokeLinecap="round">
        <path d="M50 62V28M50 62 24 40M50 62l26-22M50 62 30 56M50 62l20-6" />
      </g>
    </g>
  ),
  // A dried chile, hooked stem.
  chile: (
    <g>
      <path
        d="M62 20c14 6 22 22 18 40s-20 32-34 30-20-16-16-30 18-34 32-40Z"
        fill="#e02a31"
      />
      <path
        d="M60 24c8 6 12 18 9 32s-13 24-22 23"
        stroke="#fa343b"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M62 20c-4-8 2-12 10-12"
        stroke="#6ba82c"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  ),
  // The tamarindo stick that stands in every mangonada.
  tamarindo: (
    <g>
      <rect x="40" y="14" width="20" height="26" rx="6" fill="#ffc61e" />
      <rect x="38" y="34" width="24" height="56" rx="10" fill="#8a4b22" />
      <g fill="#5f3115">
        <circle cx="46" cy="48" r="2.5" />
        <circle cx="55" cy="58" r="2.5" />
        <circle cx="45" cy="68" r="2.5" />
        <circle cx="54" cy="78" r="2.5" />
      </g>
    </g>
  ),
  // A thrown drop of chamoy.
  splat: (
    <g fill="#e02a31">
      <path d="M50 12c16-2 30 12 32 28s-8 34-26 40-34-6-40-22 4-32 18-40Z" />
      <circle cx="16" cy="20" r="6" />
      <circle cx="88" cy="72" r="7" />
      <circle cx="30" cy="90" r="5" />
    </g>
  ),
  star: (
    <path
      d="M50 6 62 38l34 2-26 22 9 33-29-19-29 19 9-33L4 40l34-2Z"
      fill="#ffc61e"
    />
  ),
  // A chip of shaved ice.
  ice: (
    <g>
      <path d="M50 10 84 40 70 86H30L16 40Z" fill="#a9e2f2" />
      <path d="M50 10 84 40 70 86 50 60Z" fill="#dcf3fb" />
    </g>
  ),
  strawberry: (
    <g>
      <path d="M50 30c20 0 32 14 32 28S66 92 50 92 18 72 18 58s12-28 32-28Z" fill="#e02a31" />
      <g fill="#ffeea8">
        <circle cx="40" cy="50" r="3" />
        <circle cx="58" cy="48" r="3" />
        <circle cx="50" cy="64" r="3" />
        <circle cx="34" cy="68" r="3" />
        <circle cx="65" cy="66" r="3" />
      </g>
      <path d="M50 32c-10-2-16-8-18-16 8 0 14 2 18 8 4-6 10-8 18-8-2 8-8 14-18 16Z" fill="#6ba82c" />
    </g>
  ),
  corn: (
    <g>
      <rect x="34" y="12" width="32" height="76" rx="16" fill="#ffc61e" />
      <g fill="#f0ad00">
        <circle cx="43" cy="28" r="3.4" />
        <circle cx="57" cy="28" r="3.4" />
        <circle cx="50" cy="40" r="3.4" />
        <circle cx="43" cy="52" r="3.4" />
        <circle cx="57" cy="52" r="3.4" />
        <circle cx="50" cy="64" r="3.4" />
        <circle cx="43" cy="76" r="3.4" />
        <circle cx="57" cy="76" r="3.4" />
      </g>
    </g>
  ),
};

export function Prop({
  name,
  className = "",
  rotate = 0,
}: {
  name: PropName;
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {SHAPES[name]}
    </svg>
  );
}

export type Placement = {
  name: PropName;
  /** Percentages of the section box. */
  x: number;
  y: number;
  /** Width, in rem. */
  size: number;
  rotate?: number;
  /** Which idle animation it takes, if any. */
  motion?: "bob" | "drift" | "spin";
  opacity?: number;
};

/**
 * Scatters props around the margins of a section.
 *
 * Everything is absolutely positioned against the section and hidden from
 * assistive technology; it is wallpaper, and it must never take a click from
 * what is underneath. Below `sm` the whole layer is dropped rather than
 * shrunk, because on a phone the margins these live in do not exist.
 */
export function PropScatter({
  items,
  className = "",
}: {
  items: Placement[];
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 hidden select-none overflow-hidden sm:block ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.size}rem`,
            opacity: item.opacity ?? 1,
          }}
        >
          <div
            className={
              item.motion === "bob"
                ? "bob"
                : item.motion === "drift"
                  ? "drift-slow"
                  : item.motion === "spin"
                    ? "spin-slow"
                    : ""
            }
            style={{ animationDelay: `${(index % 5) * 0.7}s` }}
          >
            <Prop
              name={item.name}
              rotate={item.rotate}
              className="h-auto w-full drop-shadow-[0_6px_10px_rgb(42_18_6_/_0.25)]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
