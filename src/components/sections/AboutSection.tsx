import { CvAction } from "@/components/ui/CvAction";
import { Container } from "@/components/ui/Container";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { HudLabel } from "@/components/ui/HudLabel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionLink } from "@/components/ui/SectionLink";
import { cx } from "@/lib/cx";
import { about } from "@/content/about";

/** Start of Level 2. Layout ported from the prototype; copy comes from src/content/about.ts. */
export function AboutSection() {
  return (
    <section
      id="sobre-mi"
      aria-labelledby="t-sobre-mi"
      className="pb-[clamp(72px,9vw,120px)] pt-[clamp(96px,12vw,160px)]"
    >
      <Container>
        <SectionHeader
          index="01"
          label="SOBRE MÍ"
          title={about.title}
          emphasis={about.emphasis}
          id="t-sobre-mi"
          className="mb-[clamp(40px,6vw,72px)]"
        />
        <div className="flex flex-wrap items-start gap-[clamp(32px,5vw,72px)]">
          <CornerFrame
            corners={["tl", "br"]}
            className="grid aspect-[4/5] w-full min-w-0 flex-[0_1_380px] place-items-center border border-border-soft bg-surface-raised bg-[repeating-linear-gradient(135deg,rgb(230_59_73/0.08)_0_2px,transparent_2px_12px)]"
          >
            <span className="font-mono text-[11px] tracking-[0.14em] text-text-muted">{about.portraitLabel}</span>
          </CornerFrame>

          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-7">
            <p className="text-pretty font-display text-[clamp(26px,3vw,38px)] leading-[1.2]">{about.lead}</p>
            <p className="max-w-[60ch] text-[17px] leading-[1.65] text-text-muted">{about.story}</p>
            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-t border-divider">
              {about.facts.map((fact) => (
                <div key={fact.label} className="border-b border-divider py-[18px]">
                  <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-red-bright">
                    {fact.label}
                  </dt>
                  <dd className={cx("m-0 text-base", fact.isPlaceholder && "text-text-muted")}>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-3">
              <CvAction className="h-12 px-[22px]" />
              <SectionLink to="contacto" variant="secondary" className="h-12 px-[22px]">
                Contactar
              </SectionLink>
            </div>
            <HudLabel className="sr-only">Contenido provisional</HudLabel>
          </div>
        </div>
      </Container>
    </section>
  );
}
