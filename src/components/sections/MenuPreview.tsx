import { CategoryCard } from "@/components/MenuCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ChamoyDrip } from "@/components/Dividers";
import { copy } from "@/lib/copy";
import { menu } from "@/lib/menu";
import { path, type Locale } from "@/lib/i18n";

export function MenuPreview({ locale }: { locale: Locale }) {
  return (
    <section className="relative bg-sand-50 pb-20 pt-24 sm:pb-28 sm:pt-32" aria-labelledby="menu-heading">
      <ChamoyDrip className="absolute inset-x-0 top-0 h-14 sm:h-20" fill="var(--color-sunset-500)" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={copy.menuSection.kicker[locale]}
          title={copy.menuSection.title[locale]}
          titleId="menu-heading"
          body={copy.menuSection.body[locale]}
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.07} from="scale">
              <CategoryCard category={category} locale={locale} priority={index < 3} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <MagneticButton href={path(locale, "menu")} variant="solid">
            {copy.menuSection.viewAll[locale]}
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
