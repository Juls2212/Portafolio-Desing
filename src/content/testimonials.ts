export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  isPlaceholder: boolean;
}

// Exactly three SAMPLE testimonials. Replace with real ones, with each person's permission.
export const testimonials: readonly Testimonial[] = [
  {
    id: "muestra-1",
    quote: "Testimonio de ejemplo. Aquí irá la opinión de un docente o mentor sobre tu forma de trabajar.",
    author: "[Nombre de la persona]",
    role: "[Docente · Institución]",
    isPlaceholder: true,
  },
  {
    id: "muestra-2",
    quote:
      "Testimonio de ejemplo. Espacio para un compañero de equipo que haya colaborado contigo en un proyecto.",
    author: "[Nombre de la persona]",
    role: "[Compañero de proyecto]",
    isPlaceholder: true,
  },
  {
    id: "muestra-3",
    quote:
      "Testimonio de ejemplo. Espacio para un cliente o usuario que haya probado alguno de tus proyectos.",
    author: "[Nombre de la persona]",
    role: "[Cliente o usuario]",
    isPlaceholder: true,
  },
];
