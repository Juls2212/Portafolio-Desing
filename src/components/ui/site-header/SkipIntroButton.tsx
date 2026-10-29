"use client";

import { useSiteState } from "@/lib/site-state";
import { scrollToSection } from "@/lib/scroll-to";

/** "Saltar intro" is shown only while the intro (Level 1) is on screen. */
export function SkipIntroButton() {
  const level = useSiteState((s) => s.level);
  if (level !== 1) return null;
  return (
    <button
      type="button"
      onClick={() => scrollToSection("sobre-mi", { focus: true })}
      className="hidden h-9 items-center whitespace-nowrap border border-border-strong px-3.5 text-[13px] text-text transition-[background-color] duration-200 hover:bg-[rgb(230_59_73/0.16)] min-[520px]:inline-flex"
    >
      Saltar intro <span aria-hidden="true">→</span>
    </button>
  );
}
