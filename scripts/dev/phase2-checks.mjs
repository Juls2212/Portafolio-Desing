// Phase 2 verification helper (dev only, not part of the app). Cross-platform Node.
// Needs a running production server (npm run build && npm run start -- -p 3111) and playwright-core,
// installed outside the project or ad hoc (npm i --no-save playwright-core).
// Env: BASE_URL (default http://localhost:3111/), CHROME_PATH (default: Windows Chrome).
import { chromium } from "playwright-core";
const URL = process.env.BASE_URL ?? "http://localhost:3111/";
const exe = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const b = await chromium.launch({ executablePath: exe });
const out = {};
const initScript = () => {
  window.__raf = { count: 0, names: {} };
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { window.__raf.count++; const n = cb.name || "anon"; window.__raf.names[n] = (window.__raf.names[n] || 0) + 1; return orig(cb); };
  window.__listeners = {};
  const types = new Set(["scroll", "resize", "pointermove"]);
  const add = window.addEventListener.bind(window), rem = window.removeEventListener.bind(window);
  window.addEventListener = (t, f, o) => { if (types.has(t)) { (window.__listeners[t] ||= new Set()).add(f); } return add(t, f, o); };
  window.removeEventListener = (t, f, o) => { if (types.has(t)) window.__listeners[t]?.delete(f); return rem(t, f, o); };
  window.__styleProps = new Set();
  const parse = (s) => { const m = new Map(); (s || "").split(";").forEach((d) => { const i = d.indexOf(":"); if (i > 0) m.set(d.slice(0, i).trim(), d.slice(i + 1).trim()); }); return m; };
  document.addEventListener("DOMContentLoaded", () => {
    new MutationObserver((recs) => { for (const r of recs) { if (r.attributeName !== "style") continue; const a = parse(r.oldValue), n = parse(r.target.getAttribute("style")); for (const k of new Set([...a.keys(), ...n.keys()])) if (a.get(k) !== n.get(k)) window.__styleProps.add(k.startsWith("--") ? "--custom" : k); } })
      .observe(document.documentElement, { attributes: true, attributeOldValue: true, subtree: true, attributeFilter: ["style"] });
  });
};
const raf = (p) => p.evaluate(() => window.__raf.count);
const resetRaf = (p) => p.evaluate(() => { window.__raf = { count: 0, names: {} }; });
const mk = async (w, h, reduced = false) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const p = await ctx.newPage(); await p.addInitScript(initScript);
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(URL, { waitUntil: "networkidle" }); p.errs = errs; p.ctx = ctx; return p;
};
const runway = (p) => p.evaluate(() => { const r = document.querySelector("[data-intro-runway]"); return r.offsetHeight - innerHeight; });
const scrollP = async (p, q) => { const h = await runway(p); await p.evaluate((y) => scrollTo(0, y), q * h); await p.waitForTimeout(250); };
const level = (p) => p.evaluate(() => [...document.querySelectorAll("header span")].map((s) => s.textContent).find((t) => /^NIVEL \d\d$/.test(t)));

