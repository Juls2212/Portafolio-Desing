export interface AboutFact {
  label: string;
  value: string;
  isPlaceholder: boolean;
}

export interface AboutContent {
  title: string;
  emphasis: string;
  lead: string;
  /** PLACEHOLDER: replace with the real story. */
  story: string;
  portraitLabel: string;
  /** Real photo for the Sobre mí screen. Undefined until provided; alt must be meaningful Spanish text. */
  photo?: { src: string; alt: string };
  facts: readonly AboutFact[];
}

// Copy comes from the approved prototype; bracketed text is a placeholder.
export const about: AboutContent = {
  title: "Código con",
  emphasis: "sentido de lugar",
  lead: "Soy desarrolladora de software interesada en construir experiencias digitales interactivas: interfaces, simulaciones y aplicaciones que se sienten tangibles.",
  story:
    "[Escribe aquí tu historia: cómo empezaste a programar, qué tipo de problemas disfrutas resolver y qué estás aprendiendo ahora.]",
  portraitLabel: "[ RETRATO · 4:5 ]",
  photo: undefined,
  facts: [
    { label: "Enfoque", value: "Experiencias interactivas", isPlaceholder: false },
    { label: "Ubicación", value: "[Ciudad, País]", isPlaceholder: true },
    { label: "Idiomas", value: "[Idiomas]", isPlaceholder: true },
    { label: "Disponibilidad", value: "[Estado actual]", isPlaceholder: true },
  ],
};
