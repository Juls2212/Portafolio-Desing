"use client";

import { scrollToSection } from "@/lib/scroll-to";

/** The entrance on the table screen: scrolls to the About section and focuses its heading. */
export function EnterButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => scrollToSection("sobre-mi", { focus: true })}>
      Entrar al portafolio <span aria-hidden="true">↓</span>
    </button>
  );
}
