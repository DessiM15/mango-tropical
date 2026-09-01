"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Every page opens at the top, and opens there instantly.
 *
 * Two separate things were going wrong. On a refresh the browser restored the
 * old scroll offset, which is handled before first paint by the inline script
 * in the layout turning scroll restoration off. On a navigation the router
 * scrolls to the top itself - but `scroll-behavior: smooth` was set globally,
 * so that jump animated, and a new page appeared to open at the bottom and
 * scroll up to meet you.
 *
 * So smooth scrolling is not global any more. It is a class this component
 * takes off before the jump and puts back on the frame after, which leaves it
 * on for the only thing that actually wants it: the in-page category links on
 * the menu.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    // A hash in the URL is a request to land somewhere specific, so it is the
    // one case where the top of the page is the wrong answer.
    if (window.location.hash) return;

    root.classList.remove("smooth-scroll");
    window.scrollTo(0, 0);
    const frame = requestAnimationFrame(() => root.classList.add("smooth-scroll"));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
