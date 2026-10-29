import { HudLabel } from "@/components/ui/HudLabel";
import { EnterButton } from "./EnterButton";
import { AboutPanelView, HeroPanelView, InterestsPanelView } from "./PanelContent";
import { aboutPanel, heroPanel, interestsPanel } from "./panel-data";

const SECTION_CHIPS = ["PROYECTOS", "STACK", "TRAYECTORIA", "TESTIMONIOS", "CONTACTO"] as const;
const SUFFIX = "-m";

/**
 * Stacked composition for small viewports, reduced motion and no JS. Static: no scroll-driven
 * transforms and no parallax. Keeps the identity (grid, brackets, HUD, red glow).
 */
export function IntroFallback() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(140%_70%_at_50%_0%,var(--color-panel-tint)_0%,var(--color-background)_55%,var(--color-surface-raised)_100%)] px-5 pb-14 pt-[100px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(rgb(230_59_73/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(230_59_73/0.12)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(180deg,transparent,#000)]"
      />
      <div className="relative mx-auto flex max-w-[620px] flex-col gap-4">
        <HudLabel tone="accent" className="tracking-[0.16em]">
          SALA HOLOGRÁFICA · NIVEL 01 / 02
        </HudLabel>
        <HeroPanelView panel={heroPanel} idSuffix={SUFFIX} className="bg-surface-deep/50" />
        <div className="flex flex-wrap gap-4">
          <AboutPanelView inline panel={aboutPanel} idSuffix={SUFFIX} className="min-w-0 flex-[1_1_260px] bg-surface-deep/50" />
          <InterestsPanelView
            inline
            panel={interestsPanel}
            idSuffix={SUFFIX}
            className="min-w-0 flex-[1_1_260px] bg-surface-deep/50"
          />
        </div>
        <div className="intro-screen-tilt mt-5 flex flex-col items-center gap-3.5 border border-border-screen bg-surface-deep bg-[linear-gradient(rgb(230_59_73/0.16)_1px,transparent_1px),linear-gradient(90deg,rgb(230_59_73/0.16)_1px,transparent_1px)] bg-[size:40px_40px] bg-center px-5 py-10 text-center">
          <span className="font-mono text-[11px] tracking-[0.18em] text-red-bright">ENTRAR AL PORTAFOLIO</span>
          <EnterButton className="inline-flex items-center gap-3 border border-border-strong bg-[rgb(230_59_73/0.14)] px-6 py-3 font-display text-[34px] leading-none text-text hover:bg-[rgb(230_59_73/0.28)]" />
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-1.5 p-0 font-mono text-[11px] tracking-[0.14em] text-text-muted">
            {SECTION_CHIPS.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
