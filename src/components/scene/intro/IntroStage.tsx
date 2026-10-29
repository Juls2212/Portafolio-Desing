"use client";

import { useSpatialScene } from "@/lib/motion/useSpatialScene";
import { SpatialIntro } from "./SpatialIntro";

/**
 * Mounts the spatial room only when the viewport is >= 900x560 and motion is allowed. Until then
 * (and always on the server) it renders nothing over the stage's base gradient, so no stacked
 * content flashes on desktop.
 */
export function IntroStage() {
  return useSpatialScene() ? <SpatialIntro /> : null;
}
