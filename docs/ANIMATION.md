# Animation strategy

Based on the prototype's proven pattern, minus its per-frame React state and width/height animation.

## One shared scroll controller (`src/lib/motion/scroll-controller.ts`)

- A single `requestAnimationFrame`, scheduled **only** by scroll, pointer or resize events, or while a zone's `onProgress` returns `true` (transition still settling). No idle loops: when nothing moves, nothing is scheduled.
- Each frame computes normalized 0..1 progress per registered zone (`sticky` for tall sections with a sticky stage, `pass` for an element crossing the viewport) and calls the zone callback.
- Callbacks write CSS custom properties, `transform` and `opacity` **directly to refs**. No React `setState` per frame. React state changes only on discrete events (level change, key selection, project focus).
- `onSettle` fires once when the controller goes idle, to commit discrete state.
- `destroy()` removes every listener and cancels the pending frame. Zones return an unregister function. Always clean up on unmount.

## Rules

- Animate only `transform` and `opacity`. Set `will-change` only while animating, then remove it.
- Never animate `width`, `height`, `top` or `left`. The prototype animates the access screen's width/height in `frame()`; Phase 2 must replace that with a `transform: scale()` of a fixed-size element.
- Pointer parallax is eased with `damp` (frame-rate independent) and stops scheduling frames once settled (epsilon 0.002).
- Keep transition lists explicit (`transition-[color,background-color,border-color]`); `transition-colors` also transitions `outline-color` and makes focus rings flash.

## Reduced motion and small screens

`prefers-reduced-motion` and viewports below 900x560 (`canUseSpatialScene` in `viewport.ts`) switch to a lighter static composition: no continuous motion, no parallax, no scroll-linked 3D. `useReducedMotion` is reactive; `base.css` also disables non-essential CSS transitions globally.

## Decision rule

1. **CSS 3D first** for the intro room, panels and section transitions.
2. **Three.js / React Three Fiber is pre-approved for exactly one purpose, in Phase 3:** the persistent 3D mechanical keyboard. Constraints: one fixed canvas, loaded with `next/dynamic` (`ssr: false`), `frameloop="demand"`, instanced or merged keycap meshes, DPR capped at 1.75, full disposal on unmount, static fallback on mobile, reduced motion or no WebGL.
3. Any other heavy dependency (GSAP, Framer Motion, etc.) must be justified in writing before it is added.

## Phase 2 status

The intro follows these rules: one zone on the shared controller; entry animation (<= 2.4 s) keeps frames alive via `onProgress` returning true, then nothing is scheduled; pointer parallax is eased by the controller and stops when settled; only `transform`, `opacity`, `visibility` (to remove hidden panels from the tab order) and CSS custom properties (`--a --b --c --mx --my` on the scene root) are written; `will-change` is applied only while `data-active="1"`; the access screen keeps a fixed size and expands with `transform: scale()`. Measured results are in the Phase 2 report.
