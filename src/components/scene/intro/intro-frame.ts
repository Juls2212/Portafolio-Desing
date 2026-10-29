import { clamp, damp } from "@/lib/motion/math";
import { getScreenState } from "@/lib/screen-state";
import type { ZoneState } from "@/lib/motion/scroll-controller";
import { setSiteState } from "@/lib/site-state";
import { panels } from "@/content/panels";
import {
  DEFAULT_FLOOR_ROTATE_X,
  DEFAULT_SCREEN_ROTATE_X,
  ENTRY_MS,
  TABLE_REST_Y,
} from "./intro-config";
import { holoPlanes } from "./holo-planes";
import {
  LAYERS,
  depthFactor,
  entryProgress,
  layerTransform,
  levelFor,
  panelPose,
  phases,
  planePose,
  poseTransform,
  rigFitScale,
  sceneScale,
  screenCoverScale,
} from "./intro-motion";

/**
 * Imperative writer for the intro. It receives the shared controller's per-frame state and writes
 * `transform`, `opacity` (and `visibility`, CSS custom properties, one text node) directly to
 * elements found ONCE at creation. It never touches React state per frame: the only React-visible
 * change is the level, published through the site store when it flips.
 */
export interface IntroWriter {
  /** Returns true while the entry animation is still running (keeps the controller's loop alive). */
  onProgress: (state: ZoneState) => boolean;
  onSettle: () => void;
}

const num = (value: number, digits = 3): string => value.toFixed(digits);

