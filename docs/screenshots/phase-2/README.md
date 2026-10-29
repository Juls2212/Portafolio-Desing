# Phase 2 screenshots

Captured with `scripts/dev/phase2-shots.mjs` against the production build, Chrome headless.

- `1440x900-p000|p025|p050|p075|p100.png`, `1024x768-*.png`: spatial scene at runway progress 0, .25, .5, .75, 1.
- `390x844-*.png`: stacked fallback at the same fractions of the intro height (the spatial scene does not mount below 900x560).
- `1440x900-reduced-motion-*.png`: `prefers-reduced-motion: reduce` emulation (stacked fallback on a desktop viewport).
- `*-about.png`: start of Level 2. `1024x768-menu-open.png`, `390x844-menu-open.png`: mobile menu.
- `1440x900-no-js.png`: JavaScript disabled (stacked fallback via the noscript rule).
