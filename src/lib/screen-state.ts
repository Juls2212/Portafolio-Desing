"use client";

import { useSyncExternalStore } from "react";

/**
 * Which side screen of the intro room is open. Changes only on discrete events
 * (open, close, swap), never per frame. The pure `createScreenStore` is unit-tested;
 * the module-level `screenStore` is the instance the UI shares.
 */
export type ScreenId = "sobre-mi" | "intereses";

export interface ScreenState {
  readonly open: ScreenId | null;
  /** True once a screen has been opened: its heavy content (the photo) mounts lazily and stays. */
  readonly loaded: Readonly<Record<ScreenId, boolean>>;
  /** Set by the last close: true when focus should return to the opener (Escape, "Cerrar", button). */
  readonly restoreFocus: boolean;
}

interface CloseOptions {
  restoreFocus?: boolean;
}

const INITIAL: ScreenState = {
  open: null,
  loaded: { "sobre-mi": false, intereses: false },
  restoreFocus: false,
};

export function createScreenStore() {
  let state: ScreenState = INITIAL;
  const listeners = new Set<() => void>();

  const set = (next: ScreenState) => {
    state = next;
    listeners.forEach((listener) => listener());
  };

  const open = (id: ScreenId) => {
    if (state.open === id) return;
    set({ open: id, loaded: { ...state.loaded, [id]: true }, restoreFocus: false });
  };

  const close = ({ restoreFocus = false }: CloseOptions = {}) => {
    if (state.open === null) return;
    set({ ...state, open: null, restoreFocus });
  };

  return {
    get: (): ScreenState => state,
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    open,
    close,
    toggle(id: ScreenId, options?: CloseOptions) {
      if (state.open === id) close(options);
      else open(id);
    },
  };
}

export const screenStore = createScreenStore();

export const getScreenState = screenStore.get;
export const openScreen = screenStore.open;
export const closeScreen = screenStore.close;
export const toggleScreen = screenStore.toggle;

/** Select a primitive so a component re-renders only when that value changes. */
export function useScreenState<T>(select: (s: ScreenState) => T): T {
  return useSyncExternalStore(
    screenStore.subscribe,
    () => select(screenStore.get()),
    () => select(INITIAL),
  );
}
