"use client";

import { useSyncExternalStore } from "react";
import { canUseSpatialScene } from "./viewport";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(REDUCED);
  window.addEventListener("resize", onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    mq.removeEventListener("change", onChange);
  };
}

const getSnapshot = (): boolean =>
  canUseSpatialScene(window.innerWidth, window.innerHeight, window.matchMedia(REDUCED).matches);

/**
 * True when the spatial scene may mount (viewport >= 900x560 and motion allowed).
 * The server and the hydration pass answer false, so the fallback is what ships in the HTML.
 * The snapshot is a boolean, so resize events re-render only when the answer flips.
 */
export function useSpatialScene(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
