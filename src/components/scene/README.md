# scene

Spatial scene components. Placeholder until Phase 2.

- Phase 2: holographic intro room (CSS 3D), driven by the shared scroll controller.
- Phase 3: the **persistent stage**, a fixed full-viewport layer that hosts the single 3D keyboard across Stack and Projects. See `docs/ARCHITECTURE.md` and `docs/INTERACTION_SPEC.md`.

Rules: sections only publish scroll zones/state to the stage; static composition on mobile and reduced motion; full cleanup on unmount.
