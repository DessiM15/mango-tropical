import VisitPage from "@/app/(site)/[locale]/visit/page";
import { CONCEPT_IDS } from "@/lib/concepts";

export function generateStaticParams() {
  return CONCEPT_IDS.map((concept) => ({ concept }));
}

export default function PreviewVisit() {
  return <VisitPage params={Promise.resolve({ locale: "en" })} />;
}
