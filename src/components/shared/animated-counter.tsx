"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export function AnimatedCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <span
        ref={ref}
        data-counter-live
        className="font-heading text-4xl font-semibold text-primary sm:text-5xl"
      >
        {display}
        {suffix}
      </span>
      {/* The animation starts from 0, so crawlers that read raw HTML without
          running JS (some SEO/LLM fetchers) would otherwise see "0" for
          every stat. <noscript> content ships in the server HTML but is
          only rendered by browsers with JS disabled, where it hides the
          live (perpetually-0) span via CSS and shows the real number
          instead — real browsers with JS enabled never see this block. */}
      <noscript>
        <style>{"[data-counter-live] { display: none; }"}</style>
        <span className="font-heading text-4xl font-semibold text-primary sm:text-5xl">
          {value}
          {suffix}
        </span>
      </noscript>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
    </motion.div>
  );
}
