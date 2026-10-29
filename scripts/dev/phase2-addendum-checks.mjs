// Phase 2 addendum verification helper (dev only, not part of the app). Cross-platform Node.
// Needs a running production server (npm run build && npm run start -- -p 3111) and playwright-core,
// installed outside the project or ad hoc (npm i --no-save playwright-core).
import { chromium } from "playwright-core";
const URL = "http://localhost:3111/";
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const out = {};

const initScript = () => {
  window.__raf = { count: 0 };
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { window.__raf.count++; return orig(cb); };
  window.__lst = {};
  const track = (target, name, types) => {
    const add = target.addEventListener.bind(target), rem = target.removeEventListener.bind(target);
    target.addEventListener = (t, f, o) => { if (types.has(t)) (window.__lst[name + ":" + t] ||= new Set()).add(f); return add(t, f, o); };
    target.removeEventListener = (t, f, o) => { if (types.has(t)) window.__lst[name + ":" + t]?.delete(f); return rem(t, f, o); };
  };
  track(window, "window", new Set(["scroll", "resize", "pointermove"]));
  track(document, "document", new Set(["keydown", "pointerdown"]));
  window.__props = new Set();
  const parse = (s) => { const m = new Map(); (s || "").split(";").forEach((d) => { const i = d.indexOf(":"); if (i > 0) m.set(d.slice(0, i).trim(), d.slice(i + 1).trim()); }); return m; };
  document.addEventListener("DOMContentLoaded", () => {
    new MutationObserver((recs) => { for (const r of recs) { if (r.attributeName !== "style") continue; const a = parse(r.oldValue), n = parse(r.target.getAttribute("style")); for (const k of new Set([...a.keys(), ...n.keys()])) if (a.get(k) !== n.get(k)) window.__props.add(k.startsWith("--") ? "--custom" : k); } })
      .observe(document.documentElement, { attributes: true, attributeOldValue: true, subtree: true, attributeFilter: ["style"] });
  });
  window.__cls = 0;
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch {}
};
const mk = async (w, h, reduced = false) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const p = await ctx.newPage(); await p.addInitScript(initScript);
  p.errs = []; p.reqs = [];
  p.on("pageerror", (e) => p.errs.push(e.message)); p.on("console", (m) => m.type() === "error" && p.errs.push(m.text()));
  p.on("request", (r) => p.reqs.push(r.url()));
  await p.goto(URL, { waitUntil: "networkidle" }); p.ctx = ctx; return p;
};
const opener = (p, id) => p.locator(`.intro-root [data-screen-opener="${id}"]`);
const st = (p) => p.evaluate(() => {
  const f = (id) => { const el = document.querySelector(`[data-screen-face="${id}"]`); const c = getComputedStyle(el); return { inert: el.inert, visibility: c.visibility, opacity: +(+c.opacity).toFixed(2) }; };
  const ex = (id) => document.querySelector(`.intro-root [data-screen-opener="${id}"]`).getAttribute("aria-expanded");
  const inner = (id) => { const c = getComputedStyle(document.querySelector(`[data-panel-id="${id}"]`)); return { opacity: +(+c.opacity).toFixed(2), visibility: c.visibility }; };
  return { about: { ...f("sobre-mi"), expanded: ex("sobre-mi"), compact: inner("sobre-mi") }, interests: { ...f("intereses"), expanded: ex("intereses"), compact: inner("intereses") }, hero: inner("presentacion"), active: document.activeElement?.id || document.activeElement?.getAttribute("data-screen-opener") || document.activeElement?.tagName };
});
const raf = (p) => p.evaluate(() => window.__raf.count);
const resetRaf = (p) => p.evaluate(() => { window.__raf.count = 0; });

