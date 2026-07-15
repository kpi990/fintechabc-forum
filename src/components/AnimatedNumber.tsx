"use client";

import { useEffect, useRef, useState } from "react";

// Wraps a numeric value so genuinely-updating client data (ticker, movers)
// gets a brief color flash on change, like a departure board - not a fake
// animation on data that never actually moves client-side.
export default function AnimatedNumber({
  value,
  format = (v: number) => v.toLocaleString(),
  className = "",
}: {
  value: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const prevValue = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (value !== prevValue.current) {
      setFlash(value > prevValue.current ? "up" : "down");
      prevValue.current = value;
      const t = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={`tabular rounded px-0.5 ${flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""} ${className}`}
    >
      {format(value)}
    </span>
  );
}
