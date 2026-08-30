import MenuPage from "@/app/(site)/[locale]/menu/page";
import { CONCEPT_IDS } from "@/lib/concepts";

/**
 * The live menu page, rendered inside the concept theme from the layout above.
 * Rendering the real page rather than a copy keeps the comparison honest: what
 * changes between concepts is the design tokens, not the content.
 */
export function generateStaticParams() {
  return CONCEPT_IDS.map((concept) => ({ concept }));
}

export default function PreviewMenu() {
  return <MenuPage params={Promise.resolve({ locale: "en" })} />;
}
