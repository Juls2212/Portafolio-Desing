# Architecture

Next.js (App Router) + TypeScript + Tailwind CSS v4, deployed on Vercel. UI text is Spanish; code and docs are English.

## Folders

| Path | Responsibility |
| --- | --- |
| `src/app/` | Root layout (fonts, `lang="es"`, skip link, header, `<main id="contenido">`), `page.tsx`, `globals.css` |
| `src/styles/` | `tokens.css` (single source of truth for color, type, shadow, scene tokens) and `base.css` (global rules) |
| `src/components/ui/` | Primitives: `Container`, `SectionHeader`, `HudLabel`, `CornerFrame`, `HoloPanel`, `Button`/`LinkButton`, `Tag`, `SiteHeader`. Server components, no scroll logic |
| `src/components/scene/` | Spatial scene components: the persistent stage, intro room, keyboard (Phases 2-3) |
| `src/components/sections/` | Portfolio sections (Phases 2-4). They only publish scroll zones and state |
| `src/content/` | Typed, editable Spanish content: `site`, `technologies`, `keyboard`, `projects`, `timeline`, `testimonials`, `contact`, `panels` |
| `src/lib/motion/` | `clamp`, `lerp`, `ease`, `damp`, `useReducedMotion`, `createScrollController` |
| `src/lib/` | `fonts.ts` (next/font), `cx.ts` |
| `public/icons/tech/`, `public/images/projects/` | Local logos (12 SVGs) and project captures |
| `design-reference/` | Read-only prototype and mood reference. Excluded from tsconfig, ESLint and the build |
| `scripts/dev/` | Throwaway tooling (prototype extractor). Not part of the app |

## Content as data

Components read `src/content/*`; editing text, technologies or the keyboard grid never requires touching a component. `TechnologyId` is derived from `technologies.ts`, so a project that references a missing technology fails `npm run typecheck`.

## Persistent stage

The persistent stage is a fixed, full-viewport layer that survives across sections and is driven by the shared scroll controller. In Phase 3 a single 3D mechanical keyboard lives in it and follows the user from the Stack section through Projects (and optionally Contact).

- **Mount point:** `src/components/scene/`, mounted once from the root layout, `position: fixed; inset: 0`, behind the page content (`pointer-events` only where keys must be interactive).
- **Direction of data:** sections only *publish* scroll zones and state (for example "Stack is 0.4 through", "project 2 is in focus, keys `unity` and `git` raised") to the stage through the scroll controller. The stage never reads section internals and sections never touch the stage's objects.
- **Degradation:** on viewports below 900x560 or with `prefers-reduced-motion`, the stage renders a static composition (no continuous motion, tap-to-select). Without WebGL it falls back to the same static composition.
- **Heavy code:** the only pre-approved heavy dependency is Three.js / React Three Fiber for this keyboard, loaded with `next/dynamic` (`ssr: false`). See `ANIMATION.md`.

## Tokens

Change colors in `src/styles/tokens.css` only. `@theme static` yields both Tailwind utilities and `:root` variables. The master-brief palette is kept there as a commented, inactive block.

## Next.js config

`cacheComponents` and `partialPrefetching` are **off** (removed from `next.config.ts`). The site is fully static with no server data, so they add nothing, and with `cacheComponents` on, a server component calling `new Date()` or `Math.random()` (e.g. a footer year) fails prerendering unless wrapped in `<Suspense>` or `use cache`. With them off:

- `new Date().getFullYear()` in a server component is evaluated at build time (fine for a footer; it updates on the next deploy). `Math.random()` in server components is likewise frozen at build, so put randomness in client components, after mount.
- `next/dynamic(..., { ssr: false })` is only allowed in a Client Component (`"use client"`) and is unaffected by either flag. Use it for the Phase 3 canvas.
- If dynamic server data is ever needed, re-evaluate enabling `cacheComponents` then.

## Phase 2: intro (Level 1)

- `IntroSection` (server) renders both the stacked fallback and the scroll runway. `src/styles/intro.css` picks one with the media query `(min-width:900px) and (min-height:560px) and (prefers-reduced-motion:no-preference)`, so nothing flashes on hydration. A `<noscript>` rule in the layout restores the fallback without JS.
- `IntroStage` (client) mounts `SpatialIntro` only when `canUseSpatialScene` agrees (`useSpatialScene`). `SpatialIntro` registers one zone, `intro`, on the shared controller; `intro-frame.ts` writes transform/opacity/visibility directly; `intro-motion.ts` holds the pure, tested math. Runway length: `INTRO_RUNWAY_VH` in `intro-config.ts`.
- The header is a server component with client islands (`components/ui/site-header/`). Level, active section and scene mode live in `lib/site-state.ts` (a tiny external store, updated only on discrete changes). Scrollspy uses an IntersectionObserver (`SiteStateTracker`), not per-frame reads.
- `position: sticky` needs an ancestor chain without `overflow` set: do not add `overflow-x: hidden` to `body`; horizontal overflow is clipped on `<html>` (`base.css`). Likewise `backdrop-filter` on the header would trap the mobile menu's `position: fixed`, so the blur lives on a pseudo-element.
- Dev verification scripts: `scripts/dev/phase2-shots.mjs`, `scripts/dev/phase2-checks.mjs`. Screenshots: `docs/screenshots/phase-2/`.
- Side screens: `src/lib/screen-state.ts` (pure store, unit-tested) is the single source of "which screen is open". `components/scene/intro/screens/` holds the faces, the FLIP logic (`screen-focus.ts`, CSS transitions, no rAF) and the controller (`SpatialScreens`, listeners only while open). Decorative room layers have `pointer-events: none`, and the panel slot is transparent to the pointer, so receded panels stay clickable.
