import type { ReactNode } from "react";
import type { ConceptId } from "@/lib/concepts";
import { ConceptProvider } from "./ConceptContext";

/**
 * Scopes a concept to its subtree two ways: a data attribute that drives the
 * token overrides in globals.css, and a context for the few components that
 * change shape rather than colour, such as the section headings.
 */
export function ConceptTheme({ concept, children }: { concept: ConceptId; children: ReactNode }) {
  return (
    <div data-concept={concept} className="bg-[var(--page-ground)]">
      <ConceptProvider concept={concept}>{children}</ConceptProvider>
    </div>
  );
}
