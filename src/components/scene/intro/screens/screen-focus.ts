import type { ScreenId } from "@/lib/screen-state";
import {
  HEADER_HALF,
  SCREEN_DIM_OPACITY,
  SCREEN_EASE,
  SCREEN_FLY_SCALE,
  SCREEN_MS,
  SCREEN_RECEDE_Z,
} from "../intro-config";
import { sceneScale } from "../intro-motion";

/**
 * Camera-like focus for the side screens, as a FLIP with CSS transitions.
 * Only `transform` and `opacity` change (plus `visibility`, delayed so the fade can finish, and the
 * `transition` declaration itself). No requestAnimationFrame, no size animation: the expanded face
 * keeps its final size and is scaled/translated from the source panel's rect. Transitions are
 * interruptible, so opening during a close (or swapping) continues from the current state.
 */

const PANEL_IDS = ["presentacion", "sobre-mi", "intereses"] as const;
type PanelId = (typeof PANEL_IDS)[number];

const panelInner = (root: HTMLElement, id: PanelId) =>
  root.querySelector<HTMLElement>(`[data-panel-id="${id}"]`);
const faceOf = (root: HTMLElement, id: ScreenId) =>
  root.querySelector<HTMLElement>(`[data-screen-face="${id}"]`);

/**
 * Controls of a receded panel sit behind the open face: take them out of the tab order meanwhile
 * (a focus ring nobody can see is not accessible). The original tabindex is restored afterwards.
 */
function setTabbable(inner: HTMLElement, on: boolean) {
  inner.querySelectorAll<HTMLElement>("a[href], button").forEach((el) => {
    if (on) {
      if (el.dataset.tab === undefined) return;
      if (el.dataset.tab === "") el.removeAttribute("tabindex");
      else el.setAttribute("tabindex", el.dataset.tab);
      delete el.dataset.tab;
    } else if (el.dataset.tab === undefined) {
      el.dataset.tab = el.getAttribute("tabindex") ?? "";
      el.tabIndex = -1;
    }
  });
}

const FACE_CENTER = "translate(-50%, -50%)";

interface Flip {
  /** Source panel center minus the face's resting center, in screen px. */
  dx: number;
  dy: number;
  /** Source width / face width. */
  scale: number;
}

function measure(root: HTMLElement, id: ScreenId): Flip | null {
  const inner = panelInner(root, id);
  const slot = inner?.parentElement; // the slot is moved by the scroll transition; the inner one is not
  const face = faceOf(root, id);
  if (!slot || !face) return null;
  const src = slot.getBoundingClientRect();
  const stage = root.getBoundingClientRect();
  return {
    dx: src.left + src.width / 2 - (stage.left + stage.width / 2),
    dy: src.top + src.height / 2 - (stage.top + stage.height / 2 + HEADER_HALF),
    scale: src.width / face.offsetWidth,
  };
}

const closedFaceTransform = (f: Flip) => `${FACE_CENTER} translate(${f.dx.toFixed(1)}px, ${f.dy.toFixed(1)}px) scale(${f.scale.toFixed(4)})`;

const t = (props: string[], visibilityDelay?: boolean) =>
  props.map((p) => `${p} ${p === "opacity" && props.length > 1 ? SCREEN_MS * 0.6 : SCREEN_MS}ms ${SCREEN_EASE}`).join(", ") +
  (visibilityDelay === undefined ? "" : `, visibility 0s linear ${visibilityDelay ? SCREEN_MS : 0}ms`);

function openFace(root: HTMLElement, id: ScreenId) {
  const face = faceOf(root, id);
  const flip = measure(root, id);
  if (!face || !flip) return;
  if (face.dataset.state === "closed") {
    // First: the source rect. Last: the resting center. Invert, flush, then play.
    face.style.transition = "none";
    face.style.transform = closedFaceTransform(flip);
    face.style.opacity = "0";
    face.style.visibility = "visible";
    void face.offsetWidth;
  }
  face.dataset.state = "open";
  face.style.transition = t(["transform", "opacity"], false);
  face.style.visibility = "visible";
  face.style.transform = FACE_CENTER;
  face.style.opacity = "1";
}

function closeFace(root: HTMLElement, id: ScreenId) {
  const face = faceOf(root, id);
  const flip = measure(root, id);
  if (!face || !flip) return;
  face.dataset.state = "closed";
  face.style.transition = t(["transform", "opacity"], true);
  face.style.transform = closedFaceTransform(flip);
  face.style.opacity = "0";
  face.style.visibility = "hidden"; // applied after SCREEN_MS, once the fade has finished
}

/** The chosen panel flies toward the center-front, scales up and fades into its expanded face. */
function flyPanel(root: HTMLElement, id: ScreenId, s: number) {
  const inner = panelInner(root, id);
  const flip = measure(root, id);
  if (!inner || !flip) return;
  inner.style.transition = t(["transform", "opacity"], true);
  inner.style.transform = `translate(${(-flip.dx / s).toFixed(1)}px, ${(-flip.dy / s).toFixed(1)}px) scale(${SCREEN_FLY_SCALE})`;
  inner.style.opacity = "0";
  inner.style.visibility = "hidden";
  setTabbable(inner, true);
}

/** Other panels recede in Z and dim (no blur filters). */
function dimPanel(root: HTMLElement, id: PanelId) {
  const inner = panelInner(root, id);
  if (!inner) return;
  inner.style.transition = t(["transform", "opacity"], false);
  inner.style.visibility = "visible";
  inner.style.transform = `translateZ(${SCREEN_RECEDE_Z}px)`;
  inner.style.opacity = String(SCREEN_DIM_OPACITY);
  setTabbable(inner, false);
}

function restorePanel(root: HTMLElement, id: PanelId) {
  const inner = panelInner(root, id);
  if (!inner) return;
  inner.style.transition = t(["transform", "opacity"], false);
  inner.style.visibility = "visible";
  inner.style.transform = "none";
  inner.style.opacity = "1";
  setTabbable(inner, true);
}

/** Applies the store state to the DOM. Called once per open/close/swap, not per frame. */
export function applyScreens(root: HTMLElement, prev: ScreenId | null, next: ScreenId | null): void {
  if (prev === next) return;
  const s = sceneScale(window.innerWidth, window.innerHeight);

  // Measure and close first (rects are read before anything moves).
  if (prev) closeFace(root, prev);
  if (next) openFace(root, next);

  for (const id of PANEL_IDS) {
    if (next === null) restorePanel(root, id);
    else if (id === next) flyPanel(root, next, s);
    else dimPanel(root, id);
  }
}
