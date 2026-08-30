import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  kicker: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "ink" | "light";
  /** Wired to the section's aria-labelledby. */
  titleId?: string;
  children?: ReactNode;
};

export function SectionHeading({
  kicker,
  title,
  body,
  align = "center",
  tone = "ink",
  titleId,
  children,
}: Props) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const titleColor = tone === "ink" ? "text-ink" : "text-sand-50";
  const bodyColor = tone === "ink" ? "text-ink-soft" : "text-sand-50/90";

  return (
    <Reveal className={`flex max-w-3xl flex-col ${alignment}`}>
      <span
        className={`label-type rounded-full border-[3px] border-ink px-4 py-1 text-sm uppercase tracking-wide shadow-[3px_3px_0_0_var(--color-ink)] sm:text-base ${
          tone === "ink" ? "bg-mango-400 text-ink" : "bg-sand-50 text-ink"
        }`}
      >
        {kicker}
      </span>
      <h2
        id={titleId}
        className={`display mt-5 text-[clamp(2.5rem,8vw,5.5rem)] ${titleColor} ${
          tone === "light" ? "[text-shadow:4px_4px_0_var(--color-ink)]" : ""
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p className={`mt-5 font-body text-lg leading-relaxed sm:text-xl ${bodyColor}`}>{body}</p>
      ) : null}
      {children}
    </Reveal>
  );
}
