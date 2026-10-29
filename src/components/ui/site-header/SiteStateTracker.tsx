"use client";

import { useEffect } from "react";
import { site, type NavId } from "@/content/site";
import { getSiteState, setSiteState, subscribeSiteState } from "@/lib/site-state";

/**
 * Keeps the site state in sync without per-frame work:
 * - scrollspy: an IntersectionObserver watching a thin band at 35% of the viewport;
 * - level in the stacked fallback (the spatial intro sets the level itself).
 * Renders nothing.
 */
export function SiteStateTracker() {
  useEffect(() => {
    const ids = site.nav.map((item) => item.id);
    const inBand = new Set<NavId>();

    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as NavId;
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        }
        const current = ids.filter((id) => inBand.has(id)).at(-1);
        if (current) setSiteState({ active: current });
      },
      { rootMargin: "-35% 0px -64% 0px", threshold: 0 },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    }

    const evaluateFallbackLevel = () => {
      if (getSiteState().spatial) return;
      const intro = document.getElementById("inicio");
      if (!intro) return;
      setSiteState({ level: intro.getBoundingClientRect().bottom < window.innerHeight * 0.5 ? 2 : 1 });
    };
    const introObserver = new IntersectionObserver(evaluateFallbackLevel, {
      rootMargin: "-50% 0px 0px 0px",
      threshold: 0,
    });
    const intro = document.getElementById("inicio");
    if (intro) introObserver.observe(intro);

    // When the spatial scene unmounts (resize, reduced motion), re-derive the level.
    const unsubscribe = subscribeSiteState(() => {
      if (!getSiteState().spatial) evaluateFallbackLevel();
    });

    return () => {
      spy.disconnect();
      introObserver.disconnect();
      unsubscribe();
    };
  }, []);

  return null;
}
