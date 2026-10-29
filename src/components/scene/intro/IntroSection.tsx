import type { CSSProperties } from "react";
import { INTRO_RUNWAY_VH } from "./intro-config";
import { IntroFallback } from "./IntroFallback";
import { IntroStage } from "./IntroStage";

/**
 * Level 1. The server renders both compositions; CSS (intro.css) picks one with a media query
 * so there is no hydration flash. The spatial scene mounts client-side inside the stage.
 */
export function IntroSection() {
  return (
    <section
      id="inicio"
      aria-label="Nivel 01, sala de presentación"
      className="relative"
      style={{ "--intro-runway-height": `${INTRO_RUNWAY_VH}vh` } as CSSProperties}
    >
      <div className="intro-fallback">
        <IntroFallback />
      </div>
      <div className="intro-runway" data-intro-runway>
        <div className="intro-stage">
          <IntroStage />
        </div>
      </div>
    </section>
  );
}