// ================= desktop =================
process.on("unhandledRejection", (e) => { console.log(JSON.stringify(out, null, 1)); console.log("FAILED:", String(e).slice(0, 300)); process.exit(1); });
{
  const p = await mk(1440, 900); await p.waitForTimeout(3500);
  const cdp = await p.ctx.newCDPSession(p); await cdp.send("Performance.enable");
  const metric = async (n) => (await cdp.send("Performance.getMetrics")).metrics.find((m) => m.name === n).value;

  // closed: out of a11y tree and tab order
  const snapClosed = await p.locator("body").ariaSnapshot();
  out.closed = { inAriaTree: snapClosed.includes("PANTALLA ABIERTA"), headingSobreMi: /heading "Sobre mí"/.test(snapClosed.split("main")[1] ?? ""), state: await st(p) };

  // tab order
  const order = [];
  for (let i = 0; i < 18; i++) { await p.keyboard.press("Tab"); order.push(await p.evaluate(() => { const a = document.activeElement; return (a.textContent || a.tagName).trim().replace(/\s+/g, " ").slice(0, 24); })); }
  out.tabOrder = order.slice(8, 15);
  out.tabIndexAfter = null;
  await p.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); }); await p.waitForTimeout(700);

  // ----- open P/02 with a real click, measure performance -----
  await p.waitForTimeout(300); await resetRaf(p);
  await p.evaluate(() => { window.__props = new Set(); });
  const L0 = await metric("LayoutCount"), cls0 = await p.evaluate(() => window.__cls);
  await opener(p, "sobre-mi").click();
  await p.waitForTimeout(1000);
  const openState = await st(p);
  const framesDuringOpen = await raf(p);
  const snapOpen = await p.locator("body").ariaSnapshot();
  await resetRaf(p); await p.waitForTimeout(1500);
  out.afterOpen = { ...openState, framesDuringOpenAnim: framesDuringOpen, framesAfterSettle: await raf(p), inAriaTree: snapOpen.includes("PANTALLA ABIERTA"), headingFocused: openState.active === "screen-sobre-mi-title" };
  // pointer while open: no frames scheduled
  await resetRaf(p); await p.mouse.move(200, 300); await p.mouse.move(1000, 500, { steps: 10 }); await p.waitForTimeout(400);
  out.afterOpen.framesOnPointerMoveWhileOpen = await raf(p);

  // ----- Escape: close + focus returns -----
  await p.keyboard.press("Escape"); await p.waitForTimeout(950);
  out.afterEscape = await st(p);
  const L1 = await metric("LayoutCount");
  out.layoutCountOpenAndClose = L1 - L0;
  out.propsAnimatedOpenClose = [...(await p.evaluate(() => [...window.__props]))].sort();
  out.clsOpenClose = +((await p.evaluate(() => window.__cls)) - cls0).toFixed(4);
  await resetRaf(p); await p.waitForTimeout(1200); out.idleAfterClose = await raf(p);

  // ----- keyboard: Enter on P/02, Space on P/03, swap -----
  await opener(p, "sobre-mi").focus(); await p.keyboard.press("Enter"); await p.waitForTimeout(900);
  out.enterOpens = (await st(p)).about.expanded; out.enterFocus = (await st(p)).active;
  await p.keyboard.press("Escape"); await p.waitForTimeout(900);
  await opener(p, "intereses").focus(); await p.keyboard.press("Space"); await p.waitForTimeout(900);
  out.spaceOpens = (await st(p)).interests.expanded; out.spaceFocus = (await st(p)).active;
  // swap: click the visible edge of the other (dimmed) panel while P/03 is open
  const aboutBox = await p.locator('.intro-root [data-panel-id="sobre-mi"]').boundingBox();
  await p.mouse.click(1200, aboutBox.y + aboutBox.height / 2); await p.waitForTimeout(1000);
  const sw = await st(p);
  out.swap = { aboutExpanded: sw.about.expanded, interestsExpanded: sw.interests.expanded, aboutFace: sw.about.visibility, interestsFace: sw.interests.visibility, interestsInert: sw.interests.inert };
  // outside click
  await p.mouse.click(60, 700); await p.waitForTimeout(950);
  const oc = await st(p); out.outsideClick = { aboutExpanded: oc.about.expanded, face: oc.about.visibility, activeNotOpener: oc.active };
  // Cerrar button
  await opener(p, "intereses").click(); await p.waitForTimeout(900);
  await p.getByRole("button", { name: "Cerrar" }).click(); await p.waitForTimeout(950);
  const cb = await st(p); out.cerrar = { expanded: cb.interests.expanded, focus: cb.active };
  // whole-panel click opens, no double fire
  const box = await p.locator('.intro-root [data-panel-id="intereses"]').boundingBox();
  await p.mouse.click(box.x + box.width / 2, box.y + 30); await p.waitForTimeout(900);
  out.panelClick = (await st(p)).interests.expanded;
  await p.keyboard.press("Escape"); await p.waitForTimeout(1100);
  out.afterPanelClickEscape = await st(p);

  // ----- scroll with a screen open -----
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  await opener(p, "sobre-mi").click(); await p.waitForTimeout(900);
  await p.mouse.move(720, 450);
  const ys = [];
  for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 60); await p.waitForTimeout(40); ys.push(await p.evaluate(() => scrollY)); }
  await p.waitForTimeout(900);
  const ss = await st(p);
  out.wheelWhileOpen = { monotonic: ys.every((y, i) => i === 0 || y >= ys[i - 1]), finalY: ys.at(-1), closed: ss.about.expanded === "false", faceHidden: ss.about.visibility, notStolenFocus: ss.active };
  const y1 = await p.evaluate(() => scrollY);
  await p.keyboard.press("PageDown"); await p.waitForTimeout(600);
  const y2 = await p.evaluate(() => scrollY);
  out.scrollContinues = { before: Math.round(y1), afterPageDown: Math.round(y2), progressed: y2 > y1 };
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
  await opener(p, "sobre-mi").click(); await p.waitForTimeout(900);
  await p.keyboard.press("PageDown"); await p.waitForTimeout(900);
  const pd = await st(p); out.pageDownCloses = { closed: pd.about.expanded === "false", scrollY: Math.round(await p.evaluate(() => scrollY)) };
  // "Ir a Sobre mí"
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
  await opener(p, "sobre-mi").click(); await p.waitForTimeout(900);
  await p.getByRole("link", { name: /Ir a Sobre mí/ }).click(); await p.waitForTimeout(1800);
  out.goToAbout = await p.evaluate(() => ({ hash: location.hash, focus: document.activeElement?.id, aboutTop: Math.round(document.getElementById("sobre-mi").getBoundingClientRect().top), expanded: document.querySelector('.intro-root [data-screen-opener="sobre-mi"]').getAttribute("aria-expanded") }));

  // overflow
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); await opener(p, "sobre-mi").click(); await p.waitForTimeout(900);
  out.overflow1440Open = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  out.errors = p.errs;
  await p.ctx.close();
}
// ================= 1024 & overflow with open =================
{
  const p = await mk(1024, 768); await p.waitForTimeout(3500);
  await opener(p, "sobre-mi").click(); await p.waitForTimeout(900);
  out.overflow1024Open = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  const fb = await p.evaluate(() => { const r = document.querySelector('[data-screen-face="sobre-mi"]').getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight }; });
  out.faceFitsViewport1024 = fb;
  await p.ctx.close();
}
// ================= 900x560 (smallest spatial) =================
{
  const p = await mk(900, 560); await p.waitForTimeout(3500);
  await opener(p, "sobre-mi").click(); await p.waitForTimeout(900);
  out.face900x560 = await p.evaluate(() => { const el = document.querySelector('[data-screen-face="sobre-mi"]'); const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), scrollable: el.scrollHeight > el.clientHeight }; });
  await p.ctx.close();
}
// ================= 390 disclosure =================
{
  const p = await mk(390, 844); await p.waitForTimeout(1200);
  const res = {};
  for (const id of ["sobre-mi", "intereses"]) {
    const btn = p.locator(`.intro-fallback [data-screen-opener="${id}"]`);
    await btn.scrollIntoViewIfNeeded();
    res[id + "_buttonHeight"] = Math.round((await btn.boundingBox()).height);
    res[id + "_before"] = await btn.getAttribute("aria-expanded");
    await btn.tap().catch(() => btn.click());
    await p.waitForTimeout(500);
    res[id + "_expanded"] = await btn.getAttribute("aria-expanded");
    res[id + "_regionVisible"] = await p.locator(`#screen-${id}-m`).isVisible();
  }
  res.overflow = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  res.focusableCloseButtons = await p.evaluate(() => [...document.querySelectorAll(".intro-fallback button")].map((b) => Math.round(b.getBoundingClientRect().height)));
  out.mobile390 = res; out.mobileErrors = p.errs;
  await p.ctx.close();
}
// ================= reduced motion =================
{
  const p = await mk(1440, 900, true); await p.waitForTimeout(800);
  const btn = p.locator('.intro-fallback [data-screen-opener="intereses"]');
  await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(50);
  out.reducedMotion = { spatial: await p.locator(".intro-root").count(), expanded: await btn.getAttribute("aria-expanded"), visibleAt50ms: await p.locator("#screen-intereses-m").isVisible(), animation: await p.evaluate(() => getComputedStyle(document.getElementById("screen-intereses-m")).animationDuration) };
  await p.ctx.close();
}
// ================= unmount / remount cycles =================
{
  const p = await mk(1440, 900); await p.waitForTimeout(3300);
  const snap = () => p.evaluate(() => Object.fromEntries(Object.entries(window.__lst).map(([k, v]) => [k, v.size])));
  out.cycles = { initial: await snap() };
  for (let i = 1; i <= 3; i++) {
    await opener(p, "sobre-mi").click(); await p.waitForTimeout(800);
    const whileOpen = await snap();
    await p.setViewportSize({ width: 800, height: 700 }); await p.waitForTimeout(700);
    const small = { scene: await p.locator(".intro-root").count(), listeners: await snap(), storeClosed: await p.locator('.intro-fallback [data-screen-opener="sobre-mi"]').getAttribute("aria-expanded") };
    await p.setViewportSize({ width: 1440, height: 900 }); await p.waitForTimeout(3300);
    out.cycles["cycle" + i] = { whileOpen, whileUnmounted: small, afterRemount: await snap(), remountClosed: (await st(p)).about.expanded };
  }
  out.cycleErrors = p.errs; await p.ctx.close();
}
console.log(JSON.stringify(out, null, 1));
await b.close();
