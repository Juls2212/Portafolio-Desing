// Phase 2 verification helper (dev only, not part of the app). Cross-platform Node.
// Needs a running production server (npm run build && npm run start -- -p 3111) and playwright-core,
// installed outside the project or ad hoc (npm i --no-save playwright-core).
// Env: BASE_URL (default http://localhost:3111/), CHROME_PATH (default: Windows Chrome).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const log = [];
async function run(tag, w, h, reduced) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
  await p.goto(process.env.BASE_URL ?? "http://localhost:3111/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3200);
  const span = await p.evaluate(() => {
    const r = document.querySelector("[data-intro-runway]");
    const el = r && getComputedStyle(r).display !== "none" ? r : document.getElementById("inicio");
    return el.offsetHeight - innerHeight;
  });
  for (const q of [0, 0.25, 0.5, 0.75, 1]) {
    await p.evaluate((y) => scrollTo(0, y), Math.max(0, q * span));
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/${tag}-p${String(Math.round(q * 100)).padStart(3, "0")}.png` });
  }
  await p.evaluate(() => document.getElementById("sobre-mi").scrollIntoView());
  await p.evaluate(() => scrollBy(0, -63));
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${tag}-about.png` });
  if (w < 1180) {
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(300);
    await p.getByRole("button", { name: "Menú" }).click();
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${tag}-menu-open.png` });
  }
  log.push([tag, "errors", errs]);
  await ctx.close();
}
await run("1440x900", 1440, 900, false);
await run("1024x768", 1024, 768, false);
await run("390x844", 390, 844, false);
await run("1440x900-reduced-motion", 1440, 900, true);
console.log(JSON.stringify(log));
await b.close();
