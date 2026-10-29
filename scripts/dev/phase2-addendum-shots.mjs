// Phase 2 addendum verification helper (dev only, not part of the app). Cross-platform Node.
// Needs a running production server (npm run build && npm run start -- -p 3111) and playwright-core,
// installed outside the project or ad hoc (npm i --no-save playwright-core).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const log = {};
const open = (p, id) => p.locator(`.intro-root [data-screen-opener="${id}"]`).click();

// ---- desktop 1440x900 ----
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:3111/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3300);
  await p.screenshot({ path: `${out}/1440x900-room-closed.png` });

  await open(p, "sobre-mi");
  await p.waitForTimeout(250);
  await p.screenshot({ path: `${out}/1440x900-transition-250ms-sobre-mi.png` });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/1440x900-p02-open.png` });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(900);

  await open(p, "intereses");
  await p.waitForTimeout(1100);
  await p.screenshot({ path: `${out}/1440x900-p03-open.png` });
  log.desktopErrors = errs;
  await ctx.close();
}
// ---- 390 disclosure cards ----
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3111/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  for (const id of ["sobre-mi", "intereses"]) {
    const btn = p.locator(`.intro-fallback [data-screen-opener="${id}"]`);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await p.waitForTimeout(500);
    const card = p.locator(`#screen-${id}-m`);
    await card.scrollIntoViewIfNeeded();
    await p.evaluate(() => scrollBy(0, 120));
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/390x844-disclosure-${id}-open.png` });
  }
  await ctx.close();
}
// ---- reduced motion ----
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3111/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const btn = p.locator('.intro-fallback [data-screen-opener="sobre-mi"]');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await p.waitForTimeout(60);
  log.reducedVisibleAt60ms = await p.locator("#screen-sobre-mi-m").isVisible();
  await p.evaluate(() => scrollBy(0, 200));
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/1440x900-reduced-motion-disclosure-open.png` });
  await ctx.close();
}
console.log(JSON.stringify(log));
await b.close();
