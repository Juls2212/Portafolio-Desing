# Portafolio de Juliana Peñafiel

Portafolio inmersivo (oscuro, holográfico). Esta es la **Fase 1**: base del proyecto. La intro, la galería, el stack y las demás secciones llegan en las Fases 2 a 4.

Stack: Next.js (App Router), TypeScript, Tailwind CSS, despliegue en Vercel.

## Cómo ejecutarlo

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # compilación de producción
npm run start      # servir la compilación
npm run lint       # ESLint
npm run typecheck  # TypeScript (genera tipos de rutas y ejecuta tsc --noEmit)
npm test           # pruebas unitarias (contenido y utilidades de movimiento)
```

## Estructura

- `src/app/`: layout, página y estilos globales.
- `src/styles/tokens.css`: colores, sombras y valores de escena (única fuente de verdad).
- `src/components/ui/`: componentes base. `scene/` y `sections/` se llenan en las fases siguientes.
- `src/content/`: contenido editable y tipado.
- `src/lib/motion/`: utilidades de animación (controlador de scroll compartido).
- `public/icons/tech/`: logos locales. `public/images/projects/`: capturas de proyectos.
- `docs/`: arquitectura, animación, especificación de interacción, skills y flujo de trabajo.
- `design-reference/`: prototipo aprobado (solo lectura, fuera del build y del lint).

## Dónde editar el contenido

Todo el texto vive en `src/content/`. Los textos entre corchetes (`[...]`) y los elementos con `isPlaceholder` son **provisionales**: reemplázalos por datos reales. Los enlaces y el correo están sin definir a propósito; no se inventan.

| Archivo | Contenido |
| --- | --- |
| `site.ts` | Nombre, rol, lema, URL del CV y navegación |
| `technologies.ts` | Las 12 tecnologías (colores, logo, frase) |
| `keyboard.ts` | Distribución del teclado 5x6 |
| `projects.ts` | Proyectos y tecnologías asociadas |
| `timeline.ts`, `testimonials.ts`, `contact.ts`, `panels.ts` | Trayectoria, testimonios, contacto y paneles de la intro |

Para cambiar colores edita solo `src/styles/tokens.css`.
