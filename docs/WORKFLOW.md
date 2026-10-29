# Workflow rules (standing, all phases)

1. **Language.** All UI text is Spanish. Code, identifiers, comments and docs are English.
2. **Source of truth.** The approved prototype (`design-reference/`) and `design-reference/inspiration/room-reference.png` are the visual source of truth. Skills never override them.
3. **Palette.** Burgundy dominates; near-white is only for text, lines and structure, never large backgrounds; black is never the dominant color; red is an accent. Square corners. Colors are changed only in `src/styles/tokens.css`.
4. **No invented facts.** No invented personal information, employers, degrees, links or emails. Unknowns stay `undefined` or bracketed placeholders, flagged with `// TODO: confirm` or `isPlaceholder`.
5. **No decorations from the prohibited list.** No planets, astronauts, glowing spheres, mascots, characters, or emojis.
6. **Skill policy.**
   - At most ONE primary skill per focused task. A second only if its responsibility is clearly different.
   - Never combine several overlapping art-direction skills.
   - Taste Skill only when the user explicitly authorizes it.
   - Never install skills without authorization.
7. **Honest reporting.** Never claim a skill was applied unless it was actually invoked. Never claim visual fidelity without checking; say "visual validation pending".
8. **Performance.** No idle loops; animate only `transform` and `opacity`; clean up listeners, observers and GPU resources on unmount; lazy-load heavy code; respect `prefers-reduced-motion`; use a lighter composition on mobile.
9. **Dependencies.** Keep them minimal. Three.js / React Three Fiber is pre-approved only for the Phase 3 keyboard. Anything else needs a written justification.
10. **Checks before reporting.** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all pass.

## Standard final report

1. Skill usage (used; found vs. not found, exact names)
2. What was implemented
3. Files created/modified (grouped)
4. Checks executed and results
5. Dependencies added and why
6. Deviations from the prompt
7. Whether the approved visual design was preserved ("visual validation pending" if unverified)
8. Known limitations / unresolved problems
9. Each acceptance criterion: met / not met
