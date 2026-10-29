import assert from "node:assert/strict";
import { test } from "node:test";
import { panels } from "../../../content/panels.ts";
import { levelFor, panelPose, phases, planePose, screenCoverScale, sceneScale } from "./intro-motion.ts";

test("phases are 0 at the start and 1 at the end, and are ordered", () => {
  assert.deepEqual(phases(0), { a: 0, b: 0, c: 0 });
  assert.deepEqual(phases(1), { a: 1, b: 1, c: 1 });
  const mid = phases(0.3);
  assert.ok(mid.a > mid.b && mid.b > mid.c);
});

test("level switches above 0.94", () => {
  assert.equal(levelFor(0.94), 1);
  assert.equal(levelFor(0.941), 2);
  assert.equal(levelFor(0), 1);
});

test("panels are visible after entry and hidden (out of the tab order) once a is high enough", () => {
  const hero = panels[0];
  const before = panelPose(hero, 0, 0, 1440, 900, 1);
  assert.equal(before.hidden, true);
  const shown = panelPose(hero, 0, 2400, 1440, 900, 1);
  assert.equal(shown.opacity, 1);
  assert.equal(shown.hidden, false);
  assert.equal(panelPose(hero, phases(0.27).a, 2400, 1440, 900, 1).hidden, true);
  assert.equal(panelPose(hero, phases(0.38).a, 2400, 1440, 900, 1).hidden, true);
});

test("planes fade out as the camera pushes in", () => {
  assert.equal(planePose({ z: -400 }, 0, 0, 0, 5000).opacity, 1);
  assert.equal(planePose({ z: -400 }, 0, 1, 1, 5000).hidden, true);
});

test("screen cover scale covers the viewport and scene scale never exceeds 1", () => {
  const k = screenCoverScale(1440, 900);
  assert.ok(1100 * k >= 1440 && 462 * k >= 900);
  assert.equal(sceneScale(3000, 2000), 1);
  assert.ok(sceneScale(900, 560) < 1);
});
