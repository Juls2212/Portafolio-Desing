import { clamp, damp } from "./math.ts";

/**
 * Shared scroll controller.
 *
 * - One requestAnimationFrame, scheduled ONLY by scroll / pointer / resize
 *   events or while a zone reports it is still settling. No idle loops.
 * - Each frame it computes normalized progress per registered zone and hands
 *   it to the zone callback, which writes `transform` / `opacity` / CSS custom
 *   properties directly to refs. Never call React setState per frame.
 * - `destroy()` removes every listener and cancels the pending frame.
 */

/** How a zone's 0..1 progress is derived from its element. */
export type ZoneMode =
  /** Tall section with a sticky stage: 0 when it reaches the top, 1 when its end reaches the bottom. */
  | "sticky"
  /** Element crossing the viewport: 0 when its top enters at the bottom, 1 when its bottom leaves at the top. */
  | "pass";

export interface ZoneState {
  /** Normalized progress, clamped to 0..1. */
  progress: number;
  viewport: { width: number; height: number };
  scrollY: number;
  /** Eased pointer position, each axis in -0.5..0.5 (0 when pointer is disabled). */
  pointer: { x: number; y: number };
  /** Milliseconds since the controller was created. */
  elapsed: number;
  /** Seconds since the previous frame (capped), for damping. */
  dt: number;
}

export interface ScrollZone {
  id: string;
  element: HTMLElement;
  mode?: ZoneMode;
  /**
   * Zone uses the eased pointer: pointer movement schedules frames only while such a zone exists.
   * May be a function, evaluated per pointer event, to pause pointer frames temporarily.
   */
  pointer?: boolean | (() => boolean);
  /** Called every frame while active. Return true to keep the loop running (transition still settling). */
  onProgress: (state: ZoneState) => boolean | void;
  /** Called once when the controller goes idle after having been active. */
  onSettle?: (state: ZoneState) => void;
}

export interface ScrollControllerOptions {
  /** Track the pointer with eased parallax. Disable for reduced motion / touch. Default true. */
  pointer?: boolean;
  /** Pointer smoothing rate (per second). Default 4.5, about 0.07 per frame at 60 fps. */
  pointerLambda?: number;
}

export interface ScrollController {
  /** Registers a zone. Returns an unregister function. */
  registerZone: (zone: ScrollZone) => () => void;
  /** Requests a frame (e.g. after the DOM changed). Cheap if one is already pending. */
  request: () => void;
  destroy: () => void;
}

const POINTER_SETTLE_EPSILON = 0.002;
const MAX_DT = 0.05;

export function createScrollController(options: ScrollControllerOptions = {}): ScrollController {
  const { pointer: trackPointer = true, pointerLambda = 4.5 } = options;

  const zones = new Map<string, ScrollZone>();
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const startedAt = performance.now();
  let rafId: number | null = null;
  let lastTime = startedAt;
  let destroyed = false;

  const request = () => {
    if (destroyed || rafId !== null || zones.size === 0) return;
    rafId = requestAnimationFrame(frame);
  };

  const progressFor = (zone: ScrollZone, vh: number): number => {
    const rect = zone.element.getBoundingClientRect();
    if (zone.mode === "pass") return clamp((vh - rect.top) / (vh + rect.height));
    return clamp(-rect.top / Math.max(1, zone.element.offsetHeight - vh));
  };

  function frame(now: number) {
    rafId = null;
    const dt = Math.min(MAX_DT, (now - lastTime) / 1000);
    lastTime = now;

    eased.x = damp(eased.x, target.x, pointerLambda, dt);
    eased.y = damp(eased.y, target.y, pointerLambda, dt);
    const pointerSettling =
      Math.abs(target.x - eased.x) > POINTER_SETTLE_EPSILON || Math.abs(target.y - eased.y) > POINTER_SETTLE_EPSILON;

    const base = {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scrollY: window.scrollY,
      pointer: { x: eased.x, y: eased.y },
      elapsed: now - startedAt,
      dt,
    };

    let more = pointerSettling;
    for (const zone of zones.values()) {
      if (zone.onProgress({ ...base, progress: progressFor(zone, base.viewport.height) }) === true) more = true;
    }
    if (more) {
      request();
    } else {
      // Idle again: no further frames until the next event.
      for (const zone of zones.values()) {
        zone.onSettle?.({ ...base, progress: progressFor(zone, base.viewport.height) });
      }
    }
  }

  const onScroll = () => request();
  const onResize = () => request();
  const onPointerMove = (e: PointerEvent) => {
    target.x = e.clientX / window.innerWidth - 0.5;
    target.y = e.clientY / window.innerHeight - 0.5;
    for (const zone of zones.values()) {
      if (typeof zone.pointer === "function" ? zone.pointer() : zone.pointer) {
        request();
        return;
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  if (trackPointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

  return {
    registerZone(zone) {
      zones.set(zone.id, zone);
      request(); // paint the initial state once
      return () => {
        if (zones.get(zone.id) === zone) zones.delete(zone.id);
      };
    },
    request,
    destroy() {
      destroyed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      zones.clear();
    },
  };
}
