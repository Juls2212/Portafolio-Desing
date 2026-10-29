import assert from "node:assert/strict";
import { test } from "node:test";
import { KEYBOARD_COLUMNS, KEYBOARD_ROWS, keyboardCells, keyboardRows } from "./keyboard.ts";
import { getProjectTechnologies, projects } from "./projects.ts";
import { site } from "./site.ts";
import { technologies } from "./technologies.ts";
import { testimonials } from "./testimonials.ts";

test("every project technology id resolves to a technology", () => {
  for (const project of projects) {
    const resolved = getProjectTechnologies(project);
    assert.equal(resolved.length, project.technologyIds.length, project.id);
    resolved.forEach((tech, i) => assert.equal(tech.id, project.technologyIds[i]));
  }
});

test("there are 12 technologies with unique ids", () => {
  assert.equal(technologies.length, 12);
  assert.equal(new Set(technologies.map((t) => t.id)).size, 12);
});

test("keyboard is 5 x 6 and places each technology exactly once", () => {
  assert.equal(keyboardRows.length, KEYBOARD_ROWS);
  keyboardRows.forEach((row) => assert.equal(row.length, KEYBOARD_COLUMNS));
  const placed = keyboardCells.flatMap((c) => (c.kind === "tech" ? [c.id] : [])).sort();
  assert.deepEqual(placed, technologies.map((t) => t.id).sort());
});

test("nav puts stack before proyectos", () => {
  const ids = site.nav.map((n) => n.id);
  assert.ok(ids.indexOf("stack") < ids.indexOf("proyectos"));
  assert.equal(ids[0], "inicio");
});

test("there are exactly three placeholder testimonials and four projects", () => {
  assert.equal(testimonials.length, 3);
  assert.ok(testimonials.every((t) => t.isPlaceholder));
  assert.equal(projects.length, 4);
});

test("side-panel screens have placeholder detail with matching shapes", async () => {
  const { panels } = await import("./panels.ts");
  const [, about, interests] = panels;
  assert.ok(about.content.detail.facts.length <= 4);
  assert.ok(interests.content.detail.descriptions.length === interests.content.items.length);
  assert.ok(about.content.detail.facts.every((f) => f.label.startsWith("[") && f.value.startsWith("[")));
  assert.equal(about.content.openLabel, "Ver foto y más");
  assert.equal(interests.content.openLabel, "Ver más");
});
