import Image from "next/image";

/**
 * A carved wooden frame, the way the mockup hangs a photo of the shop. Built
 * from the same plank treatment as the section plaques so the two match.
 */
export function FramedPhoto({
  src,
  alt,
  caption,
  tilt = -2,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  tilt?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={`wood-sign !rounded-[1.5rem] !p-4 sm:!p-5 ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-[3px] border-wood-700">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 92vw, 44vw"
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="label-type mt-3 text-center text-sm text-wood-700 sm:text-base">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
