"use client";

import { CornerFrame } from "@/components/ui/CornerFrame";
import { HudLabel } from "@/components/ui/HudLabel";
import { closeScreen, useScreenState, type ScreenId } from "@/lib/screen-state";
import { aboutPanel, interestsPanel } from "../panel-data";
import { AboutDetail, InterestsDetail } from "./ScreenDetail";

/**
 * The expanded face of a side panel. A separate element at its final size: it is moved and scaled
 * from the source panel's rect by screen-focus.ts (transform and opacity only), never resized.
 * While closed it is `inert` (out of the accessibility tree and tab order) and visibility:hidden.
 */
export function ScreenFace({ id }: { id: ScreenId }) {
  const open = useScreenState((s) => s.open === id);
  const loaded = useScreenState((s) => s.loaded[id]);
  const panel = id === "sobre-mi" ? aboutPanel : interestsPanel;
  const headingId = `screen-${id}-title`;

  return (
    <CornerFrame
      as="section"
      id={`screen-${id}`}
      data-screen-face={id}
      data-state="closed"
      aria-labelledby={headingId}
      inert={!open}
      className="screen-face border border-border-strong bg-surface-deep/[0.97] bg-[linear-gradient(180deg,rgb(230_59_73/0.12),rgb(230_59_73/0.03)_60%,rgb(17_17_23/0.4))] p-[clamp(20px,3vw,32px)] shadow-glow-panel"
    >
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-divider pb-3">
        <HudLabel>{panel.label} · PANTALLA ABIERTA</HudLabel>
        <button
          type="button"
          onClick={() => closeScreen({ restoreFocus: true })}
          className="inline-flex h-10 items-center border border-border-neutral px-4 text-[13px] text-text hover:border-red"
        >
          Cerrar
        </button>
      </div>
      <h2
        id={headingId}
        tabIndex={-1}
        className="mb-6 font-display text-[clamp(36px,4.5vw,52px)] font-normal leading-none tracking-[-0.01em] outline-none"
      >
        {panel.content.detail.heading}
      </h2>
      {loaded &&
        (id === "sobre-mi" ? <AboutDetail panel={aboutPanel} onNavigate={() => closeScreen()} /> : <InterestsDetail panel={interestsPanel} />)}
    </CornerFrame>
  );
}
