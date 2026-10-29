import { clamp, ease } from "../../../lib/motion/math.ts";
import { LEVEL2_THRESHOLD, SCREEN_HEIGHT, SCREEN_WIDTH, TABLE_REST_SCALE } from "./intro-config.ts";

/** Pure math for the intro. No DOM access; see intro-frame.ts for the writer. */

export interface Phases {
  /** Panels leave, cluster flies toward the camera. */
  a: number;
  /** Camera pushes toward the table; table top turns to face the viewer. */
  b: number;
  /** Table screen expands to fill the viewport and dissolves into Level 2. */
  c: number;
}

export const phases = (p: number): Phases => ({
  a: ease(clamp(p / 0.38)),
  b: ease(clamp((p - 0.1) / 0.5)),
  c: ease(clamp((p - 0.56) / 0.36)),
});

export const levelFor = (p: number): 1 | 2 => (p > LEVEL2_THRESHOLD ? 2 : 1);

/** Uniform scale that makes the 1500x900 design reference fit the viewport. */
export const sceneScale = (vw: number, vh: number): number => Math.min(1, vw / 1500, vh / 900);

/** Entry progress 0..1 for something that starts `delay` ms after mount and lasts `duration` ms. */
export const entryProgress = (t: number, delay: number, duration: number): number =>
  ease(clamp((t - delay) / duration));

export interface PanelDef {
  transform: { x: number; y: number; z: number; rotateY: number };
  motion: { dx: number; up: number; delayMs: number };
}

export interface PanelPose {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  opacity: number;
  /** True when invisible: the panel must leave the tab order. */
  hidden: boolean;
}

export function panelPose(def: PanelDef, a: number, t: number, vw: number, vh: number, s: number): PanelPose {
  const e = entryProgress(t, def.motion.delayMs, 950);
  const { transform: P, motion: M } = def;
  const opacity = e * (1 - clamp(a * 1.35));
  return {
    x: P.x + (M.dx * a * vw * 0.55) / s,
    y: P.y - (M.up * a * vh * 0.6) / s + (1 - e) * 40,
    z: P.z - (1 - e) * 320 + a * 80,
    rotateY: P.rotateY + M.dx * a * 14,
    opacity,
    hidden: opacity < 0.01,
  };
}

export interface PlaneDef {
  z: number;
}

export interface PlanePose {
  z: number;
  opacity: number;
  hidden: boolean;
}

/** Z range of the wireframe cluster, used to derive depth factors. */
export const PLANE_Z_MIN = -700;
export const PLANE_Z_MAX = -100;

/** 0 (far) .. 1 (near). */
export const depthFactor = (z: number): number => clamp((z - PLANE_Z_MIN) / (PLANE_Z_MAX - PLANE_Z_MIN));

export function planePose(def: PlaneDef, index: number, a: number, b: number, t: number): PlanePose {
  const e = entryProgress(t, 250 + index * 80, 700);
  const opacity = e * (1 - clamp(b * 1.4));
  return {
    z: def.z - (1 - e) * 260 + a * (240 + 240 * depthFactor(def.z)),
    opacity,
    hidden: opacity < 0.01,
  };
}

/** Scale that makes the fixed-size access screen cover the whole viewport (with a small bleed). */
export const screenCoverScale = (vw: number, vh: number): number =>
  Math.max(vw / SCREEN_WIDTH, vh / SCREEN_HEIGHT) * 1.03;

/** Scale of the table rig: fits the viewport width and sits smaller at rest so the pedestal shows. */
export const rigFitScale = (vw: number): number => Math.min(1, (vw * 0.84) / SCREEN_WIDTH) * TABLE_REST_SCALE;

/** Static room layers placed in the 3D scene, with their pointer-parallax amplitude in px. */
export interface LayerDef {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  /** Max pointer parallax travel (px) at full pointer deflection. */
  amp: number;
}

export const LAYERS = {
  wallBack: { x: 0, y: 0, z: -520, rotateY: 0, amp: 8 },
  bloom: { x: -250, y: -250, z: -490, rotateY: 0, amp: 9 },
  wallLeft: { x: -1110, y: -30, z: -230, rotateY: 12, amp: 10 },
  wallRight: { x: 1110, y: -30, z: -230, rotateY: -12, amp: 10 },
  glass: { x: 870, y: -40, z: -215, rotateY: -12, amp: 14 },
} as const satisfies Record<string, LayerDef>;

/** Builds a centered 3D transform; mx/my are the eased pointer in -0.5..0.5. */
export const poseTransform = (x: number, y: number, z: number, rotateY: number): string =>
  `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg)`;

export const layerTransform = (def: LayerDef, mx: number, my: number): string =>
  poseTransform(def.x + mx * 2 * def.amp, def.y + my * 2 * def.amp, def.z, def.rotateY);
