import assert from "node:assert/strict";
import { test } from "node:test";
import { createRng } from "./seeded.ts";

test("same seed gives the same sequence, values stay in [0, 1)", () => {
  const a = createRng(42);
  const b = createRng(42);
  for (let i = 0; i < 50; i++) {
    const v = a();
    assert.equal(v, b());
    assert.ok(v >= 0 && v < 1);
  }
});

test("different seeds diverge", () => {
  assert.notEqual(createRng(1)(), createRng(2)());
});
