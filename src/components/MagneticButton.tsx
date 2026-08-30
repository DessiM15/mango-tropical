"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "cream";
  className?: string;
  external?: boolean;
};

const variants = {
  solid: "bg-chamoy-400 text-white border-ink hover:bg-chamoy-500",
  outline: "bg-transparent text-ink border-ink hover:bg-ink hover:text-sand-50",
  cream: "bg-sand-50 text-ink border-ink hover:bg-mango-300",
};

/**
 * A chunky sticker-style button that leans a few pixels toward the cursor.
 * The lean is pointer-only and is dropped entirely for reduced motion.
 */
export function MagneticButton({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * 0.22, y: y * 0.32 });
  }

  const classes = [
    "group relative inline-flex items-center justify-center gap-2",
    "rounded-full border-[3px] px-7 py-3.5 sm:px-9 sm:py-4",
    "font-label text-lg sm:text-xl not-italic font-extrabold uppercase tracking-wide",
    "shadow-[4px_5px_0_0_var(--color-ink)] transition-colors duration-200",
    "active:translate-y-[2px] active:shadow-[2px_3px_0_0_var(--color-ink)]",
    variants[variant],
    className,
  ].join(" ");

  const props = external ? { target: "_blank", rel: "noreferrer noopener" } : {};

  return (
    <Link
      ref={ref}
      href={href}
      className={classes}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`, transition: "transform 220ms cubic-bezier(0.22,1,0.36,1), background-color 200ms" }}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      {...props}
    >
      {children}
    </Link>
  );
}
