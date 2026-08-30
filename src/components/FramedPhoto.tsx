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
  aspect = "aspect-[4/3]",
  position = "object-center",
}: {
  src: string;
  alt: string;
  caption?: string;
  tilt?: number;
  className?: string;
  priority?: boolean;
  /** Match the frame to the photo, so a portrait shot is not cropped to a strip. */
  aspect?: string;
  position?: string;
}) {
  return (
    <figure
      className={`wood-sign !rounded-[1.5rem] !p-4 sm:!p-5 ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className={`relative ${aspect} overflow-hidden rounded-xl`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 92vw, 44vw"
          className={`object-cover ${position}`}
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
