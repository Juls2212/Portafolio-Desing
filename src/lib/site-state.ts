"use client";

import { useSyncExternalStore } from "react";
import type { NavId } from "@/content/site";

/**
 * Tiny external store for the few discrete values the header needs. It changes
 * only on discrete events (level switch, active section, scene mode), never per
 * frame, so subscribers re-render rarely.
 */
export interface SiteState {
  level: 1 | 2;
  active: NavId;
  /** True while the spatial intro owns the level (the tracker must not override it). */
  spatial: boolean;
}

const INITIAL: SiteState = { level: 1, active: "inicio", spatial: false };

let state: SiteState = INITIAL;
const listeners = new Set<() => void>();

export const getSiteState = (): SiteState => state;

export function setSiteState(patch: Partial<SiteState>): void {
  const next = { ...state, ...patch };
  if (next.level === state.level && next.active === state.active && next.spatial === state.spatial) return;
  state = next;
  listeners.forEach((listener) => listener());
}

export function subscribeSiteState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Selects a primitive from the store so a component re-renders only when that value changes. */
export function useSiteState<T>(select: (s: SiteState) => T): T {
  return useSyncExternalStore(
    subscribeSiteState,
    () => select(state),
    () => select(INITIAL),
  );
}
