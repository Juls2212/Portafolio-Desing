import { AboutSection } from "@/components/sections/AboutSection";
import { SectionStub } from "@/components/sections/SectionStub";
import { IntroSection } from "@/components/scene/intro/IntroSection";

export default function HomePage() {
  return (
    <>
      <IntroSection />
      <AboutSection />
      {/* TODO Phase 3: Stack (before Projects). */}
      <SectionStub id="stack" index="02" label="STACK TECNOLÓGICO" title="Herramientas" emphasis="en uso" />
      {/* TODO Phase 3: Projects. */}
      <SectionStub id="proyectos" index="03" label="PROYECTOS" title="Proyectos" emphasis="seleccionados" />
      {/* TODO Phase 4: Trayectoria, Testimonios, Contacto. */}
      <SectionStub id="trayectoria" index="04" label="TRAYECTORIA" title="Formación y" emphasis="experiencia" />
      <SectionStub id="testimonios" index="05" label="TESTIMONIOS" title="Lo que" emphasis="dicen" />
      <SectionStub
        id="contacto"
        index="06"
        label="CONTACTO"
        title="¿Construimos algo"
        emphasis="interactivo"
        titleEnd="?"
      />
    </>
  );
}
