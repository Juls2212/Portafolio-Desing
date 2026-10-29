"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BlueprintPattern } from "@/components/scene/BlueprintPattern";
import { useScrollController } from "@/lib/motion/ScrollProvider";
import { getScreenState } from "@/lib/screen-state";
import { setSiteState } from "@/lib/site-state";
import { panels } from "@/content/panels";
import { EnterButton } from "./EnterButton";
import { holoPlanes } from "./holo-planes";
import { createIntroWriter } from "./intro-frame";
import { LAYERS, layerTransform, poseTransform } from "./intro-motion";
import { AboutPanelView, HeroPanelView, InterestsPanelView } from "./PanelContent";
import { aboutPanel, heroPanel, interestsPanel } from "./panel-data";
import { SpatialScreens } from "./screens/SpatialScreens";

const SECTION_CHIPS = ["PROYECTOS", "STACK", "TRAYECTORIA", "TESTIMONIOS", "CONTACTO"] as const;
const SUFFIX = "";

const planeStyle = (plane: (typeof holoPlanes)[number]): CSSProperties =>
  ({
    width: plane.width,
    height: plane.height,
    transform: poseTransform(plane.x, plane.y, plane.z, plane.rotateY),
    "--plane-line": `rgb(230 59 73 / ${plane.line})`,
    "--plane-fill": `rgb(230 59 73 / ${plane.fill})`,
    "--plane-grid": `rgb(230 59 73 / ${Math.min(0.4, plane.line * 0.6)})`,
  }) as CSSProperties;

/**
 * The spatial holographic room (desktop, motion allowed). Mounted client-side only, inside the
 * server-rendered runway and stage. It registers ONE zone on the shared scroll controller; all
 * animation is written imperatively by createIntroWriter.
 */
