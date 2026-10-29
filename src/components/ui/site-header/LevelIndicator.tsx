"use client";

import { useSiteState } from "@/lib/site-state";

export function LevelIndicator() {
  const level = useSiteState((s) => s.level);
  return (
    <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] tracking-[0.14em] text-text-muted">
      <span aria-hidden="true" className="size-1.5 rotate-45 bg-red" />
      <span className="max-[439px]:sr-only">NIVEL {level === 1 ? "01" : "02"}</span>
    </span>
  );
}
