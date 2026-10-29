"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createScrollController, type ScrollController } from "./scroll-controller";

const ScrollControllerContext = createContext<ScrollController | null>(null);

/**
 * A stable handle that creates the real controller lazily, on the first zone registration (always
 * inside an effect, so never during SSR), and destroys it on teardown. Consumers can therefore
 * register zones from their own effects without any provider state.
 */
function createLazyHandle(): ScrollController {
  let inner: ScrollController | null = null;
  const get = () => (inner ??= createScrollController());
  return {
    registerZone: (zone) => get().registerZone(zone),
    request: () => inner?.request(),
    destroy: () => {
      inner?.destroy();
      inner = null;
    },
  };
}

/** Provides the single shared scroll controller; every listener and frame is released on unmount. */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const [handle] = useState(createLazyHandle);

  useEffect(() => () => handle.destroy(), [handle]);

  return <ScrollControllerContext.Provider value={handle}>{children}</ScrollControllerContext.Provider>;
}

export const useScrollController = (): ScrollController | null => useContext(ScrollControllerContext);
