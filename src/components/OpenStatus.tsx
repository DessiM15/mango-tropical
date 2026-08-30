"use client";

import { useSyncExternalStore } from "react";
import { getOpenState } from "@/lib/openState";
import { formatTime } from "@/lib/site";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

/** Re-checks once a minute, which is often enough to catch opening and closing. */
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

/**
 * A primitive snapshot, because React compares snapshots by identity and a
 * fresh object on every call would loop forever.
 */
function getSnapshot() {
  const state = getOpenState();
  return `${state.isOpen ? "1" : "0"}|${state.boundary}`;
}

/** Nothing is known at prerender time, so the badge renders as a placeholder. */
function getServerSnapshot() {
  return "";
}

/**
 * Open or closed right now, worked out in the shop's timezone rather than the
 * visitor's. `useSyncExternalStore` gives the server a stable empty snapshot,
 * so the markup always hydrates cleanly.
 */
export function OpenStatus({ locale, className = "" }: { locale: Locale; className?: string }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!snapshot) {
    return <span className={`inline-block h-6 w-40 ${className}`} aria-hidden="true" />;
  }

  const [flag, boundary] = snapshot.split("|");
  const isOpen = flag === "1";
  const time = formatTime(boundary, locale);
  const label = isOpen
    ? `${copy.status.openNow[locale]} ${copy.status.until[locale]} ${time}`
    : `${copy.status.closed[locale]}. ${copy.status.opensAt[locale]} ${time}`;

  return (
    <span
      className={`inline-flex items-center gap-2 font-body text-sm font-bold sm:text-base ${className}`}
    >
      <span
        className={`relative flex h-2.5 w-2.5 shrink-0 ${isOpen ? "" : "opacity-70"}`}
        aria-hidden="true"
      >
        {isOpen ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
        ) : null}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOpen ? "bg-lime-400" : "bg-chamoy-400"}`}
        />
      </span>
      {label}
    </span>
  );
}
