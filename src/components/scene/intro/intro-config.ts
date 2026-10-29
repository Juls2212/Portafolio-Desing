/** Length of the scroll runway containing the sticky intro stage, in viewport heights. */
export const INTRO_RUNWAY_VH = 340;

/** Entry animation duration; after this no frames are scheduled until user input. */
export const ENTRY_MS = 2400;

/** Scroll progress above which the site is at Level 2. */
export const LEVEL2_THRESHOLD = 0.94;

/** Access screen (table top) size in scene px. It never changes size: it is scaled with a transform. */
export const SCREEN_WIDTH = 1100;
export const SCREEN_HEIGHT = 462;

/** Fallback token values, used only if the CSS custom properties cannot be read. */
export const DEFAULT_SCREEN_ROTATE_X = 74;
export const DEFAULT_FLOOR_ROTATE_X = 80;

/** Table at rest: scaled down and raised so the slab and pedestal stay in view below the screen. */
export const TABLE_REST_SCALE = 0.82;
export const TABLE_REST_Y = 0.31; // viewport heights below center

/** Side screens (open state). Opening/closing uses CSS transitions on transform and opacity only. */
export const SCREEN_MS = 520;
export const SCREEN_EASE = "cubic-bezier(0.65, 0, 0.35, 1)"; // same curve as `ease` (cubic in-out)
export const SCREEN_FLY_SCALE = 1.4;
export const SCREEN_DIM_OPACITY = 0.2;
export const SCREEN_RECEDE_Z = -180;
/** Half of the fixed header: the open screen is centered in the area below it. */
export const HEADER_HALF = 32;
/** Page scroll (px) after which an open screen closes. */
export const SCREEN_SCROLL_CLOSE_PX = 40;
