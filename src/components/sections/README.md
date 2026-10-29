# sections

Portfolio sections (Phases 2-4): intro, sobre-mi, stack, proyectos, trayectoria, testimonios, contacto. Nav order is defined in `src/content/site.ts` (stack before proyectos).

Sections read data from `src/content/` and only publish scroll zones/state to the persistent stage; they never reach into scene internals.
