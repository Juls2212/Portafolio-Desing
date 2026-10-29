"use client";

import { cx } from "@/lib/cx";
import { toggleScreen, useScreenState, type ScreenId } from "@/lib/screen-state";

/**
 * The one accessible control of a side panel. Used by the spatial scene (opens the screen face)
 * and by the stacked fallback (toggles the inline disclosure). `suffix` picks the matching region id.
 */
export function OpenScreenButton({
  id,
  label,
  suffix,
  className,
}: {
  id: ScreenId;
  label: string;
  suffix: string;
  className?: string;
}) {
  const open = useScreenState((s) => s.open === id);
  return (
    <button
      type="button"
      data-screen-opener={id}
      aria-expanded={open}
      aria-controls={`screen-${id}${suffix}`}
      onClick={(event) => {
        event.stopPropagation(); // the panel itself is also clickable: never fire twice
        toggleScreen(id, { restoreFocus: true });
      }}
      className={cx(
        "inline-flex min-h-11 items-center gap-2 border-b border-red pb-1 text-[13px] font-medium text-text hover:text-red-bright",
        className,
      )}
    >
      {label} <span aria-hidden="true">{open ? "↑" : "→"}</span>
    </button>
  );
}
