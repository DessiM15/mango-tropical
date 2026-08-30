import AboutPage from "@/app/(site)/[locale]/about/page";
import { CONCEPT_IDS } from "@/lib/concepts";

export function generateStaticParams() {
  return CONCEPT_IDS.map((concept) => ({ concept }));
}

export default function PreviewStory() {
  return <AboutPage params={Promise.resolve({ locale: "en" })} />;
}
