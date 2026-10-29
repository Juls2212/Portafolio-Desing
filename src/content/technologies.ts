export interface Technology {
  /** Stable kebab-case identifier; referenced by projects and the keyboard. */
  id: string;
  name: string;
  category: string;
  /** One-line description (stack panel). */
  description: string;
  /** Short line shown when the key is pressed. PLACEHOLDER wording, editable. */
  tagline: string;
  /** Official brand color. */
  brandColor: string;
  /** Keycap top color (currently equal to the brand color). */
  keyColor: string;
  /** Single-color logo ink drawn on the keycap. */
  iconInk: string;
  /** Local SVG under public/. */
  icon: string;
}

// Keycap = brand color + single-color logo ink. Do not change the look.
export const technologies = [
  {
    id: "react",
    name: "React",
    category: "Librería de interfaces",
    description: "Componentes declarativos para construir interfaces interactivas y reutilizables.",
    tagline: "[Placeholder] Interfaces hechas con piezas pequeñas y claras.",
    brandColor: "#61DAFB",
    keyColor: "#61DAFB",
    iconInk: "#0B2530",
    icon: "/icons/tech/react.svg",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Lenguaje",
    description: "Tipado estático sobre JavaScript para código más seguro y mantenible.",
    tagline: "[Placeholder] Menos sorpresas, más confianza al cambiar código.",
    brandColor: "#3178C6",
    keyColor: "#3178C6",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/typescript.svg",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Lenguaje",
    description: "La base de la web: lógica, interacción y animación en el navegador.",
    tagline: "[Placeholder] El lenguaje donde todo cobra movimiento.",
    brandColor: "#F7DF1E",
    keyColor: "#F7DF1E",
    iconInk: "#1A1A1A",
    icon: "/icons/tech/javascript.svg",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Framework web",
    description: "Renderizado híbrido, rutas y despliegue optimizado para aplicaciones React.",
    tagline: "[Placeholder] Del componente al sitio publicado, sin fricción.",
    brandColor: "#F4F1EF",
    keyColor: "#F4F1EF",
    iconInk: "#111117",
    icon: "/icons/tech/nextjs.svg",
  },
  {
    id: "python",
    name: "Python",
    category: "Lenguaje",
    description: "Automatización, prototipos de IA y procesamiento de datos.",
    tagline: "[Placeholder] Ideas convertidas en prototipos rápidos.",
    brandColor: "#3776AB",
    keyColor: "#3776AB",
    iconInk: "#FFD43B",
    icon: "/icons/tech/python.svg",
  },
  {
    id: "java",
    name: "Java",
    category: "Lenguaje",
    description: "Programación orientada a objetos y aplicaciones multiplataforma.",
    tagline: "[Placeholder] Estructura sólida para aplicaciones grandes.",
    brandColor: "#E76F00",
    keyColor: "#E76F00",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/java.svg",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Base de datos",
    description: "Base de datos relacional para modelar y consultar información estructurada.",
    tagline: "[Placeholder] Datos ordenados y fáciles de consultar.",
    brandColor: "#4169E1",
    keyColor: "#4169E1",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/postgresql.svg",
  },
  {
    id: "docker",
    name: "Docker",
    category: "Infraestructura",
    description: "Contenedores para entornos reproducibles de desarrollo y despliegue.",
    tagline: "[Placeholder] El mismo entorno en cualquier máquina.",
    brandColor: "#2496ED",
    keyColor: "#2496ED",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/docker.svg",
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    category: "Estilos",
    description: "Utilidades CSS para sistemas visuales consistentes y rápidos de iterar.",
    tagline: "[Placeholder] Un sistema visual coherente, tecla a tecla.",
    brandColor: "#06B6D4",
    keyColor: "#06B6D4",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/tailwindcss.svg",
  },
  {
    id: "unity",
    name: "Unity",
    category: "Motor 3D / XR",
    description: "Simulaciones, experiencias de realidad virtual y prototipos 3D interactivos.",
    tagline: "[Placeholder] Mundos interactivos para explorar en 3D.",
    brandColor: "#2A2A30",
    keyColor: "#2A2A30",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/unity.svg",
  },
  {
    id: "godot",
    name: "Godot",
    category: "Motor de juegos",
    description: "Motor libre para experiencias interactivas ligeras en 2D y 3D.",
    tagline: "[Placeholder] Experiencias ligeras con un motor abierto.",
    brandColor: "#478CBF",
    keyColor: "#478CBF",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/godot.svg",
  },
  {
    id: "git",
    name: "Git",
    category: "Control de versiones",
    description: "Historial, ramas y colaboración sobre el código.",
    tagline: "[Placeholder] Cada cambio queda registrado y se puede revertir.",
    brandColor: "#F05032",
    keyColor: "#F05032",
    iconInk: "#FFFFFF",
    icon: "/icons/tech/git.svg",
  },
] as const satisfies readonly Technology[];

/** Union of every technology id; invalid references fail typecheck. */
export type TechnologyId = (typeof technologies)[number]["id"];

const byId: ReadonlyMap<string, Technology> = new Map(
  technologies.map((tech): [string, Technology] => [tech.id, tech]),
);

export function getTechnology(id: TechnologyId): Technology {
  const tech = byId.get(id);
  if (!tech) throw new Error(`Unknown technology id: ${id}`);
  return tech;
}
