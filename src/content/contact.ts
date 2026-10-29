export interface ContactChannel {
  id: "correo" | "github" | "linkedin";
  label: string;
  /** Real destination (mailto: or https URL). Undefined until provided. */
  href?: string;
  /** Text shown while href is undefined. PLACEHOLDER. */
  placeholderDisplay: string;
}

export interface ContactInfo {
  heading: string;
  channels: readonly ContactChannel[];
}

// No real email or links are known yet: never fabricate them.
export const contact: ContactInfo = {
  heading: "¿Construimos algo interactivo?",
  channels: [
    { id: "correo", label: "Correo", href: undefined, placeholderDisplay: "tu.correo@dominio.com" },
    { id: "github", label: "GitHub", href: undefined, placeholderDisplay: "github.com/[usuario]" },
    { id: "linkedin", label: "LinkedIn", href: undefined, placeholderDisplay: "linkedin.com/in/[usuario]" },
  ],
};
