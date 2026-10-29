"use client";

import { scrollToSection } from "@/lib/scroll-to";

/** "Saltar al contenido": jumps past the intro to #sobre-mi and focuses its heading. Works as a plain anchor without JS. */
export function SkipLink() {
  return (
    <a
      href="#sobre-mi"
      onClick={(event) => {
        event.preventDefault();
        scrollToSection("sobre-mi", { focus: true });
      }}
      className="fixed left-4 top-[-60px] z-[80] bg-red px-4 py-2.5 text-sm font-semibold text-surface-deep focus:top-3"
    >
      Saltar al contenido
    </a>
  );
}
