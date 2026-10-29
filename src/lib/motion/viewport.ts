/** Below this size (or with reduced motion) the lighter static composition is used. */
export const SPATIAL_MIN_WIDTH = 900;
export const SPATIAL_MIN_HEIGHT = 560;

export const isCompactViewport = (width: number, height: number): boolean =>
  width < SPATIAL_MIN_WIDTH || height < SPATIAL_MIN_HEIGHT;

/** True when the spatial (3D, scroll-driven) composition may be used. */
export const canUseSpatialScene = (width: number, height: number, reducedMotion: boolean): boolean =>
  !reducedMotion && !isCompactViewport(width, height);
