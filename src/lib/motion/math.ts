/** Pure animation math. No DOM access, so it is trivially testable. */

export const clamp = (value: number, min = 0, max = 1): number =>
  value < min ? min : value > max ? max : value;

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

/** Cubic in-out easing from the approved prototype. Input is clamped to 0..1. */
export const ease = (t: number): number => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/**
 * Frame-rate-independent smoothing. `lambda` is the decay rate per second
 * (higher = snappier); `dt` is the elapsed time in seconds.
 */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));