// ---------- 3. idle frames ----------
{
  const p = await mk(1440, 900);
  await p.waitForTimeout(3500); await resetRaf(p); await p.waitForTimeout(1500);
  out.idleFramesAfterEntry = await raf(p);
  await p.mouse.move(300, 300); await p.mouse.move(900, 500, { steps: 12 });
  await p.waitForTimeout(200); out.framesDuringPointerMove = await raf(p);
  await p.waitForTimeout(2500); await resetRaf(p); await p.waitForTimeout(1200);
  out.framesAfterPointerSettled = await raf(p);

  // ---------- 4. scroll trap / levels / props ----------
  const cdp = await p.ctx.newCDPSession(p); await cdp.send("Performance.enable");
  const metric = async (n) => (await cdp.send("Performance.getMetrics")).metrics.find((m) => m.name === n).value;
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.evaluate(() => (window.__styleProps = new Set()));
  const L0 = await metric("LayoutCount"), S0 = await metric("RecalcStyleCount");
  await p.mouse.move(720, 450);
  const ys = [];
  for (let i = 0; i < 70; i++) { await p.mouse.wheel(0, 150); await p.waitForTimeout(30); ys.push(await p.evaluate(() => scrollY)); }
  await p.waitForTimeout(300);
  const L1 = await metric("LayoutCount"), S1 = await metric("RecalcStyleCount");
  const total = await p.evaluate(() => [scrollY, document.querySelector("[data-intro-runway]").offsetHeight - innerHeight]);
  out.wheel = { monotonic: ys.every((y, i) => i === 0 || y >= ys[i - 1]), startedMoving: ys[0] > 0, scrollYAfter: total[0], runwayScrollable: total[1], passedRunwayEnd: total[0] > total[1] };
  out.layoutCountDuringWheel = L1 - L0; out.styleRecalcDuringWheel = S1 - S0;
  out.animatedStyleProps = [...(await p.evaluate(() => [...window.__styleProps]))].sort();
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  const keys = [];
  for (let i = 0; i < 6; i++) { await p.keyboard.press("Space"); await p.waitForTimeout(400); keys.push(await p.evaluate(() => scrollY)); }
  out.spaceKey = { values: keys.map(Math.round), allIncreasing: keys.every((y, i) => i === 0 || y > keys[i - 1]) };
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  const pd = [];
  for (let i = 0; i < 4; i++) { await p.keyboard.press("PageDown"); await p.waitForTimeout(400); pd.push(await p.evaluate(() => scrollY)); }
  out.pageDown = { values: pd.map(Math.round), allIncreasing: pd.every((y, i) => i === 0 || y > pd[i - 1]) };
  await scrollP(p, 0.93); out.levelAt093 = await level(p);
  await scrollP(p, 0.95); out.levelAt095 = await level(p);
  await scrollP(p, 0.5); out.skipButtonAt050 = await p.locator("text=Saltar intro").count();
  await scrollP(p, 1); out.skipButtonAt100 = await p.locator("text=Saltar intro").count();
  out.activeNavAfterRunway = await p.evaluate(() => document.querySelector("header [aria-current]")?.textContent);
  await p.waitForTimeout(500); await resetRaf(p); await p.waitForTimeout(800); out.idleAfterScrollStops = await raf(p);

  // ---------- hidden panels not focusable ----------
  await scrollP(p, 0.5);
  out.hiddenPanels = await p.evaluate(() => [...document.querySelectorAll('[data-intro="panel"]')].map((el) => getComputedStyle(el).visibility));
  out.focusableInHiddenPanels = await p.evaluate(() => { const btn = document.querySelector('[data-intro="panel"] button'); btn.focus(); return document.activeElement === btn; });
  // ---------- 5. skip ----------
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.locator("text=Saltar intro").click(); await p.waitForTimeout(1800);
  out.skipIntro = await p.evaluate(() => ({ hash: location.hash, focus: document.activeElement?.id, aboutTop: Math.round(document.getElementById("sobre-mi").getBoundingClientRect().top) }));
  out.consoleErrors = p.errs;
  await p.ctx.close();
}
// ---------- skip link ----------
{
  const p = await mk(1440, 900); await p.waitForTimeout(3000);
  await p.keyboard.press("Tab");
  out.firstTab = await p.evaluate(() => document.activeElement.textContent);
  await p.keyboard.press("Enter"); await p.waitForTimeout(1800);
  out.skipLink = await p.evaluate(() => ({ hash: location.hash, focus: document.activeElement?.id, aboutTop: Math.round(document.getElementById("sobre-mi").getBoundingClientRect().top) }));
  await p.ctx.close();
}
// ---------- keyboard tab order at top ----------
{
  const p = await mk(1440, 900); await p.waitForTimeout(3200);
  const order = [];
  for (let i = 0; i < 16; i++) { await p.keyboard.press("Tab"); order.push(await p.evaluate(() => { const a = document.activeElement; return (a.getAttribute("aria-label") || a.textContent || a.tagName).trim().slice(0, 28); })); }
  out.tabOrder = order; await p.ctx.close();
}
// ---------- mobile menu + overflow + fallback ----------
{
  const p = await mk(390, 844); await p.waitForTimeout(1500);
  const m = (out.mobile_390 = {});
  m.spatialMounted = await p.locator(".intro-root").count();
  m.fallbackDisplay = await p.evaluate(() => getComputedStyle(document.querySelector(".intro-fallback")).display);
  m.overflow = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  const btn = p.getByRole("button", { name: "Menú" });
  m.expandedBefore = await btn.getAttribute("aria-expanded");
  await btn.click();
  const open = p.getByRole("button", { name: "Cerrar" });
  m.expandedOpen = await open.getAttribute("aria-expanded"); m.menuVisible = await p.locator("#menu-movil").isVisible();
  await p.keyboard.press("Escape"); await p.waitForTimeout(100);
  m.afterEscape = await p.evaluate(() => ({ display: getComputedStyle(document.getElementById("menu-movil")).display, focus: document.activeElement.textContent, expanded: document.activeElement.getAttribute("aria-expanded") }));
  await p.getByRole("button", { name: "Menú" }).click();
  await p.locator("#menu-movil a", { hasText: "Stack" }).click(); await p.waitForTimeout(1500);
  m.afterNav = await p.evaluate(() => ({ menuDisplay: getComputedStyle(document.getElementById("menu-movil")).display, focus: document.activeElement.textContent, stackTop: Math.round(document.getElementById("stack").getBoundingClientRect().top) }));
  m.errors = p.errs; await p.ctx.close();
}
for (const [w, h] of [[1440, 900], [1024, 768]]) {
  const p = await mk(w, h); await p.waitForTimeout(3000);
  out["overflow_" + w] = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  out["spatial_" + w] = await p.locator(".intro-root").count();
  await p.ctx.close();
}
// ---------- reduced motion ----------
{
  const p = await mk(1440, 900, true); await p.waitForTimeout(1500);
  out.reduced = { spatial: await p.locator(".intro-root").count(), fallbackDisplay: await p.evaluate(() => getComputedStyle(document.querySelector(".intro-fallback")).display), runwayDisplay: await p.evaluate(() => getComputedStyle(document.querySelector(".intro-runway")).display), tilt: await p.evaluate(() => getComputedStyle(document.querySelector(".intro-screen-tilt")).transform) };
  await resetRaf(p); await p.mouse.move(100, 100); await p.mouse.move(700, 500, { steps: 8 }); await p.waitForTimeout(300); out.reduced.framesOnPointer = await raf(p);
  await p.ctx.close();
}
// ---------- unmount/remount cycles ----------
{
  const p = await mk(1440, 900); await p.waitForTimeout(3000);
  const snap = () => p.evaluate(() => ({ scene: document.querySelectorAll(".intro-root").length, ...Object.fromEntries(Object.entries(window.__listeners).map(([k, v]) => [k, v.size])) }));
  out.cycles = { initial: await snap() };
  for (let i = 1; i <= 3; i++) {
    await p.setViewportSize({ width: 800, height: 700 }); await p.waitForTimeout(600);
    const small = await snap(); await resetRaf(p);
    await p.mouse.move(100, 100); await p.mouse.move(600, 400, { steps: 10 }); await p.waitForTimeout(400);
    const framesOnPointerWhileUnmounted = await raf(p);
    await p.setViewportSize({ width: 1440, height: 900 }); await p.waitForTimeout(3200);
    out.cycles["cycle" + i] = { whileUnmounted: small, framesOnPointerWhileUnmounted, afterRemount: await snap(), panelVisible: await p.evaluate(() => getComputedStyle(document.querySelector('[data-intro="panel"]')).visibility) };
  }
  out.consoleErrors2 = p.errs; await p.ctx.close();
}
console.log(JSON.stringify(out, null, 1));
await b.close();
