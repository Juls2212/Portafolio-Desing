import { getTechnology, type Technology, type TechnologyId } from "./technologies.ts";

export interface Project {
  id: string;
  title: string;
  kind: string;
  shortDescription: string;
  longDescription: string;
  /** Only ids that exist in technologies.ts (checked by the compiler). */
  technologyIds: TechnologyId[];
  /** Public path under /images/projects/. Undefined until a real capture exists. */
  image?: string;
  extraImages?: string[];
  githubUrl?: string;
  demoUrl?: string;
  demoLabel: string;
  status?: "placeholder" | "in-progress" | "published";
}

// Descriptions are the prototype's provisional copy; bracketed text is a placeholder.
// URLs are intentionally undefined: never fabricate links.
export const projects: readonly Project[] = [
  {
    id: "ares",
    title: "Ares",
    kind: "Aplicación de escritorio",
    shortDescription: "Asistente de productividad con inteligencia artificial para escritorio.",
    longDescription:
      "Asistente de productividad con inteligencia artificial para escritorio. [Amplía: problema que resuelve, funciones principales y tu rol.]",
    technologyIds: [], // TODO: confirm stack (the prototype only lists "[Stack]")
    demoLabel: "Demo",
    status: "placeholder",
  },
  {
    id: "bookshelf",
    title: "BookShelf",
    kind: "Aplicación móvil",
    shortDescription: "Biblioteca digital móvil con identificación de libros asistida por IA.",
    longDescription:
      "Biblioteca digital móvil con identificación de libros asistida por IA. [Amplía con detalles del proyecto.]",
    technologyIds: [], // TODO: confirm stack (no technology from the 12 is listed in the prototype)
    demoLabel: "Demo",
    status: "placeholder",
  },
  {
    id: "vr-coffee-roasting-simulator",
    title: "VR Coffee Roasting Simulator",
    kind: "Simulador VR",
    shortDescription: "Simulador inmersivo para la formación en el tostado de café.",
    longDescription:
      "Simulador inmersivo para la formación en el tostado de café. [Amplía con detalles del proyecto.]",
    technologyIds: ["unity"], // TODO: confirm; the prototype lists Unity plus "[Stack]"
    demoLabel: "Video demo",
    status: "placeholder",
  },
  {
    id: "wear-os-presentation-controller",
    title: "Wear OS Presentation Controller",
    kind: "App para smartwatch",
    shortDescription: "Aplicación para smartwatch que permite controlar presentaciones desde la muñeca.",
    longDescription:
      "Aplicación para smartwatch que permite controlar presentaciones desde la muñeca. [Amplía con detalles del proyecto.]",
    technologyIds: [], // TODO: confirm stack (Wear OS and Android are not among the 12 technologies)
    demoLabel: "Video demo",
    status: "placeholder",
  },
];

/** Resolves a project's technology ids to full records, in declaration order. */
export function getProjectTechnologies(project: Pick<Project, "technologyIds">): Technology[] {
  return project.technologyIds.map(getTechnology);
}
