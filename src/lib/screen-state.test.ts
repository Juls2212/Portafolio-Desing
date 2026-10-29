import assert from "node:assert/strict";
import { test } from "node:test";
import { createScreenStore } from "./screen-state.ts";

test("starts closed with nothing loaded", () => {
  const s = createScreenStore().get();
  assert.equal(s.open, null);
  assert.deepEqual(s.loaded, { "sobre-mi": false, intereses: false });
});

test("open marks the screen as loaded and it stays loaded after closing", () => {
  const store = createScreenStore();
  store.open("sobre-mi");
  assert.equal(store.get().open, "sobre-mi");
  assert.equal(store.get().loaded["sobre-mi"], true);
  assert.equal(store.get().loaded.intereses, false);
  store.close();
  assert.equal(store.get().open, null);
  assert.equal(store.get().loaded["sobre-mi"], true);
});

test("opening the other screen swaps them: only one is ever open", () => {
  const store = createScreenStore();
  store.open("sobre-mi");
  store.open("intereses");
  assert.equal(store.get().open, "intereses");
  assert.equal(store.get().loaded["sobre-mi"], true);
});

test("toggle opens, then closes with the requested focus behavior", () => {
  const store = createScreenStore();
  store.toggle("intereses");
  assert.equal(store.get().open, "intereses");
  store.toggle("intereses", { restoreFocus: true });
  assert.equal(store.get().open, null);
  assert.equal(store.get().restoreFocus, true);
  store.open("sobre-mi");
  assert.equal(store.get().restoreFocus, false);
});

test("close without restoreFocus (scroll, outside click) does not ask for focus", () => {
  const store = createScreenStore();
  store.open("sobre-mi");
  store.close();
  assert.equal(store.get().restoreFocus, false);
});

test("subscribers are notified only on real changes, and can unsubscribe", () => {
  const store = createScreenStore();
  let calls = 0;
  const off = store.subscribe(() => calls++);
  store.close(); // already closed: no-op
  store.open("sobre-mi");
  store.open("sobre-mi"); // already open: no-op
  store.close();
  assert.equal(calls, 2);
  off();
  store.open("intereses");
  assert.equal(calls, 2);
});