export function SpatialIntro() {
  const root = useRef<HTMLDivElement>(null);
  const controller = useScrollController();

  useEffect(() => {
    const el = root.current;
    const runway = el?.closest<HTMLElement>("[data-intro-runway]");
    if (!controller || !el || !runway) return;
    const writer = createIntroWriter(el);
    const unregister = controller.registerZone({
      id: "intro",
      element: runway,
      mode: "sticky",
      pointer: () => !getScreenState().open, // no pointer frames while a side screen is open
      onProgress: writer.onProgress,
      onSettle: writer.onSettle,
    });
    setSiteState({ spatial: true });
    return () => {
      unregister();
      setSiteState({ spatial: false });
    };
  }, [controller]);

  return (
    <div ref={root} className="intro-root" data-active="0">
      <div
        className="intro-floor intro-enter"
        data-intro="floor"
        aria-hidden="true"
        style={{ transform: "translateX(-50%) rotateX(80deg)" }}
      />
      <div className="intro-floor-glow intro-enter" data-intro="glow" aria-hidden="true" />

      <div className="intro-scene" data-intro="scene">
        <div
          className="room-wall-back"
          data-intro="wallBack"
          aria-hidden="true"
          style={{ transform: layerTransform(LAYERS.wallBack, 0, 0) }}
        >
          <BlueprintPattern seed={7} width={2300} height={1500} className="block" />
        </div>
        <div
          className="room-bloom"
          data-intro="bloom"
          aria-hidden="true"
          style={{ transform: layerTransform(LAYERS.bloom, 0, 0) }}
        />
        <div
          className="room-wall-side room-wall-left"
          data-intro="wallLeft"
          aria-hidden="true"
          style={{ transform: layerTransform(LAYERS.wallLeft, 0, 0) }}
        />
        <div
          className="room-wall-side room-wall-right"
          data-intro="wallRight"
          aria-hidden="true"
          style={{ transform: layerTransform(LAYERS.wallRight, 0, 0) }}
        />
        <div
          className="room-glass"
          data-intro="glass"
          aria-hidden="true"
          style={{ transform: layerTransform(LAYERS.glass, 0, 0) }}
        />

        {holoPlanes.map((plane, i) => (
          <div
            key={i}
            data-intro="plane"
            aria-hidden="true"
            className={`holo-plane holo-plane--${plane.variant} intro-enter`}
            style={planeStyle(plane)}
          />
        ))}

        {/* Readable panels, in DOM (and tab) order: presentation, about, interests. */}
        {panels.map((def, i) => (
          <div
            key={def.id}
            data-intro="panel"
            className="panel-slot intro-enter"
            style={{
              width: def.width,
              transform: poseTransform(def.transform.x, def.transform.y, def.transform.z, def.transform.rotateY),
            }}
          >
            <div
              data-panel-id={def.id}
              data-screen-panel={i > 0 ? def.id : undefined}
              className={i > 0 ? "panel-focus screen-panel" : "panel-focus"}
            >
              {i === 0 && <HeroPanelView panel={heroPanel} idSuffix={SUFFIX} className="bg-surface-deep/60" />}
              {i === 1 && <AboutPanelView panel={aboutPanel} idSuffix={SUFFIX} className="bg-surface-deep/60" />}
              {i === 2 && (
                <InterestsPanelView panel={interestsPanel} idSuffix={SUFFIX} className="bg-surface-deep/60" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table-portal: the top face is the access screen. Its size never changes; it scales by transform. */}
      <div className="table-rig intro-enter" data-intro="rig">
        <div className="table-slab" aria-hidden="true" />
        <div className="table-column" aria-hidden="true" />
        <div className="table-plane" data-intro="tablePlane" aria-hidden="true">
          <div className="table-screen">
            <div className="table-layer" data-intro="screenArt">
              <div className="table-layer table-grid" />
              <div className="table-layer table-bloom" />
              <div className="absolute left-1/2 top-1/2 h-[230px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-80">
                <BlueprintPattern seed={11} width={560} height={230} density={150} alpha={[0.32, 0.6]} className="block" />
              </div>
            </div>
            <div className="table-layer table-level2" data-intro="screenLevel2" style={{ opacity: 0 }} />
          </div>
          <div className="table-frame" data-intro="screenFrame" />
        </div>
        <div className="table-text" data-intro="textA">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] px-6 text-center">
            <span className="font-mono text-xs tracking-[0.2em] text-red-bright">ENTRAR AL PORTAFOLIO</span>
            <EnterButton className="inline-flex items-center gap-4 border border-border-strong bg-[rgb(230_59_73/0.14)] px-9 py-3 font-display text-[54px] leading-none text-text hover:bg-[rgb(230_59_73/0.28)]" />
            <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0 font-mono text-[11px] tracking-[0.16em] text-text-muted">
              {SECTION_CHIPS.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        data-intro="hud"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[clamp(20px,3vw,40px)] top-[88px] flex justify-between font-mono text-[11px] tracking-[0.16em] text-text-muted"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-red-bright">SALA HOLOGRÁFICA · NIVEL 01 / 02</span>
          <span>
            ENTRADA <span data-intro="pct" className="intro-pct text-red-bright">000</span> %
          </span>
        </div>
        <span>X 00.00 · Y 04.61 · Z −12.08</span>
      </div>

      <div
        data-intro="textB"
        aria-hidden="true"
        className="pointer-events-none intro-enter absolute inset-0 grid place-items-center px-6 text-center"
      >
        <div className="flex flex-col items-center gap-[18px]">
          <span className="font-mono text-xs tracking-[0.2em] text-red-bright">NIVEL 02 · INTERFAZ PRINCIPAL</span>
          <span className="font-display text-[clamp(48px,7vw,104px)] leading-[0.95]">
            Has entrado al
            <br />
            <em className="text-red">espacio de trabajo</em>
          </span>
          <span className="text-sm text-text-muted">Sigue desplazándote para explorar</span>
        </div>
      </div>

      <div
        data-intro="hint"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-text-muted"
      >
        <span>DESPLÁZATE PARA ENTRAR</span>
        <span className="h-[26px] w-px bg-[linear-gradient(var(--color-red),transparent)]" />
      </div>

      <SpatialScreens />
    </div>
  );
}
