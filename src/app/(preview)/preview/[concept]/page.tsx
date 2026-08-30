import { notFound } from "next/navigation";
import { ConceptHome } from "@/components/ConceptHome";
import { CONCEPT_IDS, isConcept } from "@/lib/concepts";

export function generateStaticParams() {
  return CONCEPT_IDS.map((concept) => ({ concept }));
}

export default async function PreviewHome({ params }: { params: Promise<{ concept: string }> }) {
  const { concept: raw } = await params;
  if (!isConcept(raw)) notFound();
  return <ConceptHome concept={raw} locale="en" />;
}
