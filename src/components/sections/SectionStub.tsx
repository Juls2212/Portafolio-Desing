import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { NavId } from "@/content/site";

interface SectionStubProps {
  id: Exclude<NavId, "inicio" | "sobre-mi">;
  index: string;
  label: string;
  title: string;
  emphasis: string;
  titleEnd?: string;
}

/** Anchor stub with the correct id so navigation and scrollspy work. Replaced in Phases 3-4. */
export function SectionStub({ id, index, label, title, emphasis, titleEnd }: SectionStubProps) {
  return (
    <section id={id} aria-labelledby={`t-${id}`} className="border-t border-hairline py-[clamp(72px,9vw,120px)]">
      <Container>
        <SectionHeader
          index={index}
          label={label}
          title={title}
          emphasis={emphasis}
          titleEnd={titleEnd}
          id={`t-${id}`}
          className="mb-8"
        />
        <p className="font-mono text-xs tracking-[0.16em] text-text-muted">PRÓXIMAMENTE</p>
      </Container>
    </section>
  );
}
