"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger position when several Reveals sit in a row, in seconds. */
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  className?: string;
};

/**
 * Scroll reveal built on a class toggle rather than an inline opacity, so the
 * served HTML is fully visible. The hidden starting state is applied only when
 * the `js` class is on <html>, which an inline script sets before paint. No
 * JavaScript, or a failed hydration, leaves the content readable.
 */
export function Reveal({ children, delay = 0, from = "up", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-reveal={from}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
