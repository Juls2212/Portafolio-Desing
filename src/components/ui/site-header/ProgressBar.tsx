"use client";

import { useEffect, useRef } from "react";
import { useScrollController } from "@/lib/motion/ScrollProvider";

/** Page scroll progress, written straight to the bar's transform (scaleX). No React state. */
export function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);
  const controller = useScrollController();

  useEffect(() => {
    const el = bar.current;
    if (!controller || !el) return;
    return controller.registerZone({
      id: "page-progress",
      element: document.body,
      mode: "sticky",
      onProgress: ({ progress }) => {
        el.style.transform = `scaleX(${progress.toFixed(4)})`;
      },
    });
  }, [controller]);

  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-px overflow-hidden">
      <div ref={bar} className="h-px origin-left scale-x-0 bg-red" />
    </div>
  );
}
