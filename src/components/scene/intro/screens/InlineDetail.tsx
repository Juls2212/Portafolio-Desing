"use client";

import { aboutPanel, interestsPanel } from "../panel-data";
import { closeScreen, useScreenState, type ScreenId } from "@/lib/screen-state";
import { useSiteState } from "@/lib/site-state";
import { AboutDetail, InterestsDetail } from "./ScreenDetail";

/**
 * Disclosure region of the stacked fallback (small viewports, reduced motion, no JS-free shell).
 * Content mounts only after the first open, so the photo is never requested before that.
 */
export function InlineDetail({ id, suffix }: { id: ScreenId; suffix: string }) {
  const open = useScreenState((s) => s.open === id);
  const loaded = useScreenState((s) => s.loaded[id]);
  const spatial = useSiteState((s) => s.spatial);
  const mounted = loaded && !spatial;
  return (
    <div
      id={`screen-${id}${suffix}`}
      hidden={!open || spatial}
      className="mt-5 border-t border-divider pt-5 [animation:screen-fade_220ms_ease-out]"
    >
      {mounted &&
        (id === "sobre-mi" ? (
          <AboutDetail panel={aboutPanel} onNavigate={() => closeScreen()} />
        ) : (
          <InterestsDetail panel={interestsPanel} />
        ))}
    </div>
  );
}
