import { TropicalHero } from "@/components/sections/TropicalHero";
import { StorefrontHero } from "@/components/sections/StorefrontHero";
import { MenuFirstHero } from "@/components/sections/MenuFirstHero";
import { MacroHero } from "@/components/sections/MacroHero";
import { CategoryRow } from "@/components/sections/CategoryRow";
import { Favorites } from "@/components/sections/Favorites";
import { HomeMenu } from "@/components/sections/HomeMenu";
import { FlavorShowcase } from "@/components/sections/FlavorShowcase";
import { ReviewWall } from "@/components/sections/ReviewWall";
import { StoryStrip } from "@/components/sections/StoryStrip";
import { FaqSection } from "@/components/sections/FaqSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { concepts, type ConceptId, type SectionId } from "@/lib/concepts";
import type { Locale } from "@/lib/i18n";

const HEROES: Record<ConceptId, (props: { locale: Locale }) => React.ReactNode> = {
  storefront: StorefrontHero,
  beach: TropicalHero,
  "menu-first": MenuFirstHero,
  macro: MacroHero,
};

const SECTIONS: Record<SectionId, (props: { locale: Locale }) => React.ReactNode> = {
  categories: CategoryRow,
  favorites: Favorites,
  menu: HomeMenu,
  flavors: FlavorShowcase,
  reviews: ReviewWall,
  story: StoryStrip,
  faq: FaqSection,
  visit: VisitSection,
};

/**
 * Composes a home page from a concept's hero and its section order. Every
 * concept draws from the same section components and the same data, so what
 * differs between them is the design rather than the content.
 */
export function ConceptHome({ concept, locale }: { concept: ConceptId; locale: Locale }) {
  const Hero = HEROES[concept];
  const order = concepts[concept].sections;

  return (
    <>
      <Hero locale={locale} />
      {order.map((id) => {
        const Section = SECTIONS[id];
        return <Section key={id} locale={locale} />;
      })}
    </>
  );
}
