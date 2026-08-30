"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_CONCEPT, type ConceptId } from "@/lib/concepts";

const ConceptContext = createContext<ConceptId>(DEFAULT_CONCEPT);

export function ConceptProvider({
  concept,
  children,
}: {
  concept: ConceptId;
  children: ReactNode;
}) {
  return <ConceptContext.Provider value={concept}>{children}</ConceptContext.Provider>;
}

/** The design direction currently rendering. Defaults to the live site's. */
export function useConcept(): ConceptId {
  return useContext(ConceptContext);
}
