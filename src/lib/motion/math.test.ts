import assert from "node:assert/strict";
import { test } from "node:test";
import { clamp, damp, ease, lerp } from "./math.ts";

test("clamp bounds values", () => {
  assert.equal(clamp(-1), 0);
  assert.equal(clamp(2), 1);
  assert.equal(clamp(5, 0, 10), 5);
});

test("lerp interpolates linearly", () => {
  assert.equal(lerp(10, 20, 0.5), 15);
});

test("ease is cubic in-out with fixed endpoints and midpoint", () => {
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
  assert.equal(ease(0.5), 0.5);
  assert.ok(ease(0.25) < 0.25);
  assert.ok(ease(0.75) > 0.75);
});

test("damp converges and is frame-rate independent", () => {
  const oneStep = damp(0, 1, 5, 0.1);
  let twoSteps = damp(0, 1, 5, 0.05);
  twoSteps = damp(twoSteps, 1, 5, 0.05);
  assert.ok(Math.abs(oneStep - twoSteps) < 1e-12);
  assert.ok(damp(0, 1, 5, 10) > 0.999);
  assert.equal(damp(3, 3, 5, 0.016), 3);
});
