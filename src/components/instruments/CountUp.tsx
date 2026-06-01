"use client";
import { useEffect, useRef, useState } from "react";

export default function CountUp({
  end,
  durationMs = 1200,
  format = (n: number) => n.toLocaleString("en-US"),
  className,
}: {
  end: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [value, setValue] = useState(end); // SSR/no-JS shows the real number
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // keep final value
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(end * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      setValue(0);
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, durationMs]);

  return <span ref={ref} className={className}>{format(value)}</span>;
}
