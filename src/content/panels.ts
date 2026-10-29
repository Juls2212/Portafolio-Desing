/** The three intro panels (Phase 2). Geometry and motion values come from the prototype. */

export interface PanelTransform {
  x: number;
  y: number;
  z: number;
  /** rotateY in degrees. */
  rotateY: number;
}

export interface PanelMotion {
  /** Horizontal drift factor while leaving (times viewport width). */
  dx: number;
  /** Upward travel factor while leaving (times viewport height). */
  up: number;
  /** Entrance delay in ms. */
  delayMs: number;
}

interface PanelBase {
  id: "presentacion" | "sobre-mi" | "intereses";
  /** Header label, e.g. "P/01 — PRESENTACIÓN". */
  label: string;
  /** Header badge. */
  badge: string;
  /** Panel width in px (scene units). */
  width: number;
  transform: PanelTransform;
  motion: PanelMotion;
}

export interface HeroPanel extends PanelBase {
  content: {
    kind: "hero";
    eyebrow: string;
    firstName: string;
    lastName: string;
    role: string;
    summary: string;
    primaryCta: string;
    secondaryCta: string;
  };
}

/** Extended content of the Sobre mí screen. Everything here is PLACEHOLDER copy. */
export interface AboutDetail {
  heading: string;
  /** Longer bio placeholder. */
  bio: string;
  /** Up to 4 quick facts. */
  facts: readonly { label: string; value: string }[];
  /** Visible label of the photo placeholder frame. */
  photoLabel: string;
  /** Accessible name of the placeholder frame (the real photo's alt comes from about.ts). */
  photoAriaLabel: string;
  /** Link to the About section. */
  linkLabel: string;
}

/** Extended content of the Intereses screen. One description per interest, same order. */
export interface ListDetail {
  heading: string;
  descriptions: readonly string[];
}

export interface AboutPanel extends PanelBase {
  content: { kind: "about"; quote: string; placeholder: string; openLabel: string; detail: AboutDetail };
}

export interface ListPanel extends PanelBase {
  content: { kind: "list"; items: readonly string[]; openLabel: string; detail: ListDetail };
}

export type IntroPanel = HeroPanel | AboutPanel | ListPanel;

export const panels: readonly [HeroPanel, AboutPanel, ListPanel] = [
  {
    id: "presentacion",
    label: "P/01 — PRESENTACIÓN",
    badge: "JP·01",
    width: 560,
    transform: { x: -70, y: -40, z: 0, rotateY: 0 },
    motion: { dx: -0.12, up: 1.0, delayMs: 120 },
    content: {
      kind: "hero",
      eyebrow: "HOLA, SOY",
      firstName: "Juliana",
      lastName: "Peñafiel",
      role: "Desarrolladora de software",
      summary:
        "Construyo experiencias digitales interactivas donde el código, el diseño y el movimiento trabajan juntos.",
      primaryCta: "Descargar CV",
      secondaryCta: "Ver proyectos",
    },
  },
  {
    id: "sobre-mi",
    label: "P/02 — SOBRE MÍ",
    badge: "◇",
    width: 340,
    transform: { x: 450, y: -150, z: -140, rotateY: -20 },
    motion: { dx: 1, up: 0.45, delayMs: 420 },
    content: {
      kind: "about",
      quote: "Me interesa crear interfaces que se sientan como lugares: claras, rápidas y con intención.",
      placeholder: "[Añade aquí una breve descripción personal: qué te motiva y cómo trabajas.]",
      openLabel: "Ver foto y más",
      detail: {
        heading: "Sobre mí",
        bio: "[Escribe aquí una biografía más extensa: tu historia, lo que te motiva y cómo trabajas.]",
        facts: [
          { label: "[Dato rápido 1]", value: "[Valor]" },
          { label: "[Dato rápido 2]", value: "[Valor]" },
          { label: "[Dato rápido 3]", value: "[Valor]" },
          { label: "[Dato rápido 4]", value: "[Valor]" },
        ],
        photoLabel: "[ FOTO PENDIENTE ]",
        photoAriaLabel: "Espacio reservado para la foto",
        linkLabel: "Ir a Sobre mí",
      },
    },
  },
  {
    id: "intereses",
    label: "P/03 — INTERESES",
    badge: "04",
    width: 300,
    transform: { x: -540, y: 50, z: -200, rotateY: 22 },
    motion: { dx: -1, up: 0.35, delayMs: 580 },
    content: {
      kind: "list",
      items: [
        "Experiencias interactivas",
        "Realidad virtual y simulación",
        "Aplicaciones con IA",
        "Interfaces para wearables",
      ],
      openLabel: "Ver más",
      detail: {
        heading: "Intereses",
        descriptions: [
          "[Describe este interés en una o dos frases.]",
          "[Describe este interés en una o dos frases.]",
          "[Describe este interés en una o dos frases.]",
          "[Describe este interés en una o dos frases.]",
        ],
      },
    },
  },
];
