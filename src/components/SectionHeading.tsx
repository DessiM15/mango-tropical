import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { WoodSign, type HeadingTone } from "./WoodSign";

type Props = {
  /** Spanish line, shown on top, the way the printed menu titles a section. */
  es: string;
  /** English line, shown underneath. */
  en: string;
  body?: string;
  align?: "left" | "center";
  tone?: HeadingTone;
  titleId?: string;
  tilt?: number;
  /** Body copy sits on a dark ground and needs the light treatment. */
  onDark?: boolean;
  children?: ReactNode;
};

/**
 * Every section is titled the way the menu titles one: a wooden plaque holding
 * the Spanish name over the English, both outlined in heavy black.
 */
export function SectionHeading({
  es,
  en,
  body,
  align = "center",
  tone = "fruit",
  titleId,
  tilt = -1,
  onDark = false,
  children,
}: Props) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <Reveal className={`flex max-w-3xl flex-col ${alignment}`}>
      <WoodSign primary={es} secondary={en} tone={tone} id={titleId} tilt={tilt} size="md" />
      {body ? (
        <p
          className={`mt-6 font-body text-lg leading-relaxed sm:text-xl ${
            onDark
              ? "text-sand-50 [text-shadow:0_2px_0_rgb(42_18_6_/_0.45)]"
              : "text-ink-soft"
          }`}
        >
          {body}
        </p>
      ) : null}
      {children}
    </Reveal>
  );
}
