import Link from "next/link";
import { copy } from "@/lib/copy";
import { path } from "@/lib/i18n";

/**
 * Rendered for any URL that does not resolve. The locale is not available to a
 * not-found boundary, so this page keeps both languages side by side.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-sunset-500 px-4 py-32 text-center">
      <div
        className="absolute inset-0 opacity-50 mix-blend-multiply"
        style={{ backgroundImage: "url(/scene/wet-sand-tile.webp)", backgroundSize: "cover" }}
        aria-hidden="true"
      />
      <div className="relative">
        <p className="display text-[clamp(4rem,18vw,11rem)] text-mango-300 [text-shadow:6px_6px_0_var(--color-ink)]">
          404
        </p>
        <h1 className="display mt-2 text-[clamp(2rem,7vw,4rem)] text-sand-50 [text-shadow:4px_4px_0_var(--color-ink)]">
          {copy.notFound.title.en}
        </h1>
        <p className="mx-auto mt-5 max-w-md font-body text-lg text-sand-50">
          {copy.notFound.body.en}
        </p>
        <p className="mx-auto mt-1 max-w-md font-body text-lg text-sand-50/80">
          {copy.notFound.body.es}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={path("en", "menu")}
            className="rounded-full bg-chamoy-400 px-7 py-3.5 font-label text-lg font-extrabold not-italic uppercase text-white shadow-card"
          >
            {copy.notFound.cta.en}
          </Link>
          <Link
            href={path("es", "menu")}
            className="rounded-full bg-sand-50 px-7 py-3.5 font-label text-lg font-extrabold not-italic uppercase text-ink shadow-card"
          >
            {copy.notFound.cta.es}
          </Link>
        </div>
      </div>
    </section>
  );
}
