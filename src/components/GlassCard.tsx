import type { ReactNode } from "react";

// V2 base surface primitive. Glass (blur) is reserved for elevated/floating
// panels per the design system notes in globals.css - this is the everyday
// card surface (opaque dark, subtle border), with an optional `glass` prop
// for the few contexts that want the blurred variant.
export default function GlassCard({
  children,
  className = "",
  glass = false,
  interactive = false,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  interactive?: boolean;
  as?: "div" | "section" | "article";
}) {
  const base = glass
    ? "glass"
    : "bg-surface border border-line";
  const hover = interactive
    ? "transition duration-200 hover:border-line-strong hover:-translate-y-0.5"
    : "";

  return (
    <Component className={`rounded-2xl ${base} ${hover} ${className}`}>
      {children}
    </Component>
  );
}
