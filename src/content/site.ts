export type NavId =
  | "inicio"
  | "sobre-mi"
  | "stack"
  | "proyectos"
  | "trayectoria"
  | "testimonios"
  | "contacto";

export interface NavItem {
  id: NavId;
  label: string;
}

export interface SiteConfig {
  name: string;
  /** Two-letter monogram shown in the header logo. */
  monogram: string;
  role: string;
  tagline: string;
  /** Public URL of the CV. Undefined until a real file exists. */
  cvUrl?: string;
  nav: readonly NavItem[];
}

export const site: SiteConfig = {
  name: "Juliana Peñafiel",
  monogram: "JP",
  role: "Desarrolladora de software",
  tagline:
    "Construyo experiencias digitales interactivas donde el código, el diseño y el movimiento trabajan juntos.",
  cvUrl: undefined,
  // Stack comes BEFORE Projects (intentional; differs from the prototype).
  nav: [
    { id: "inicio", label: "Inicio" },
    { id: "sobre-mi", label: "Sobre mí" },
    { id: "stack", label: "Stack" },
    { id: "proyectos", label: "Proyectos" },
    { id: "trayectoria", label: "Trayectoria" },
    { id: "testimonios", label: "Testimonios" },
    { id: "contacto", label: "Contacto" },
  ],
};
