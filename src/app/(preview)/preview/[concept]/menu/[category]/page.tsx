import CategoryPage from "@/app/(site)/[locale]/menu/[category]/page";
import { CONCEPT_IDS } from "@/lib/concepts";
import { menu } from "@/lib/menu";

export function generateStaticParams() {
  return CONCEPT_IDS.flatMap((concept) =>
    menu.map((category) => ({ concept, category: category.slug })),
  );
}

export default async function PreviewCategory({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoryPage params={Promise.resolve({ locale: "en", category })} />;
}
