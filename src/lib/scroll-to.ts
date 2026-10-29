const HEADER_OFFSET = 63;

interface ScrollToOptions {
  /** Move focus to the section heading after scrolling (keyboard and screen reader users). */
  focus?: boolean;
}

/**
 * Scrolls to a section by id (instant under reduced motion) and optionally moves
 * focus to its heading. Never locks scrolling; normal scroll keeps working.
 */
export function scrollToSection(id: string, { focus = false }: ScrollToOptions = {}): void {
  const target = id === "inicio" ? null : document.getElementById(id);
  const top = target ? target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });

  const hash = `#${id}`;
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);

  if (focus && target) {
    const heading = target.querySelector<HTMLElement>("h1, h2");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
}