export function createIntroWriter(root: HTMLElement): IntroWriter {
  const one = <T extends HTMLElement>(name: string): T => {
    const el = root.querySelector<T>(`[data-intro="${name}"]`);
    if (!el) throw new Error(`Intro element missing: ${name}`);
    return el;
  };
  const many = (name: string): HTMLElement[] => Array.from(root.querySelectorAll<HTMLElement>(`[data-intro="${name}"]`));

  const scene = one("scene");
  const wallBack = one("wallBack");
  const bloom = one("bloom");
  const wallLeft = one("wallLeft");
  const wallRight = one("wallRight");
  const glass = one("glass");
  const planeEls = many("plane");
  const panelEls = many("panel");
  const floor = one("floor");
  const glow = one("glow");
  const rig = one("rig");
  const plane = one("tablePlane");
  const art = one("screenArt");
  const frame = one("screenFrame");
  const level2 = one("screenLevel2");
  const textA = one("textA");
  const textB = one("textB");
  const hud = one("hud");
  const hint = one("hint");
  const pct = one("pct");

  // Scene tokens live in CSS (tokens.css); read once.
  const styles = getComputedStyle(root);
  const readDeg = (name: string, fallback: number): number => {
    const value = parseFloat(styles.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  const screenRotateX = readDeg("--scene-screen-rotate-x", DEFAULT_SCREEN_ROTATE_X);
  const floorRotateX = readDeg("--scene-floor-rotate-x", DEFAULT_FLOOR_ROTATE_X);

  let t0: number | null = null;
  let lastPct = "";
  let lastLevel: 1 | 2 | 0 = 0;
  let lastActive = "";
  let focusCalm = 1; // 1 = pointer parallax on, 0 = off while a side screen is open
  const visible = new Map<HTMLElement, boolean>();

  const setVisible = (el: HTMLElement, on: boolean) => {
    if (visible.get(el) === on) return;
    visible.set(el, on);
    el.style.visibility = on ? "visible" : "hidden";
  };

  const onProgress = (state: ZoneState): boolean => {
    const { progress: p, viewport, pointer, elapsed } = state;
    const { width: vw, height: vh } = viewport;
    if (t0 === null) t0 = elapsed;
    const t = elapsed - t0;

    const { a, b, c } = phases(p);
    const s = sceneScale(vw, vh);
    // Pointer parallax calms as the transition progresses, and while a side screen is open.
    const calmTarget = getScreenState().open ? 0 : 1;
    focusCalm = damp(focusCalm, calmTarget, 7, state.dt);
    if (Math.abs(focusCalm - calmTarget) < 0.003) focusCalm = calmTarget;
    const calm = (1 - a) * focusCalm;
    const mx = pointer.x * calm;
    const my = pointer.y * calm;

    root.style.setProperty("--a", num(a, 4));
    root.style.setProperty("--b", num(b, 4));
    root.style.setProperty("--c", num(c, 4));
    root.style.setProperty("--mx", num(mx, 4));
    root.style.setProperty("--my", num(my, 4));

    // Camera: the scene pushes toward the table while the pointer tilts it (<= 5deg Y, <= 4deg X).
    scene.style.transform =
      `translate3d(0,${num(-b * vh * 0.1, 1)}px,${num(b * 420, 1)}px) scale(${num(s)}) ` +
      `rotateX(${num(-my * 8 + b * 4, 3)}deg) rotateY(${num(mx * 10, 3)}deg)`;

    wallBack.style.transform = layerTransform(LAYERS.wallBack, mx, my);
    bloom.style.transform = layerTransform(LAYERS.bloom, mx, my);
    wallLeft.style.transform = layerTransform(LAYERS.wallLeft, mx, my);
    wallRight.style.transform = layerTransform(LAYERS.wallRight, mx, my);
    glass.style.transform = layerTransform(LAYERS.glass, mx, my);

    holoPlanes.forEach((def, i) => {
      const el = planeEls[i];
      if (!el) return;
      const pose = planePose(def, i, a, b, t);
      const amp = 8 + 16 * depthFactor(def.z); // back <= 8px, front <= 24px
      el.style.transform = poseTransform(def.x + mx * 2 * amp, def.y + my * 2 * amp, pose.z, def.rotateY);
      el.style.opacity = num(pose.opacity);
      setVisible(el, !pose.hidden);
    });

    panels.forEach((def, i) => {
      const el = panelEls[i];
      if (!el) return;
      const pose = panelPose(def, a, t, vw, vh, s);
      el.style.transform = poseTransform(pose.x + mx * 48, pose.y + my * 48, pose.z, pose.rotateY);
      el.style.opacity = num(pose.opacity);
      setVisible(el, !pose.hidden); // hidden panels leave the tab order
    });

    // Floor and its reflection fade and shift as the camera arrives.
    floor.style.transform = `translateX(-50%) translateY(${num(-b * vh * 0.22, 1)}px) rotateX(${num(floorRotateX - b * 6, 2)}deg)`;
    floor.style.opacity = num(1 - c);
    glow.style.opacity = num((1 - c) * (1 - b * 0.4));

    // Table: lights up on entry, rises and turns to face the viewer, then its screen expands by scale.
    const lit = entryProgress(t, 700, 1000);
    const fit = rigFitScale(vw);
    rig.style.transform =
      `translate3d(${num(mx * 24, 1)}px,${num(vh * TABLE_REST_Y * (1 - b) + my * 24, 1)}px,0) ` +
      `rotateX(${num(screenRotateX * (1 - b), 2)}deg) scale(${num(fit)})`;
    rig.style.opacity = num(lit);
    setVisible(rig, lit > 0.01);

    plane.style.transform = `scale(${num(1 + (screenCoverScale(vw, vh) / fit - 1) * c)})`;
    art.style.opacity = num(1 - c);
    frame.style.opacity = num(1 - c);
    level2.style.opacity = num(c);

    const textAOpacity = 1 - clamp((c - 0.05) / 0.35);
    textA.style.opacity = num(textAOpacity);
    setVisible(textA, textAOpacity > 0.01);

    const q = clamp((c - 0.6) / 0.35);
    textB.style.opacity = num(q);
    textB.style.transform = `translateY(${num((1 - q) * 24, 1)}px)`;

    hud.style.opacity = num(1 - clamp(c * 2));
    hint.style.opacity = num(1 - clamp(p * 6));

    const alive = c < 0.995;
    setVisible(scene, alive);
    setVisible(floor, alive);
    setVisible(glow, alive);

    const text = String(Math.round(p * 100)).padStart(3, "0");
    if (text !== lastPct) {
      lastPct = text;
      pct.textContent = text;
    }

    const level = levelFor(p);
    if (level !== lastLevel) {
      lastLevel = level;
      setSiteState({ level });
    }

    const entering = t < ENTRY_MS;
    const active = entering || (p > 0.0005 && p < 0.9995) ? "1" : "0";
    if (active !== lastActive) {
      lastActive = active;
      root.dataset.active = active;
    }
    return entering || focusCalm !== calmTarget; // frames only while the calm-down settles
  };

  const onSettle = () => {
    lastActive = "0";
    root.dataset.active = "0";
  };

  return { onProgress, onSettle };
}
