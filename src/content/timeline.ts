export type TimelineKind = "academica" | "profesional";

export interface TimelineEntry {
  id: string;
  kind: TimelineKind;
  date: string;
  title: string;
  organization: string;
  description: string;
  isPlaceholder: boolean;
}

// PLACEHOLDERS from the prototype. Replace with real, verifiable data.
export const timeline: readonly TimelineEntry[] = [
  {
    id: "formacion-1",
    kind: "academica",
    date: "[AAAA — Actualidad]",
    title: "[Programa académico]",
    organization: "[Institución educativa]",
    description: "[Describe el enfoque del programa, cursos relevantes o proyectos destacados.]",
    isPlaceholder: true,
  },
  {
    id: "experiencia-1",
    kind: "profesional",
    date: "[AAAA — AAAA]",
    title: "[Rol o cargo]",
    organization: "[Organización / Empresa]",
    description: "[Describe responsabilidades y logros verificables.]",
    isPlaceholder: true,
  },
  {
    id: "formacion-2",
    kind: "academica",
    date: "[AAAA]",
    title: "[Curso o formación complementaria]",
    organization: "[Entidad]",
    description: "[Opcional: elimina esta entrada si no aplica.]",
    isPlaceholder: true,
  },
  {
    id: "experiencia-2",
    kind: "profesional",
    date: "[AAAA — AAAA]",
    title: "[Proyecto, práctica o voluntariado]",
    organization: "[Organización]",
    description: "[Describe tu participación y resultados.]",
    isPlaceholder: true,
  },
];
