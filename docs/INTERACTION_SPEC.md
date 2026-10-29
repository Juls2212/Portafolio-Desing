# Interaction spec: Stack and Projects

Approved behavior, derived from a reference video of another person's portfolio. **Behavior only**: no assets, characters, name or copy from that source are reused. Implementation is Phase 3; the keyboard data lives in `src/content/keyboard.ts` and `technologies.ts`.

1. **Entering Stack (after the intro).** The section shows its title and a hint to press a key. A mechanical keyboard (5x6 grid of rounded, thick keycaps in saturated brand colors with single-color logos, plus some arrow keys) moves in from the right, small and near front-on, then grows and rotates to a large, centered isometric view. The motion is driven by scroll progress through the Stack zone.

2. **Pressing a key** (click, tap, or keyboard focus + Enter/Space). The key physically depresses and a short tagline for that technology (`Technology.tagline`) appears beside the keyboard, aligned diagonally to the keyboard plane. Hover raises a key slightly; selection raises it more. Everything must work with keyboard navigation and touch: nothing is hover-only. Selection changes are announced (`aria-live="polite"`).

3. **Leaving Stack.** The keyboard tilts toward vertical, shrinks and moves into the background (a brief motion blur is acceptable) but **stays** as a persistent backdrop while scrolling.

4. **Projects.** Project content scrolls over the keyboard. When a project is in focus, the keys listed in its `technologyIds` rise and glow; all other keys stay down. Changing the focused project transitions the raised set smoothly. Projects with an empty `technologyIds` raise nothing.

5. **Contact (pending decision).** The keyboard may reappear beside the contact form. Undecided; do not build until confirmed.

6. **No mascot, animal or character** on the keyboard. No planets, astronauts or glowing spheres anywhere.

7. **Mobile and reduced motion.** Static composition, tap-to-select, no continuous motion. Selection still shows the tagline; the project-focus highlight becomes an instant state change.

The keyboard and its stage follow the rules in `ANIMATION.md` and the persistent-stage description in `ARCHITECTURE.md`.

## Intro room: side screens (Phase 2 addendum)

Panels P/02 (Sobre mí) and P/03 (Intereses) open into extended "screens" with content that is not otherwise visible (photo slot, longer bio, quick facts; interest descriptions). All of it is placeholder copy in `src/content/panels.ts` and `about.ts`.

- **Control:** one real button per panel ("Ver foto y más", "Ver más") with `aria-expanded`/`aria-controls`; the whole panel is also clickable (the button stops propagation, so it never double-fires). Touch tap works.
- **Open:** the panel flies to the center-front and scales 1.4x while its expanded face (a separate element at final size) scales/moves in from the panel's rect (FLIP, CSS transitions on transform and opacity only, 520 ms, cubic in-out). The hero and the other side panel recede (translateZ) and dim to 0.2 opacity, and their controls leave the tab order while a screen is open.
- **Non-modal:** no scroll lock, no wheel hijacking, no focus trap. Focus moves to the face's heading; closing with Escape or "Cerrar" returns it to the opener. Closing by outside click or scrolling more than 40 px does not steal focus. One screen at a time; opening the other swaps them.
- **Closed state:** the face is `inert` and `visibility:hidden`, its content (including the photo) mounts only after the first open.
- **Fallback (< 900x560, reduced motion):** the same buttons toggle an inline disclosure inside the stacked card (instant under reduced motion, a 220 ms opacity fade otherwise). Without JS the disclosure cannot open (a known limitation).
