"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useScrollController } from "@/lib/motion/ScrollProvider";
import {
  closeScreen,
  getScreenState,
  openScreen,
  useScreenState,
  type ScreenId,
} from "@/lib/screen-state";
import { SCREEN_SCROLL_CLOSE_PX } from "../intro-config";
import { ScreenFace } from "./ScreenFace";
import { applyScreens } from "./screen-focus";

/**
 * Hosts both expanded faces and owns the open/close behavior of the spatial scene:
 * non-modal (no scroll lock, no focus trap), Escape / outside click / scroll to close, focus
 * handling. Listeners exist only while a screen is open, and everything is released on unmount.
 */
export function SpatialScreens() {
  const layer = useRef<HTMLDivElement>(null);
  const previous = useRef<ScreenId | null>(null);
  const controller = useScrollController();
  const open = useScreenState((s) => s.open);

  // Panel click delegation (the panel is clickable, the button is the accessible control).
  useEffect(() => {
    const root = layer.current?.closest<HTMLElement>(".intro-root");
    if (!root) return;
    closeScreen(); // a screen left open by the other composition must not carry over
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest("button, a, [data-screen-face]")) return; // buttons handle themselves
      const panel = target.closest<HTMLElement>("[data-screen-panel]");
      if (panel) openScreen(panel.dataset.screenPanel as ScreenId);
    };
    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      closeScreen();
    };
  }, []);

  // Apply the store state: FLIP, then focus.
  useLayoutEffect(() => {
    const root = layer.current?.closest<HTMLElement>(".intro-root");
    const prev = previous.current;
    previous.current = open;
    if (!root || prev === open) return;
    applyScreens(root, prev, open);
    root.dataset.screen = open ?? "";
    controller?.request(); // lets the intro writer settle the parallax calm-down, then idle

    if (open) {
      root.querySelector<HTMLElement>(`#screen-${open}-title`)?.focus({ preventScroll: true });
    } else if (prev && getScreenState().restoreFocus) {
      root.querySelector<HTMLElement>(`[data-screen-opener="${prev}"]`)?.focus({ preventScroll: true });
    }
  }, [open, controller]);

  // While open: Escape, outside click, scroll threshold, resize.
  useEffect(() => {
    if (!open) return;
    const startY = window.scrollY;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeScreen({ restoreFocus: true });
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (target.closest("[data-screen-face], [data-screen-panel], [data-screen-opener]")) return;
      closeScreen();
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > SCREEN_SCROLL_CLOSE_PX) closeScreen();
    };
    const onResize = () => closeScreen();
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div ref={layer} className="screens-layer">
      <ScreenFace id="sobre-mi" />
      <ScreenFace id="intereses" />
    </div>
  );
}
