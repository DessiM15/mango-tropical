import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Anton, Grandstander, Nunito } from "next/font/google";
import { ConceptTheme } from "@/components/ConceptTheme";
import { ConceptSwitcher } from "@/components/ConceptSwitcher";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CONCEPT_IDS, isConcept } from "@/lib/concepts";
import "../../../globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const grandstander = Grandstander({
  weight: ["800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-grandstander",
  display: "swap",
});
const nunito = Nunito({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#e67638",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Design previews get their own root layout so they can be themed per concept
 * without the live site's chrome wrapping them. They are never indexed and
 * never appear in the sitemap.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Design concepts",
};

export function generateStaticParams() {
  return CONCEPT_IDS.map((concept) => ({ concept }));
}

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ concept: string }>;
}) {
  const { concept: raw } = await params;
  if (!isConcept(raw)) notFound();

  return (
    <html
      lang="en-US"
      suppressHydrationWarning
      className={`${anton.variable} ${grandstander.variable} ${nunito.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <ConceptTheme concept={raw}>
          <SiteHeader locale="en" basePath={`/preview/${raw}`} />
          <main id="main" className="pb-24">
            {children}
          </main>
          <SiteFooter locale="en" basePath={`/preview/${raw}`} />
        </ConceptTheme>
        <ConceptSwitcher current={raw} />
      </body>
    </html>
  );
}
