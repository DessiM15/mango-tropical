import Image from "next/image";

/**
 * The hero ground: a sunset gradient with the menu's own palm silhouettes
 * framing both edges, which is exactly how every printed page is composed.
 * Kept out of the Hero client component so the images stay server rendered.
 */
export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-sunset-300)_0%,var(--color-sunset-400)_42%,var(--color-sunset-500)_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.55] mix-blend-multiply"
        style={{
          backgroundImage: "url(/art/paper-orange.webp)",
          backgroundSize: "560px auto",
        }}
      />

      <div className="absolute inset-y-0 left-0 w-[38%] max-w-[26rem] sm:w-[30%]">
        <Image
          src="/art/palms-left.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 38vw, 30vw"
          className="object-cover object-right [mask-image:linear-gradient(to_right,black_0%,black_45%,transparent_100%)]"
        />
      </div>

      <div className="absolute inset-y-0 right-0 w-[38%] max-w-[26rem] sm:w-[30%]">
        <Image
          src="/art/palms-right.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 38vw, 30vw"
          className="object-cover object-left [mask-image:linear-gradient(to_left,black_0%,black_45%,transparent_100%)]"
        />
      </div>

      {/* Settles the type against the ground without dulling the palms. */}
      <div className="absolute inset-0 bg-gradient-to-b from-sunset-600/25 via-transparent to-sunset-500/70" />
    </div>
  );
}
