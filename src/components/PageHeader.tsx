import { Reveal } from "./Reveal";

/**
 * Shared banner for every interior page. Uses the sunset ground and the palm
 * frame so a landing page still reads as part of the same poster.
 */
export function PageHeader({
  kicker,
  title,
  body,
  children,
}: {
  kicker: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-sunset-500 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-sunset-400)_0%,var(--color-sunset-500)_100%)]" />
        <div
          className="absolute inset-0 opacity-50 mix-blend-multiply"
          style={{ backgroundImage: "url(/art/paper-orange.webp)", backgroundSize: "520px auto" }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-center">
          <span className="label-type rounded-full border-[3px] border-ink bg-mango-400 px-4 py-1 text-sm uppercase tracking-wide text-ink shadow-[3px_3px_0_0_var(--color-ink)] sm:text-base">
            {kicker}
          </span>
          <h1 className="display mt-5 text-[clamp(2.75rem,9vw,6rem)] text-sand-50 [text-shadow:5px_5px_0_var(--color-ink)]">
            {title}
          </h1>
          {body ? (
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-sand-50 [text-shadow:0_2px_0_rgb(42_18_6_/_0.4)] sm:text-xl">
              {body}
            </p>
          ) : null}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
