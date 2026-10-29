import { createRng } from "../../../lib/seeded.ts";

export type PlaneVariant = "solid" | "grid" | "bars" | "frame";

export interface HoloPlane {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  /** Slight yaw in degrees. */
  rotateY: number;
  /** Border alpha .45-.7 */
  line: number;
  /** Fill alpha .06-.12 */
  fill: number;
  variant: PlaneVariant;
}

const VARIANTS: readonly PlaneVariant[] = ["grid", "bars", "frame", "solid", "grid", "bars", "frame"];

/**
 * 13 translucent wireframe planes, deterministic (seeded). They cluster upper-center/left
 * and behind the readable panels; two near planes sit at the far left edge so they never
 * cross the panel text. Z spans -700..-100 as in the room reference.
 */
function build(): HoloPlane[] {
  const rng = createRng(20240615);
  const planes: HoloPlane[] = [];
  for (let i = 0; i < 11; i++) {
    const z = -700 + rng() * 460; // -700..-240, behind the panels
    const far = (z + 700) / 460; // 0 far .. 1 near
    planes.push({
      x: Math.max(-600, Math.min(420, -250 + (rng() + rng() - 1) * 760)),
      y: -270 + (rng() + rng() - 1) * 330,
      z,
      rotateY: Math.round((rng() - 0.5) * 24),
      width: Math.round(200 + (1 - far) * 200 + rng() * 170),
      height: Math.round(130 + (1 - far) * 110 + rng() * 140),
      line: Math.round((0.45 + rng() * 0.25) * 100) / 100,
      fill: Math.round((0.06 + rng() * 0.06) * 100) / 100,
      variant: VARIANTS[Math.floor(rng() * VARIANTS.length)],
    });
  }
  planes.push(
    { x: -820, y: -230, z: -130, rotateY: 14, width: 190, height: 250, line: 0.5, fill: 0.06, variant: "frame" },
    { x: 760, y: -330, z: -110, rotateY: -12, width: 170, height: 150, line: 0.42, fill: 0.05, variant: "grid" },
  );
  return planes;
}

export const holoPlanes: readonly HoloPlane[] = build();
